import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';
import DiscordVoter from './interfaces/voter';
import DiscordBot from './interfaces/bot';
import w from 'wumpfetch';

export interface InstanceInfo {
    port: number;
    auth: string;
    path: string;
    webhook: WebhookOptions;
}

export interface WebhookOptions {
    enabled: boolean;
    token: string;
    id: string;
}

export default class Instance extends EventEmitter {
    public options: InstanceInfo;
    public port: number;
    public authKey: string;
    public path: string;
    public server: Server;
    public requests: number;
    public webhook: WebhookOptions;

    constructor(info: InstanceInfo) {
        super();

        this.options  = Object.assign<{}, InstanceInfo>({}, info);
        this.port     = info.port;
        this.authKey  = info.auth;
        this.path     = info.path;
        this.server   = createServer(this.handle.bind(this));
        this.requests = 0;
        this.webhook  = info.webhook;
    }

    listen() {
        this.server.listen(this.port, () => this.emit('listen'));
    }

    async executeWebhook(payload: any) {
        if (!this.webhook.enabled) throw new Error('Discord Webhook is not enabled');
        await w({
            url: `https://discordapp.com/api/webhooks/${this.webhook.id}/${this.webhook.token}?wait=true`,
            method: 'POST',
            data: {
                embeds: [payload]
            }
        }).send();
    }

    async fetchUser(id: string) {
        const req = await w({
            url: `https://discord.boats/api/v2/user/${id}`,
            method: 'GET'
        }).send();
        const data = req.json();
        return new DiscordVoter(data);
    }

    async fetchBot(id: string) {
        const req = await w({
            url: `https://discord.boats/api/v2/bot/${id}`,
            method: 'GET'
        }).send();
        const data = req.json();
        return new DiscordBot(data);
    }

    private async handle(req: IncomingMessage, res: ServerResponse) {
        if (req.url === this.path && req.method === 'POST') {
            if (!req.headers['authorization']) {
                this.emit('error', 'discord.boats has no "Authorization" header');
                res.statusCode = 401;
                res.end();
            }

            if (req.headers.authorization !== this.authKey) {
                this.emit('error', 'discord.boats provided an invalid token');
                res.statusCode = 403;
                res.end();
            }
            
            if (req.headers['content-type'] !== 'application/json') {
                this.emit('error', 'discord.boats provided an invalid content type');
                res.statusCode = 401;
                res.end();
            }

            let data: any = '';
            req
                .on('data', chunk => data += chunk)
                .on('end', async() => {
                    if (data) {
                        try {
                            data = JSON.parse(data);
                        } catch(ex) {
                            this.emit('error', 'Unable to parse JSON');
                            res.statusCode = 500;
                            res.end();
                        }

                        const user = await this.fetchUser(data.user.id);
                        const bot = await this.fetchBot(data.bot.id);
                        this.emit('vote', user, bot);
                        this.requests++;
                        res.statusCode = 200;
                        res.end();
                    } else {
                        this.emit('error', 'No data was parsed');
                        res.statusCode = 500;
                        res.end();
                    }
                });
        } else {
            this.emit('error', 'Invalid method or path');
            res.statusCode = 404;
            res.end();
        }
    }
}

import { Server, createServer, ServerResponse, IncomingMessage } from 'http';
import User, { UserPacket } from './entities/User';
import { get, setDefaults } from 'wumpfetch';
import Bot, { BotPacket } from './entities/Bot';
import { EventEmitter } from 'events';
import MemoryStorage from './storages/MemoryStorage';
import Storage from './storages/Storage';

/**
 * Any additional options to add
 */
export interface Options {
    /**
     * The authenication key to use
     */
    auth: string;

    /**
     * The storage to use (default: MemoryStorage)
     */
    storage?: Storage;

    /**
     * Webhook options (to send events to)
     */
    webhook?: {
        enabled: boolean;
        url: string | null;
    }

    /**
     * Any wumpfetch defaults to set
     */
    defaults?: object;
}

export default class Laffey extends EventEmitter {
    /**
     * The port to use
     */
    public port: number;

    /**
     * The path for discord.boats to send packets to
     */
    public path: string;

    /**
     * The authenication key to use
     */
    public authKey: string;

    /**
     * The webhook options
     */
    public webhook: { enabled: boolean; url: string | null; }

    /**
     * The storage to add packets of data
     */
    public storage: Storage;

    /**
     * The HTTP server
     */
    public server: Server;

    /**
     * How many times discord.boats requested to us
     */
    public requests: number = 0;

    /**
     * Creates a new Laffey instance
     * @param port The port to use
     * @param path The path to use
     * @param options Any additional options
     * @example
     * new Laffey(6969, '/webhook');
     */
    constructor(port: number, path: string, options: Options) {
      super();

      this.storage = options.storage || new MemoryStorage();
      this.webhook = options.webhook || { enabled: false, url: null };
      this.authKey = options.auth;
      this.server = createServer((req, res) => this.onRequest.apply(this, [req, res]));
      this.port   = port;
      this.path   = path;

      setDefaults(options.defaults || {
        headers: {
          'User-Agent': `Laffey (https://github.com/auguwu/Laffey, v${require('../package.json').version})`,
          'Content-Type': 'application/json'
        }
      });
    }

    listen() {
      this.server.listen(this.port, () => this.emit('listen'));
    }

    private async executeWebhook(payload: any) {
      if (!this.webhook.enabled) throw new Error('Discord Webhook is not enabled');
      await get({
        url: `${this.webhook.url!}?wait=true`,
        method: 'POST',
        data: {
          embeds: [payload]
        }
      }).send();
    }

    private onRequest(req: IncomingMessage, res: ServerResponse) {
      if (req.url === this.path && req.method === 'POST') {
        if (!req.headers.authorization) {
          this.emit('error', 'No "Authorization" header was provided');
          res.statusCode = 401;
          res.end();
        }

        if (req.headers.authorization !== this.authKey) {
          this.emit('error', 'discord.boats requested with an invalid key');
          res.statusCode = 403;
          res.end();
        }

        if (req.headers['content-type'] !== 'application/json') {
          this.emit('error', `discord.boats provided an invalid content type (${req.headers['content-type']})`);
          res.statusCode = 406;
          res.end();
        }

        let data = Buffer.alloc(0);
        req.on('data', chunk =>
          data = Buffer.concat([data, chunk])
        );

        req.on('end', async() => {
          let payload!: any;
          try {
            payload = JSON.parse(data.toString());
          } catch {
            this.emit('error', 'Unable to parse payload');
            res.statusCode = 500;
            res.end();
          }

          this.emit('vote', payload.bot.id, payload.user.id);
          this.requests++;

          const bot = new Bot(payload.bot);
          const user = new User(payload.user);

          await this.storage.addPacket(bot, user);
          await this.executeWebhook({
            title: `User ${user.username}#${user.discriminator} has voted for bot ${bot.name}`,
            description: `Now at ${this.storage.size()} votes today with ${this.requests.toLocaleString()} requests`
          });

          res.statusCode = 200;
          res.end();
        });
      } else {
        this.emit('error', `Invalid method (${req.method}) or path (${req.url})`);
        res.statusCode = 404;
        res.end();
      }
    }
}

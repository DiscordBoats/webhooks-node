const { EventEmitter } = require('events');
const { createServer } = require('http');
const DiscordVoter = require('./interfaces/voter');
const w = require('wumpfetch');

module.exports = class Laffey extends EventEmitter {
    /**
     * Create a new instance of the Laffey instance
     * @param {LaffeyInfo} info The information to addon
     */
    constructor(info) {
        super();

        this.options  = Object.assign({}, info);
        this.port     = info.port;
        this.authKey  = info.auth;
        this.storage  = info.storage;
        this.path     = info.path;
        this.server   = createServer(this.handleAllRequests.bind(this));
        this.requests = 0;
        this.webhook  = info.webhook;

        Object.freeze(this.options);
    }

    /**
     * Listens to the port requested from the `Laffey.LaffeyInfo` options.
     */
    listen() {
        this.server.listen(this.port, () => this.emit('listen'));
    }

    /**
     * Sends an embed to Discord
     * @param {object} payload The payload
     */
    async executeWebhook(payload) {
        await w({
            url: `https://discordapp.com/api/webhooks/${this.webhook.id}/${this.webhook.token}?wait=true`,
            method: 'POST',
            data: {
                embeds: [payload]
            }
        }).send();
    }

    /**
     * Fetches the user
     * @param {string} id The ID
     * @returns {Promise<DiscordVoter>} The voter
     */
    async fetchUser(id) {
        const req = await w({
            url: `https://discord.boats/api/v2/user/${id}`,
            method: 'GET'
        }).send();
        const result = req.json();
        return new DiscordVoter(result);
    }

    /**
     * Handles all requests
     * @param {import('http').IncomingMessage} req The request
     * @param {import('http').ServerResponse} res The response
     */
    async handleAllRequests(req, res) {
        if (!req.headers['authorization']) return this.emit('error', `Unable to send request to discord.boats (NO_AUTH)`);
        if (req.headers.authorization !== this.authKey) return this.emit('error', `Unable to send request to discord.boats (AUTH_KEY_INVALID)`);

        const user = this.storage.client
    }
}

/**
 * @typedef {Object} LaffeyInfo
 * @prop {import('./interfaces/storage')} storage The storage unit
 * @prop {WebhookOptions} webhook The webhook
 * @prop {number} port The port to listen to
 * @prop {string} auth The authencation key to make connections for discord.boats
 * @prop {string} path The path
 * 
 * @typedef {object} WebhookOptions
 * @prop {boolean} enabled If you want the webhook to send embeds
 * @prop {string} token The webhook token
 * @prop {string} id The webhook id 
 */
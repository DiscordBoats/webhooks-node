const DiscordVoter = require('../interfaces/voter');
const Storage = require('../interfaces/storage');
const Redis = require('ioredis');

module.exports = class RedisStorage extends Storage {
    constructor(options) {
        super({ type: 'redis' });

        this.client = new Redis({
            port: options.port,
            host: options.host
        });
    }

    add(pkt) {
        const voter = new DiscordVoter(pkt);
        this.client.rpush(`voter:${voter.id}`, 'VOTED');
        return voter;
    }
}

/**
 * @typedef {object} RedisOptions
 * @prop {string} host The host of the Redis server
 * @prop {number} port The port of the Redis server
 */
const Storage = require('../interfaces/storage');
const Redis   = require('ioredis');
const Voter   = require('../interfaces/voter');

module.exports = class RedisStorage extends Storage {
    /**
     * Create a new instance of the Redis storage instance
     * @prop {RedisStorageInfo} [info] The information
     */
    constructor(info) {
        super({ type: 'redis' });

        this.options = Object.assign({}, info);
        this.client  = new Redis(info.port? info.port: 6379, info.host? info.host: '127.0.0.1', {
            keyPrefix: 'laffey.'
        });
    }

    /**
     * Adds the user to the cache
     * @param {Voter.VoterPacket} pkt The packet
     * @returns {Voter} The voter
     */
    add(pkt) {
        const user = new Voter(pkt);
        const json = JSON.stringify({
            user: {
                id: pkt.id,
                username: pkt.username,
                discriminator: pkt.discriminator
            },
            voted: true
        });
        this.client.set('key', json);
        return user;
    }
}

/**
 * @typedef {Object} RedisStorageInfo
 * @prop {number} [port=6379] The port for redis
 * @prop {string} [host='127.0.0.1'] The host to connect to
 */
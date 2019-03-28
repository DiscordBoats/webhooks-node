const Storage = require('../interfaces/storage');
const Enmap   = require('enmap');
const Voter   = require('../interfaces/voter');

module.exports = class EnmapStorage extends Storage {
    /**
     * Create a new instance of the Enmap storage
     * @param {EnmapStorageOptions} [options] Additional options
     */
    constructor(options) {
        super({ type: 'enmap' });

        this.options = Object.assign({ 
            name: 'Laffey', 
            fetchAll: true 
        }, options);
        
        /**
         * The storage instance
         * @type {Enmap<string | number, Voter>}
         */
        this.storage = new Enmap({
            name: options.name || 'Laffey',
            fetchAll: options.fetchAll || true
        });
        
        // Objects frozen until CtrlOrCmd+C in Terminal
        // Made only as an Readonly<Laffey.EnmapStorageOptions> type.
        Object.freeze(this.options);
    }

    /**
     * Adds the user
     * @param {import('../interfaces/voter').VoterPacket} pkt The packet
     * @returns {Voter} The user who voted
     */
    add(pkt) {
        const user = new Voter(pkt);
        this.storage.set(pkt.id, user);
        return user;
    }
}

/**
 * @typedef {Object} EnmapStorageOptions
 * @prop {boolean} [fetchAll=true] Fetch all stuff
 * @prop {string} [name='Laffey'] The name of the storage
 */

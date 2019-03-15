const Storage = require('../interfaces/storage');
const Enmap   = require('enmap');
const Voter   = require('../interfaces/voter');

module.exports = class EnmapStorage extends Storage {
    /**
     * Create a new instance of the enmap storage
     */
    constructor() {
        super({ type: 'enmap' });

        /**
         * The storage instance
         * @type {Enmap<string | number, Voter>}
         */
        this.storage = new Enmap({
            name: 'storage',
            fetchAll: true
        });
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
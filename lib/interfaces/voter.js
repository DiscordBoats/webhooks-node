module.exports = class DiscordVoter {
    /**
     * Create a new instance of a Discord voter
     * @param {VoterPacket} packet The packet
     */
    constructor(packet) {
        this.username = packet.name;
        this.id = packet.id;
    }

    /**
     * Stringifys the discord voter packet
     */
    toString() {
        return `${name} (${this.id})`;
    }
}

/**
 * @typedef {Object} VoterPacket The voter packet sent from the API
 * @prop {string} name The user's name
 * @prop {string} id The user's ID
 */
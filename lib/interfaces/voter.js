module.exports = class DiscordVoter {
    /**
     * Create a new instance of a Discord voter
     * @param {VoterPacket} packet The packet
     */
    constructor(packet) {
        this.username = packet.username;
        this.discriminator = packet.discriminator;
        this.id = packet.id;
    }

    /**
     * Stringifys the discord voter packet
     */
    toString() {
        return `${this.username}#${this.discriminator} (${this.id})`;
    }

    /**
     * Gets the tag of the user
     */
    get tag() {
        return `${this.username}#${this.discriminator}`;
    }
}

/**
 * @typedef {Object} VoterPacket The voter packet sent from the API
 * @prop {string} username The username
 * @prop {string} discriminator The discriminator
 * @prop {string} id The user's ID
 */
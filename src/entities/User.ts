/**
 * The packet that we received from `discord.boats`
 * as the `user` object
 */
export interface UserPacket {
    /**
     * The user's discriminator (i.e: `#0001`)
     */
    discriminator: string;

    /**
     * The user's username
     */
    username: string;

    /**
     * The user's ID
     */
    id: string;
}

export default class User {
    /**
     * The user's discriminator (i.e: `#0001`)
     */
    public discriminator: string;

    /**
     * The user's username
     */
    public username: string;

    /**
     * The user's ID
     */
    public id: string;

    /**
     * Creates a new User entity
     * @param pkt The packet discord.boats sent us
     */
    constructor(pkt: UserPacket) {
        this.discriminator = pkt.discriminator;
        this.username      = pkt.username;
        this.id            = pkt.id;
    }

    /**
     * Returns the username and discriminator together (i.e: `August#5820`)
     */
    get tag() {
        return `${this.username}#${this.discriminator}`;
    }

    /**
     * Returns a JSONified version of the User entity
     */
    toJSON(): UserPacket {
        return {
            discriminator: this.discriminator,
            username: this.username,
            id: this.id
        };
    }
}
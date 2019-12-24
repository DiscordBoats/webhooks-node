/**
 * The packet the webhook payload sends as `bot`
 */
export interface BotPacket {
    /**
     * The avatar URL for the bot
     */
    avatar: string;

    /**
     * The bot's name
     */
    name: string;

    /**
     * The URL of the bot (discord.boats URL!)
     */
    url: string;
}

/**
 * The Bot entity
 */
export default class Bot {
    /**
     * The avatar URL for the bot
     */
    public avatar: string;

    /**
     * The bot's name
     */
    public name: string;

    /**
     * The URL of the bot (discord.boats URL!)
     */
    public url: string;

    /**
     * Creates a new instance of the `Bot` entity
     * @param pkt The packet discord.boats send us
     */
    constructor(pkt: BotPacket) {
        this.avatar = pkt.avatar;
        this.name   = pkt.name;
        this.url    = pkt.url;
    }

    /**
     * JSONified version of the Bot entity
     */
    toJSON(): BotPacket {
        return {
            avatar: this.avatar,
            name: this.name,
            url: this.url
        };
    }
}
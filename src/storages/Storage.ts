import User from '../entities/User';
import Bot from '../entities/Bot';

export default abstract class Storage {
    /**
     * The storage unit's name
     */
    public name: string;

    /**
     * Creates a new Storage unit
     * @param name The name
     */
    constructor(name: string) {
      this.name = name;
    }

    /**
     * Adds a packet to the storage unit
     * @param bot The bot object
     * @param user The user object
     */
    public abstract addPacket(bot: Bot, user: User): Promise<void> | void;
}
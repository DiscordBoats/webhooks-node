import { Collection } from '@augu/immutable';
import Storage from './Storage';
import User from '../entities/User';
import Bot from '../entities/Bot';

export default class MemoryStorage extends Storage {
    /**
     * The interval to clear cache to save memory allocation
     */
    private interval: NodeJS.Timer | null;

    /**
     * The cache for the memory storage
     */
    private cache: Collection<User[]>;

    /**
     * Creates a new instance of the memory storage unit
     */
    constructor() {
      super('memory');

      this.interval = null;
      this.cache = new Collection();

      this.start();
    }

    /**
     * Starts the interval to clear cache
     */
    private start() {
      /* eslint-disable-next-line dot-notation */
      this.interval = setInterval(() => this.cache.forEach((_, id) => this.cache.delete(id)), (1000 * 60 * 60 * 24));
    }

    /**
     * Adds a vote to the Collection
     * @param bot The bot instance
     * @param user The user who upvoted
     */
    addPacket(bot: Bot, user: User) {
      if (!this.cache.has(bot.name)) this.cache.set(bot.name, []);

      const packet = this.cache.get(bot.name)!;
      packet.push(user);
      this.cache.set(bot.name, packet!);
    }
}
import RedisClient, { Redis, RedisOptions } from 'ioredis';
import Storage from './Storage';
import User from '../entities/User';
import Bot from '../entities/Bot';

export default class RedisStorage extends Storage {
    /**
     * Used to clear the Redis database
     */
    private interval: NodeJS.Timer | null;

    /**
     * The redis instance
     */
    private redis: Redis;

    /**
     * A custom key to find
     */
    public key: string;

    /**
     * Creates a new instance of the Redis Storage unit
     * @param options The redis options
     */
    constructor(options: RedisOptions) {
      super('redis');

      this.interval = null;
      this.redis    = new RedisClient(options);
      this.key      = 'votes:{bot}:{user}';
        
      this.start();
    }

    /**
     * Adds a packet to the Redis instance
     * @param bot The bot entity
     * @param user The user entity
     */
    async addPacket(bot: Bot, user: User) {
      const key = this.key
        .replace('{bot}', bot.name)
        .replace('{user}', user.username);

      if (!this.interval) await this.start();

      const packet = JSON.stringify({
        bot: bot.toJSON(),
        user: user.toJSON()
      });

      await this.redis.set(key, packet);
    }

    /**
     * Starts the interval and connects to the Redis instance
     */
    async start() {
      this.interval = setInterval(async() => {
        const keys = await this.redis.keys(this.key.replace('{bot}:{user}', '*'));
        const pipeline = this.redis.pipeline();

        pipeline.del(...keys);
        await pipeline.exec();
      }, (1000 * 60 * 60 * 24));

      /* eslint-disable-next-line */
        await this.redis.connect().catch(E => {});
    }

    /**
     * Stops the interval
     */
    stop() {
      if (this.interval) return this.interval.unref();
    }

    size() {
      let size = 0;
      this.redis.llen(this.key, (error, res) => {
        if (error) size = 0;
        else size += res;
      });

      return size;
    }
}
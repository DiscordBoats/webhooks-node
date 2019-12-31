declare module 'laffey' {
    import { RedisOptions, Redis } from 'ioredis';
    import { EventEmitter } from 'events';
    import { Collection } from '@augu/immutable';
    import { Server } from 'http';

    namespace Laffey {
        /**
         * Returns the version of Laffey
         */
        export const version: string;
    
        /**
         * Any additional options to add
         */
        export interface Options {
            /**
             * The authenication key to use
             */
            auth: string;
    
            /**
             * The storage to use (default: MemoryStorage)
             */
            storage?: Storage;
    
            /**
             * Webhook options (to send events to)
             */
            webhook?: {
                enabled: boolean;
                url: string | null;
            }
    
            /**
             * Any wumpfetch defaults to set
             */
            defaults?: object;
        }
    
        export class Laffey extends EventEmitter {
            /**
             * The port to use
             */
            public port: number;
        
            /**
             * The path for discord.boats to send packets to
             */
            public path: string;
        
            /**
             * The authenication key to use
             */
            public authKey: string;
        
            /**
             * The webhook options
             */
            public webhook: { enabled: boolean; url: string | null; }
        
            /**
             * The storage to add packets of data
             */
            public storage: Storage;
        
            /**
             * The HTTP server
             */
            public server: Server;
        
            /**
             * How many times discord.boats requested to us
             */
            public requests: number;
        
            /**
             * Creates a new Laffey instance
             * @param port The port to use
             * @param path The path to use
             * @param options Any additional options
             * @example
             * new Laffey(6969, '/webhook');
             */
            constructor(port: number, path: string, options: Options);
    
            /**
             * Listens to the server
             */
            public listen(): void;
    
            /**
             * Emits when an error occurs
             */
            public on(event: 'error', listener: (message: any) => void): this;
    
            /**
             * Emitted when the server is listening successfully
             */
            public on(event: 'listen', listener: () => void): this;
        }
    
        /**
         * The packet the webhook payload sends as `bot`
         */
        interface BotPacket {
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
        class Bot {
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
            constructor(pkt: BotPacket);
    
            /**
             * JSONified version of the Bot entity
             */
            toJSON(): BotPacket;
        }
    
        /**
         * The packet that we received from `discord.boats`
         * as the `user` object
         */
        interface UserPacket {
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
    
        class User {
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
            constructor(pkt: UserPacket);
    
            /**
             * Returns the username and discriminator together (i.e: `August#5820`)
             */
            public tag: string;
    
            /**
             * Returns a JSONified version of the User entity
             */
            toJSON(): UserPacket;
        }
    
        abstract class Storage {
            /**
             * The storage unit's name
             */
            public name: string;
        
            /**
             * Creates a new Storage unit
             * @param name The name
             */
            constructor(name: string);
        
            /**
             * Adds a packet to the storage unit
             * @param bot The bot object
             * @param user The user object
             */
            public abstract addPacket(bot: Bot, user: User): Promise<void> | void;
        }
    
        export namespace Storages {
            class MemoryStorage extends Storage {
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
                constructor();
    
                /**
                 * Adds a packet to the storage unit
                 * @param bot The bot object
                 * @param user The user object
                 */
                public addPacket(bot: Bot, user: User): void;
            }
    
            class RedisStorage extends Storage {
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
                constructor(options: RedisOptions);
            
                /**
                 * Adds a packet to the Redis instance
                 * @param bot The bot entity
                 * @param user The user entity
                 */
                public addPacket(bot: Bot, user: User): Promise<void>;
            }
        }
    }

    export default Laffey;
}
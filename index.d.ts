import Redis from 'ioredis';
import http from 'http';

declare namespace Laffey {
    export const version: string;

    export class Server {

    }

    export class Voter {

    }

    export namespace Storages {
        export class RedisStorage {

        }
    }
}

declare module 'laffey' {
    export default Laffey;
}
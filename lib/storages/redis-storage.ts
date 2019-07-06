import { Redis } from 'ioredis';

export interface RedisStorageOptions {
    port: number;
    host: string;
    key: string;
}
export default class RedisStorage {
    public client: Redis;
    public key: string;
    constructor(options: RedisStorageOptions) {
        this.client = new Redis({
            port: options.port,
            host: options.host
        });
        this.key = options.key;
    }

    add(pkt: any) {
        return this.client.rpush(`${this.key}:${pkt.id}`, true);
    }

    remove(userID: string) {
        return this.client.lpop(`${this.key}:${userID}`);
    }

    size(): Promise<number> {
        return this.client.llen(this.key);
    }
}
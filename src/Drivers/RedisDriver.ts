
import { Store } from '../Contracts/Store';
import Redis, { Cluster, RedisOptions } from 'ioredis';

export class RedisDriver implements Store {
    protected redis: Redis | Cluster;

    constructor(config: any, protected prefix: string = '') {
        const mode = config.mode || 'standalone';

        if (mode === 'cluster') {
            this.redis = new Redis.Cluster(config.nodes, {
                redisOptions: {
                    password: config.password,
                    ...config.options
                }
            });
        } else if (mode === 'sentinel') {
            this.redis = new Redis({
                sentinels: config.nodes,
                name: config.name,
                password: config.password,
                db: config.database,
                ...config.options
            });
        } else {
            this.redis = new Redis({
                host: config.host,
                port: config.port,
                password: config.password,
                db: config.database,
                ...config.options
            });
        }
    }

    public async get(key: string): Promise<any> {
        const value = await this.redis.get(this.prefix + key);
        return value ? JSON.parse(value) : null;
    }

    public async put(key: string, value: any, seconds: number): Promise<void> {
        const serializedValue = JSON.stringify(value);
        if (seconds > 0) {
            await this.redis.set(this.prefix + key, serializedValue, 'EX', seconds);
        } else {
            await this.forever(key, value);
        }
    }

    public async increment(key: string, value: number = 1): Promise<number> {
        return await this.redis.incrby(this.prefix + key, value);
    }

    public async decrement(key: string, value: number = 1): Promise<number> {
        return await this.redis.decrby(this.prefix + key, value);
    }

    public async forever(key: string, value: any): Promise<void> {
        await this.redis.set(this.prefix + key, JSON.stringify(value));
    }

    public async forget(key: string): Promise<void> {
        await this.redis.del(this.prefix + key);
    }

    public async flush(): Promise<void> {
        await this.redis.flushdb();
    }

    public getPrefix(): string {
        return this.prefix;
    }

    /**
     * Get the underlying Redis instance.
     */
    public getRedis(): Redis | Cluster {
        return this.redis;
    }
}

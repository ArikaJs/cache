
import { Store } from '../Contracts/Store';

export class DatabaseDriver implements Store {
    constructor(
        private database: any,
        private table: string,
        private prefix: string = ''
    ) { }

    public async get(key: string): Promise<any> {
        const cache = await this.database.table(this.table)
            .where('key', this.prefix + key)
            .first();

        if (!cache) {
            return null;
        }

        if (cache.expiration && cache.expiration <= Math.floor(Date.now() / 1000)) {
            await this.forget(key);
            return null;
        }

        return JSON.parse(cache.value);
    }

    public async put(key: string, value: any, seconds: number): Promise<void> {
        const expiration = Math.floor(Date.now() / 1000) + seconds;
        const jsonValue = JSON.stringify(value);
        const prefixedKey = this.prefix + key;

        const exists = await this.database.table(this.table).where('key', prefixedKey).exists();

        if (exists) {
            await this.database.table(this.table)
                .where('key', prefixedKey)
                .update({
                    value: jsonValue,
                    expiration: expiration
                });
        } else {
            await this.database.table(this.table).insert({
                key: prefixedKey,
                value: jsonValue,
                expiration: expiration
            });
        }
    }

    public async increment(key: string, value: number = 1): Promise<number> {
        const current = await this.get(key) || 0;
        const newValue = current + value;
        await this.forever(key, newValue);
        return newValue;
    }

    public async decrement(key: string, value: number = 1): Promise<number> {
        return this.increment(key, -value);
    }

    public async forever(key: string, value: any): Promise<void> {
        const jsonValue = JSON.stringify(value);
        const prefixedKey = this.prefix + key;

        const exists = await this.database.table(this.table).where('key', prefixedKey).exists();

        if (exists) {
            await this.database.table(this.table)
                .where('key', prefixedKey)
                .update({
                    value: jsonValue,
                    expiration: null
                });
        } else {
            await this.database.table(this.table).insert({
                key: prefixedKey,
                value: jsonValue,
                expiration: null
            });
        }
    }

    public async forget(key: string): Promise<void> {
        await this.database.table(this.table)
            .where('key', this.prefix + key)
            .delete();
    }

    public async flush(): Promise<void> {
        await this.database.table(this.table).delete();
    }

    public getPrefix(): string {
        return this.prefix;
    }
}

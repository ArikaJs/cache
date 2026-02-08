
import { Store } from './Contracts/Store';

export class Repository {
    constructor(protected store: Store) { }

    async get(key: string, defaultValue: any = null): Promise<any> {
        const value = await this.store.get(key);
        return value !== null ? value : defaultValue;
    }

    async has(key: string): Promise<boolean> {
        return (await this.get(key)) !== null;
    }

    async put(key: string, value: any, seconds: number): Promise<void> {
        await this.store.put(key, value, seconds);
    }

    async add(key: string, value: any, seconds: number): Promise<boolean> {
        if (await this.has(key)) {
            return false;
        }

        await this.put(key, value, seconds);
        return true;
    }

    async increment(key: string, value: number = 1): Promise<number> {
        return this.store.increment(key, value);
    }

    async decrement(key: string, value: number = 1): Promise<number> {
        return this.store.decrement(key, value);
    }

    async forever(key: string, value: any): Promise<void> {
        await this.store.forever(key, value);
    }

    async remember(key: string, seconds: number, callback: () => Promise<any>): Promise<any> {
        let value = await this.get(key);

        if (value !== null) {
            return value;
        }

        value = await callback();
        await this.put(key, value, seconds);

        return value;
    }

    async rememberForever(key: string, callback: () => Promise<any>): Promise<any> {
        let value = await this.get(key);

        if (value !== null) {
            return value;
        }

        value = await callback();
        await this.forever(key, value);

        return value;
    }

    async pull(key: string, defaultValue: any = null): Promise<any> {
        const value = await this.get(key, defaultValue);
        await this.forget(key);
        return value;
    }

    async forget(key: string): Promise<void> {
        await this.store.forget(key);
    }

    async flush(): Promise<void> {
        await this.store.flush();
    }

    getStore(): Store {
        return this.store;
    }
}

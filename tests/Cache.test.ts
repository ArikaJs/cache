
import test, { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { Cache, CacheManager } from '../src';

describe('Cache', () => {
    before(() => {
        const config = {
            default: 'memory',
            stores: {
                memory: {
                    driver: 'memory'
                }
            }
        };

        const manager = new CacheManager(config);
        Cache.setManager(manager);
    });

    it('can put and get values from cache', async () => {
        await Cache.put('test-key', 'test-value', 10);
        const value = await Cache.get('test-key');
        assert.strictEqual(value, 'test-value');
    });

    it('returns null for expired values', async () => {
        await Cache.put('expired-key', 'expired-value', -1); // expired immediately
        const value = await Cache.get('expired-key');
        assert.strictEqual(value, null);
    });

    it('can use remember to fetch and store values', async () => {
        let called = 0;
        const callback = async () => {
            called++;
            return 'remembered-value';
        };

        const value1 = await Cache.remember('remember-key', 10, callback);
        assert.strictEqual(value1, 'remembered-value');
        assert.strictEqual(called, 1);

        const value2 = await Cache.remember('remember-key', 10, callback);
        assert.strictEqual(value2, 'remembered-value');
        assert.strictEqual(called, 1); // should not be called again
    });

    it('can forget values', async () => {
        await Cache.put('forget-key', 'value', 10);
        await Cache.forget('forget-key');
        const value = await Cache.get('forget-key');
        assert.strictEqual(value, null);
    });

    it('can increment and decrement values', async () => {
        await Cache.put('counter', 10, 10);
        await Cache.increment('counter', 5);
        assert.strictEqual(await Cache.get('counter'), 15);
        await Cache.decrement('counter', 3);
        assert.strictEqual(await Cache.get('counter'), 12);
    });

    it('can pull values (get and forget)', async () => {
        await Cache.put('pull-key', 'pull-value', 10);
        const value = await Cache.pull('pull-key');
        assert.strictEqual(value, 'pull-value');
        assert.strictEqual(await Cache.get('pull-key'), null);
    });

    it('can add values only if they do not exist', async () => {
        await Cache.put('exists', 'value', 10);
        const added1 = await Cache.add('exists', 'new-value', 10);
        assert.strictEqual(added1, false);
        assert.strictEqual(await Cache.get('exists'), 'value');

        const added2 = await Cache.add('new', 'value', 10);
        assert.strictEqual(added2, true);
        assert.strictEqual(await Cache.get('new'), 'value');
    });

    it('can remember values forever', async () => {
        await Cache.rememberForever('forever-key', async () => 'forever-value');
        assert.strictEqual(await Cache.get('forever-key'), 'forever-value');
    });
});

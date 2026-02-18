
## Arika Cache

`@arikajs/cache` provides a simple, fast, and driver-based caching system for the ArikaJS framework.

It allows applications to store frequently accessed data in memory or external stores to improve performance and reduce repeated computation or database queries.

---

## ✨ Features

- **Unified cache API**: Consistent interface across all drivers
- **Multiple cache stores**: Support for various storage backends
- **Driver-based architecture**: Pluggable storage drivers
- **In-memory cache (v1)**: High-performance default storage
- **TTL (time-to-live) support**: Automatic expiration of cached items
- **Cache tagging**: Logical grouping of cache keys (planned)
- **TypeScript-first design**: Strong typing for keys and values

---

## 📦 Installation

```bash
npm install @arikajs/cache
# or
yarn add @arikajs/cache
# or
pnpm add @arikajs/cache
```

---

## 🚀 Basic Usage

```ts
import { Cache } from '@arikajs/cache';

// Store a value for 60 seconds
await Cache.put('users.count', 150, 60);

// Retrieve a value
const count = await Cache.get('users.count');
```

### 🧹 Cache Helpers

```ts
// Get an item, or execute the callback and store the result if it doesn't exist
await Cache.remember('settings', 300, async () => {
  return loadSettings();
});
```

---

## ⚙️ Configuration

```ts
export default {
  default: process.env.CACHE_STORE || 'database',

  stores: {
    memory: {
      driver: 'memory',
    },

    database: {
      driver: 'database',
      table: 'cache',
      connection: null,
    },
  },

  prefix: process.env.CACHE_PREFIX || 'arika_cache',
};
```

---

| Driver | Status | Description |
| :--- | :--- | :--- |
| **Memory** | ✅ Supported | Default in-memory ephemeral storage |
| **Database** | ✅ Supported | Persistent cache using your database |
| **Redis** | ✅ Supported | High-performance distributed cache (Standalone, Sentinel, Cluster) |

---

## 🏎️ Redis Cache Setup

The Redis driver supports Standalone, Sentinel, and Cluster modes.

### 1. Install Redis Package

```bash
npm install ioredis
```

### 2. Configure Environment

Add Redis settings to your `.env` file:

```env
CACHE_STORE=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
```

### 3. Advanced Redis Configuration

ArikaJS supports Sentinel and Cluster modes. Configure these in `config/cache.ts`:

#### Sentinel Mode
```ts
redis: {
  driver: 'redis',
  connection: 'default',
  mode: 'sentinel',
  nodes: [
    { host: '127.0.0.1', port: 26379 },
    { host: '127.0.0.1', port: 26380 },
  ],
  name: 'mymaster',
},
```

#### Cluster Mode
```ts
redis: {
  driver: 'redis',
  mode: 'cluster',
  nodes: [
    { host: '127.0.0.1', port: 7000 },
    { host: '127.0.0.1', port: 7001 },
  ],
},
```

---

## 🛠 Database Cache Setup

To use the database driver, you need to create the `cache` table migration:

```bash
arika cache:table
arika migrate
```

---

## 🔗 Integration

- **`@arikajs/http`** → response caching
- **`@arikajs/view`** → view fragments
- **`@arikajs/queue`** → cached jobs
- **`@arikajs/auth`** → session storage

---

## 🧠 Architecture (High Level)

```
cache/
├── src/
│   ├── CacheManager.ts
│   ├── Repository.ts
│   ├── Drivers/
│   │   ├── MemoryDriver.ts
│   │   ├── DatabaseDriver.ts
│   │   └── RedisDriver.ts
│   ├── Contracts/
│   │   └── Store.ts
│   └── index.ts
├── tests/
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## 📄 License

`@arikajs/cache` is open-source software licensed under the **MIT License**.

---

## 🧭 Philosophy

> "Fast data wins."

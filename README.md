
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
  default: 'memory',

  stores: {
    memory: {
      driver: 'memory'
    }
  }
};
```

---

## 🧠 Supported Drivers (v1)

| Driver | Status |
| :--- | :--- |
| Memory | ✅ Supported |
| Redis | ⏳ Planned |
| File | ⏳ Planned |

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
│   │   └── MemoryDriver.ts
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

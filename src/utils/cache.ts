import { LRUCache } from "lru-cache";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * LRU-backed in-memory cache with per-entry TTL.
 *
 * max: 500 entries — enough for every team + squad + event set
 * without unbounded growth under load.
 */
const store = new LRUCache<string, CacheEntry<unknown>>({ max: 500 });

export function get<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function set<T>(key: string, value: T, ttlMs = 60_000): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

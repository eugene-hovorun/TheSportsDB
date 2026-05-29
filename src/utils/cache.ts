import { LRUCache } from "lru-cache";

/**
 * LRU-backed in-memory cache with per-entry TTL.
 *
 * Delegates TTL tracking to lru-cache itself (v10+ native support) rather
 * than wrapping entries in a manual { value, expiresAt } struct.
 *
 * max: 500 entries — enough for the full team list, every squad, and a
 * rolling window of event sets without unbounded memory growth.
 *
 * ttlAutopurge: false — expired entries are evicted lazily on get() rather
 * than via a background interval, which is fine for a low-traffic server.
 */
const store = new LRUCache<string, object>({
  max: 500,
  ttlAutopurge: false,
});

export function get<T>(key: string): T | null {
  return (store.get(key) as T | undefined) ?? null;
}

export function set<T extends object>(
  key: string,
  value: T,
  ttlMs = 60_000,
): void {
  store.set(key, value, { ttl: ttlMs });
}

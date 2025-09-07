import { revision } from "../store";

/**
 * Memoizes an async function, caching results for a given timeout.
 * @param cacheTimeout - Cache duration in milliseconds.
 * @param fn - The async function to memoize.
 * @param keyFn - (Optional) Function to generate a cache key from arguments.
 * @returns A memoized version of the async function.
 */
export function memo<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  cacheTimeout: number = 10_000,
  keyFn?: (...args: T) => string,
): (...args: T) => Promise<R> {
  type CacheEntry = { value: R; timestamp: number };
  const cache = new Map<string, CacheEntry>();

  // Default key function uses JSON.stringify
  const getKey =
    keyFn ?? ((...args: T) => JSON.stringify({ args, rev: revision() }));

  return async (...args: T): Promise<R> => {
    const key = getKey(...args);
    const now = Date.now();

    // Clean up expired cache entry
    const entry = cache.get(key);
    if (entry && now - entry.timestamp < cacheTimeout) {
      return entry.value;
    }

    const value = await fn(...args);
    cache.set(key, { value, timestamp: now });
    return value;
  };
}

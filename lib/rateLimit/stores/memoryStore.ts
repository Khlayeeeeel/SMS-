/**
 * lib/rateLimit/stores/memoryStore.ts
 *
 * In-process sliding-window counter store backed by a plain Map.
 *
 * ✅ Use in: development, single-instance Docker deployments
 * ❌ Do NOT use in: horizontally scaled / multi-instance deployments
 *   (each instance has its own counter — limits won't be shared)
 *
 * Algorithm: Sliding Window Counter
 * ---------------------------------
 * We store an array of hit timestamps per key.
 * On each request we:
 *   1. Prune timestamps older than `now - windowMs`
 *   2. Push the current timestamp
 *   3. Return the count of remaining timestamps
 *
 * This gives smooth, accurate rate limiting without the boundary-burst
 * exploit that affects fixed-window counters.
 *
 * Memory overhead: O(limit) timestamps per active key.
 * For limit=10, window=1h: ~10 Date.now() numbers (~80 bytes) per IP.
 * Negligible for a lead-gen site with < 10k daily visitors.
 */

import type { RateLimitStore } from "../types";

interface WindowEntry {
  /** Sorted list of hit timestamps (ms since epoch) */
  hits: number[];
}

export class MemoryStore implements RateLimitStore {
  private readonly windows = new Map<string, WindowEntry>();

  /**
   * Prune expired entries every `gcIntervalMs` to prevent unbounded
   * memory growth from unique IPs that never return.
   */
  private readonly gcIntervalMs: number;
  private gcTimer: ReturnType<typeof setInterval> | null = null;

  constructor(gcIntervalMs = 5 * 60 * 1000 /* 5 minutes */) {
    this.gcIntervalMs = gcIntervalMs;
    this.startGarbageCollection();
  }

  async increment(
    key: string,
    windowMs: number
  ): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const windowStart = now - windowMs;

    let entry = this.windows.get(key);
    if (!entry) {
      entry = { hits: [] };
      this.windows.set(key, entry);
    }

    // --- Sliding window: drop hits outside the current window ---
    // hits is kept sorted ascending, so we can slice from the front
    let i = 0;
    while (i < entry.hits.length && entry.hits[i] <= windowStart) {
      i++;
    }
    entry.hits = entry.hits.slice(i);

    // Record this request
    entry.hits.push(now);

    // The window resets `windowMs` after the oldest hit still in window.
    // If the window becomes empty, reset is `windowMs` from now.
    const oldestHit = entry.hits[0] ?? now;
    const resetAt = oldestHit + windowMs;

    return { count: entry.hits.length, resetAt };
  }

  async reset(key: string): Promise<void> {
    this.windows.delete(key);
  }

  /** Remove entries whose entire hit window has expired. */
  private runGC(): void {
    const now = Date.now();
    for (const [key, entry] of this.windows.entries()) {
      // If the most recent hit is older than the longest possible window (1 day),
      // this entry is stale and can be evicted.
      const lastHit = entry.hits[entry.hits.length - 1];
      if (!lastHit || now - lastHit > 24 * 60 * 60 * 1000) {
        this.windows.delete(key);
      }
    }
  }

  private startGarbageCollection(): void {
    // Use unref() so the GC timer never prevents Node from exiting in tests
    this.gcTimer = setInterval(() => this.runGC(), this.gcIntervalMs);
    if (typeof this.gcTimer?.unref === "function") {
      this.gcTimer.unref();
    }
  }

  /** Call in tests to clean up timers. */
  destroy(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
      this.gcTimer = null;
    }
    this.windows.clear();
  }

  /** Expose size for monitoring/metrics. */
  get size(): number {
    return this.windows.size;
  }
}

/**
 * lib/rateLimit/types.ts
 *
 * Shared types and interfaces for the rate limiting system.
 * All stores, configs, and results flow through these contracts.
 */

// ---------------------------------------------------------------------------
// Store interface — swap memory for Redis by implementing this
// ---------------------------------------------------------------------------
export interface RateLimitStore {
  /**
   * Increment the request counter for a given key.
   * Returns the updated window state AFTER incrementing.
   *
   * @param key   - Unique string identifying this client + endpoint
   * @param windowMs - The sliding window size in milliseconds
   * @returns     - Current count and the window expiry timestamp (ms since epoch)
   */
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;

  /**
   * Optional: reset a key (useful in tests or admin tooling).
   */
  reset?(key: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Configuration for a single rate limiter instance
// ---------------------------------------------------------------------------
export interface RateLimitConfig {
  /** Human-readable name for logs/metrics (e.g. "contact-form") */
  name: string;

  /** Maximum requests allowed per window */
  limit: number;

  /** Window size in milliseconds */
  windowMs: number;

  /** Storage backend to use */
  store: RateLimitStore;

  /**
   * FAIL OPEN  (failOpen: true)  → if the store throws, allow the request
   * FAIL CLOSED (failOpen: false) → if the store throws, block the request
   * Default: true (fail open) — never block real leads due to infra issues
   */
  failOpen?: boolean;

  /**
   * IPs that bypass rate limiting entirely (monitoring, health checks, CI).
   * Loaded from RATE_LIMIT_WHITELIST_IPS env var (comma-separated).
   */
  whitelistedIPs?: string[];

  /**
   * In production, omit the actual limit numbers from 429 responses
   * to avoid giving attackers a roadmap.
   * Default: true in production, false in development.
   */
  hideInternalsInProduction?: boolean;
}

// ---------------------------------------------------------------------------
// Result returned by the rate limiter check
// ---------------------------------------------------------------------------
export interface RateLimitResult {
  /** true = request is allowed through */
  allowed: boolean;

  /** How many requests are left in the current window */
  remaining: number;

  /** The configured max for this window */
  limit: number;

  /** Unix timestamp (seconds) when the window resets */
  resetAt: number;

  /** Seconds until the window resets (for Retry-After header) */
  retryAfter: number;
}

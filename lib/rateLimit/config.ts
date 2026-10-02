/**
 * lib/rateLimit/config.ts
 *
 * Central configuration: instantiates the store backend and exports
 * one pre-configured limiter per endpoint.
 *
 * HOW TO TUNE:
 *   All limits can be overridden via environment variables (see .env.example).
 *   Change the env vars without touching code to adjust limits in production.
 *
 * HOW TO ADD A NEW ENDPOINT:
 *   1. Create a new RateLimitConfig object below.
 *   2. Import it in your API route and wrap with withRateLimit().
 *
 * STORAGE BACKEND SELECTION:
 *   RATE_LIMIT_STORAGE=memory  → in-process Map (default, single instance)
 *   RATE_LIMIT_STORAGE=redis   → Redis ZSET (multi-instance production)
 *     requires: REDIS_URL=redis://host:6379
 *     requires: npm install ioredis
 */

import { MemoryStore } from "./stores/memoryStore";
import { RedisStore } from "./stores/redisStore";
import type { RateLimitConfig, RateLimitStore } from "./types";

// ---------------------------------------------------------------------------
// Store factory — singleton, shared across all limiters for efficiency
// ---------------------------------------------------------------------------
function createStore(): RateLimitStore {
  const backend = process.env.RATE_LIMIT_STORAGE ?? "memory";

  if (backend === "redis") {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error(
        "[RateLimit] RATE_LIMIT_STORAGE=redis requires REDIS_URL to be set.\n" +
          "Example: REDIS_URL=redis://localhost:6379"
      );
    }
    console.info("[RateLimit] Using Redis store:", redisUrl.replace(/:\/\/.*@/, "://***@"));
    return new RedisStore(redisUrl);
  }

  console.info("[RateLimit] Using in-memory store (single-instance only).");
  return new MemoryStore();
}

// Single store instance shared by all limiters (one Redis connection pool)
const sharedStore = createStore();

// ---------------------------------------------------------------------------
// Failure mode — configurable globally
// RATE_LIMIT_FAIL_CLOSED=true  → block on store errors (strict, may drop real traffic)
// RATE_LIMIT_FAIL_CLOSED=false → allow on store errors (default, prefer availability)
// ---------------------------------------------------------------------------
const FAIL_OPEN = process.env.RATE_LIMIT_FAIL_CLOSED !== "true";

// ---------------------------------------------------------------------------
// Whitelist IPs (e.g. monitoring, health checks, your office IP)
// Set in .env: RATE_LIMIT_WHITELIST_IPS=1.2.3.4,10.0.0.1
// ---------------------------------------------------------------------------
const WHITELIST: string[] = (process.env.RATE_LIMIT_WHITELIST_IPS ?? "")
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);

// ---------------------------------------------------------------------------
// Endpoint-specific rate limit configurations
// ---------------------------------------------------------------------------

/**
 * Contact Form — POST /api/contact
 * 5 requests per IP per hour.
 */
export const contactLimiter: RateLimitConfig = {
  name: "contact-form",
  limit: parseInt(process.env.RATE_LIMIT_CONTACT_MAX ?? "5", 10),
  windowMs: parseInt(process.env.RATE_LIMIT_CONTACT_WINDOW_MS ?? String(60 * 60 * 1000), 10), // 1 hour
  store: sharedStore,
  failOpen: FAIL_OPEN,
  whitelistedIPs: WHITELIST,
  hideInternalsInProduction: true,
};

/**
 * Quote / Devis Form — POST /api/quotes
 * 3 requests per IP per hour.
 */
export const quotesLimiter: RateLimitConfig = {
  name: "quotes-form",
  limit: parseInt(process.env.RATE_LIMIT_QUOTES_MAX ?? "3", 10),
  windowMs: parseInt(process.env.RATE_LIMIT_QUOTES_WINDOW_MS ?? String(60 * 60 * 1000), 10), // 1 hour
  store: sharedStore,
  failOpen: FAIL_OPEN,
  whitelistedIPs: WHITELIST,
  hideInternalsInProduction: true,
};

/**
 * Admin Login Endpoint — POST /api/admin/auth/login
 * Strict Anti-Brute-Force: Max 5 attempts per IP per 15 minutes.
 */
export const adminLoginLimiter: RateLimitConfig = {
  name: "admin-login",
  limit: parseInt(process.env.RATE_LIMIT_ADMIN_LOGIN_MAX ?? "5", 10),
  windowMs: parseInt(process.env.RATE_LIMIT_ADMIN_LOGIN_WINDOW_MS ?? String(15 * 60 * 1000), 10), // 15 minutes
  store: sharedStore,
  failOpen: false, // FAIL CLOSED for brute force protection
  whitelistedIPs: WHITELIST,
  hideInternalsInProduction: true,
};

/**
 * Admin General Routes — /api/admin/*
 * 20 req/min limit for general admin API calls.
 */
export const adminLimiter: RateLimitConfig = {
  name: "admin",
  limit: parseInt(process.env.RATE_LIMIT_ADMIN_MAX ?? "20", 10),
  windowMs: parseInt(process.env.RATE_LIMIT_ADMIN_WINDOW_MS ?? String(60 * 1000), 10), // 1 minute
  store: sharedStore,
  failOpen: false, // FAIL CLOSED for security
  whitelistedIPs: WHITELIST,
  hideInternalsInProduction: true,
};

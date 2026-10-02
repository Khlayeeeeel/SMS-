/**
 * lib/rateLimit/index.ts
 *
 * Public barrel export for the rate limiting module.
 * Import from "@/lib/rateLimit" for everything you need.
 */

export { withRateLimit, checkRateLimit, applyRateLimitHeaders } from "./limiter";
export { contactLimiter, quotesLimiter, adminLimiter, adminLoginLimiter } from "./config";
export { MemoryStore } from "./stores/memoryStore";
export { RedisStore } from "./stores/redisStore";
export type { RateLimitConfig, RateLimitResult, RateLimitStore } from "./types";

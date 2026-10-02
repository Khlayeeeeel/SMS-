/**
 * lib/rateLimit/limiter.ts
 *
 * Core rate limiter: checks a request against its configured window/limit,
 * returns a structured result, and attaches standard HTTP headers.
 *
 * Design decisions:
 *  - Pure function `checkRateLimit()` — no side effects beyond the store call.
 *  - `applyRateLimitHeaders()` — separates header attachment from the check logic.
 *  - `withRateLimit()` — convenience wrapper for API route handlers.
 */

import { NextResponse } from "next/server";
import type { RateLimitConfig, RateLimitResult } from "./types";
import { getClientIp } from "./getClientIp";

// ---------------------------------------------------------------------------
// Whitelist: IPs that are never rate-limited (monitoring, health-checks, CI)
// Loaded once at module init from RATE_LIMIT_WHITELIST_IPS="1.2.3.4,5.6.7.8"
// ---------------------------------------------------------------------------
const WHITELISTED_IPS = new Set<string>(
  (process.env.RATE_LIMIT_WHITELIST_IPS ?? "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean)
);

// Loopback addresses are always whitelisted (local dev / health probes)
WHITELISTED_IPS.add("127.0.0.1");
WHITELISTED_IPS.add("::1");
WHITELISTED_IPS.add("localhost");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ---------------------------------------------------------------------------
// Core check function
// ---------------------------------------------------------------------------
/**
 * Evaluate whether this request is within its rate limit.
 *
 * @param request - The incoming Next.js API request
 * @param config  - The limiter configuration for this endpoint
 * @returns       - A RateLimitResult indicating allowed/blocked + headers data
 */
export async function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  const failOpen = config.failOpen ?? true;

  // --- Whitelist check (always fast-path) ---
  if (WHITELISTED_IPS.has(ip) || config.whitelistedIPs?.includes(ip)) {
    return {
      allowed: true,
      remaining: config.limit,
      limit: config.limit,
      resetAt: Math.floor((Date.now() + config.windowMs) / 1000),
      retryAfter: 0,
    };
  }

  // --- Build the store key: "<limiter-name>:<ip>" ---
  const key = `sms:rl:${config.name}:${ip}`;

  // --- Increment counter in store ---
  let count: number;
  let resetAt: number;

  try {
    const result = await config.store.increment(key, config.windowMs);
    count = result.count;
    resetAt = result.resetAt;
  } catch (err) {
    // Store failure — apply the configured failure strategy
    console.error(`[RateLimit] Store error for "${config.name}" (ip=${ip}):`, err);

    if (failOpen) {
      // FAIL OPEN: allow request through, log the error
      console.warn(`[RateLimit] Failing open for "${config.name}" due to store error.`);
      return {
        allowed: true,
        remaining: 1,
        limit: config.limit,
        resetAt: Math.floor((Date.now() + config.windowMs) / 1000),
        retryAfter: 0,
      };
    } else {
      // FAIL CLOSED: block the request
      console.warn(`[RateLimit] Failing closed for "${config.name}" due to store error.`);
      return {
        allowed: false,
        remaining: 0,
        limit: config.limit,
        resetAt: Math.floor((Date.now() + config.windowMs) / 1000),
        retryAfter: Math.ceil(config.windowMs / 1000),
      };
    }
  }

  const resetAtSeconds = Math.floor(resetAt / 1000);
  const retryAfter = Math.max(0, Math.ceil((resetAt - Date.now()) / 1000));
  const remaining = Math.max(0, config.limit - count);
  const allowed = count <= config.limit;

  if (!allowed) {
    console.info(
      `[RateLimit] BLOCKED ip=${ip} endpoint=${config.name} count=${count}/${config.limit} resetAt=${new Date(resetAt).toISOString()}`
    );
  }

  return { allowed, remaining, limit: config.limit, resetAt: resetAtSeconds, retryAfter };
}

// ---------------------------------------------------------------------------
// Standard response headers
// ---------------------------------------------------------------------------
/**
 * Attach X-RateLimit-* and Retry-After headers to an existing Response.
 * Called on EVERY response (both allowed and blocked) per spec.
 *
 * In production, we attach headers but omit the limit value from 429
 * bodies to avoid giving attackers a roadmap.
 */
export function applyRateLimitHeaders(
  response: Response,
  result: RateLimitResult
): Response {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.resetAt));

  if (!result.allowed) {
    response.headers.set("Retry-After", String(result.retryAfter));
  }

  return response;
}

// ---------------------------------------------------------------------------
// Build the 429 response
// ---------------------------------------------------------------------------
function buildTooManyRequestsResponse(
  result: RateLimitResult,
  hideInternals: boolean
): NextResponse {
  const body = hideInternals
    ? { error: "Rate limit exceeded" }
    : {
        error: "Rate limit exceeded",
        retryAfter: result.retryAfter,
      };

  const response = NextResponse.json(body, { status: 429 });
  applyRateLimitHeaders(response, result);
  return response;
}

// ---------------------------------------------------------------------------
// Convenience wrapper for Next.js API route handlers
// ---------------------------------------------------------------------------
/**
 * Wraps a Next.js App Router handler with rate limiting.
 *
 * Usage in an API route:
 * ```ts
 * export const POST = withRateLimit(contactLimiter, async (request) => {
 *   // ... your handler
 * });
 * ```
 *
 * @param config  - The limiter configuration (use a pre-built limiter from config.ts)
 * @param handler - The actual API route handler function
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const result = await checkRateLimit(request, config);

    if (!result.allowed) {
      const hideInternals =
        config.hideInternalsInProduction ?? IS_PRODUCTION;
      return buildTooManyRequestsResponse(result, hideInternals);
    }

    // Allowed — run the real handler
    const response = await handler(request);

    // Attach rate limit headers to the success response too
    applyRateLimitHeaders(response, result);

    return response;
  };
}

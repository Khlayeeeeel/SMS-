/**
 * lib/rateLimit/__tests__/rateLimit.test.ts
 *
 * Unit tests for the rate limiting system.
 *
 * Tests run with Node's built-in test runner (no jest needed):
 *   npx tsx --test lib/rateLimit/__tests__/rateLimit.test.ts
 *
 * Or with jest if added later:
 *   npx jest lib/rateLimit/__tests__/rateLimit.test.ts
 *
 * Coverage:
 *   ✅ Test 1: Limit triggers exactly at threshold
 *   ✅ Test 2: X-RateLimit-* headers are correct on every response
 *   ✅ Test 3: Counter resets after the window expires
 *   ✅ Test 4: Whitelisted IP is never blocked
 *   ✅ Test 5: Fail-open behaviour on store error
 *   ✅ Test 6: Fail-closed behaviour on store error
 */

import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";
import { MemoryStore } from "../stores/memoryStore";
import { checkRateLimit, withRateLimit } from "../limiter";
import type { RateLimitConfig } from "../types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal mock Next.js Request from a given IP */
function mockRequest(ip = "1.2.3.4"): Request {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip,
      "content-type": "application/json",
    },
  });
}

/** Build a test limiter config with a fresh store */
function makeConfig(
  overrides: Partial<RateLimitConfig> = {}
): RateLimitConfig & { store: MemoryStore } {
  const store = new MemoryStore(999_999); // very long GC interval — won't interfere
  return {
    name: "test-limiter",
    limit: 3,
    windowMs: 5_000, // 5 seconds — short window for fast tests
    store: store as any,
    failOpen: true,
    whitelistedIPs: [],
    hideInternalsInProduction: false, // show retryAfter in test responses
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Rate Limiter — MemoryStore", () => {
  // -----------------------------------------------------------------------
  // Test 1: Limit triggers exactly at threshold
  // -----------------------------------------------------------------------
  it("blocks the (limit + 1)th request but allows the first N", async () => {
    const config = makeConfig({ limit: 3 });
    const req = mockRequest("10.0.0.1");

    // First 3 requests → allowed
    for (let i = 1; i <= 3; i++) {
      const result = await checkRateLimit(new Request(req, {}), config);
      assert.equal(result.allowed, true, `Request ${i} should be allowed`);
      assert.equal(result.remaining, 3 - i, `Remaining should be ${3 - i} after request ${i}`);
    }

    // 4th request → blocked
    const blocked = await checkRateLimit(mockRequest("10.0.0.1"), config);
    assert.equal(blocked.allowed, false, "4th request should be blocked");
    assert.equal(blocked.remaining, 0, "Remaining should be 0 when blocked");

    config.store.destroy();
  });

  // -----------------------------------------------------------------------
  // Test 2: Headers are correct on every response (allowed and blocked)
  // -----------------------------------------------------------------------
  it("attaches correct X-RateLimit-* headers on both allowed and 429 responses", async () => {
    const config = makeConfig({ limit: 2 });

    // Create a simple echo handler
    const handler = withRateLimit(config, async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    // --- Allowed response (request 1 of 2) ---
    const res1 = await handler(mockRequest("10.0.0.2"));
    assert.equal(res1.status, 200, "First request should be 200");
    assert.equal(res1.headers.get("x-ratelimit-limit"), "2", "Limit header should be 2");
    assert.equal(res1.headers.get("x-ratelimit-remaining"), "1", "Remaining should be 1");
    assert.ok(res1.headers.get("x-ratelimit-reset"), "Reset header must be present");

    // --- Allowed response (request 2 of 2) ---
    const res2 = await handler(mockRequest("10.0.0.2"));
    assert.equal(res2.status, 200);
    assert.equal(res2.headers.get("x-ratelimit-remaining"), "0");

    // --- Blocked response (request 3 — over limit) ---
    const res3 = await handler(mockRequest("10.0.0.2"));
    assert.equal(res3.status, 429, "3rd request should return 429");
    assert.equal(res3.headers.get("x-ratelimit-remaining"), "0");
    assert.ok(res3.headers.get("retry-after"), "Retry-After must be present on 429");

    // 429 body must contain error + retryAfter
    const body = await res3.json();
    assert.equal(body.error, "Rate limit exceeded");
    assert.ok(typeof body.retryAfter === "number", "retryAfter should be a number");
    assert.ok(body.retryAfter > 0, "retryAfter should be positive");

    config.store.destroy();
  });

  // -----------------------------------------------------------------------
  // Test 3: Counter resets after the window expires
  // -----------------------------------------------------------------------
  it("allows requests again after the window expires", async () => {
    const config = makeConfig({
      limit: 2,
      windowMs: 200, // 200ms window — we'll wait 250ms
    });
    const ip = "10.0.0.3";

    // Exhaust the limit
    await checkRateLimit(mockRequest(ip), config);
    await checkRateLimit(mockRequest(ip), config);
    const blocked = await checkRateLimit(mockRequest(ip), config);
    assert.equal(blocked.allowed, false, "Should be blocked before reset");

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Should be allowed again
    const afterReset = await checkRateLimit(mockRequest(ip), config);
    assert.equal(afterReset.allowed, true, "Should be allowed after window reset");
    assert.equal(afterReset.remaining, 1, "Should have limit-1 remaining after reset");

    config.store.destroy();
  });

  // -----------------------------------------------------------------------
  // Test 4: Whitelisted IP is never blocked
  // -----------------------------------------------------------------------
  it("never blocks a whitelisted IP regardless of request count", async () => {
    const whitelistedIp = "192.168.99.99";
    const config = makeConfig({
      limit: 1,
      whitelistedIPs: [whitelistedIp],
    });

    // Send 10 requests from the whitelisted IP — all should pass
    for (let i = 0; i < 10; i++) {
      const result = await checkRateLimit(mockRequest(whitelistedIp), config);
      assert.equal(result.allowed, true, `Whitelisted request ${i + 1} should always be allowed`);
    }

    config.store.destroy();
  });

  // -----------------------------------------------------------------------
  // Test 5: Fail-open behaviour on store error
  // -----------------------------------------------------------------------
  it("fails open (allows request) when store throws and failOpen=true", async () => {
    const brokenStore = {
      increment: async () => { throw new Error("Redis connection refused"); },
    };
    const config = makeConfig({ store: brokenStore as any, failOpen: true });

    const result = await checkRateLimit(mockRequest("10.0.0.5"), config);
    assert.equal(result.allowed, true, "Should allow request when store fails and failOpen=true");
  });

  // -----------------------------------------------------------------------
  // Test 6: Fail-closed behaviour on store error
  // -----------------------------------------------------------------------
  it("fails closed (blocks request) when store throws and failOpen=false", async () => {
    const brokenStore = {
      increment: async () => { throw new Error("Redis connection refused"); },
    };
    const config = makeConfig({ store: brokenStore as any, failOpen: false });

    const result = await checkRateLimit(mockRequest("10.0.0.6"), config);
    assert.equal(result.allowed, false, "Should block request when store fails and failOpen=false");
  });
});

// ---------------------------------------------------------------------------
// MemoryStore unit tests
// ---------------------------------------------------------------------------

describe("MemoryStore — sliding window", () => {
  it("correctly prunes hits outside the window on each call", async () => {
    const store = new MemoryStore(999_999);
    const key = "test:prune:1.2.3.4";

    // Add 3 hits in a 500ms window
    await store.increment(key, 500);
    await store.increment(key, 500);
    const { count: c3 } = await store.increment(key, 500);
    assert.equal(c3, 3, "Should count 3 hits within the window");

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Now the hits should be pruned
    const { count: afterExpiry } = await store.increment(key, 500);
    assert.equal(afterExpiry, 1, "After window expiry, count should reset to 1");

    store.destroy();
  });

  it("tracks different IPs independently", async () => {
    const store = new MemoryStore(999_999);

    await store.increment("ip:1.1.1.1", 5000);
    await store.increment("ip:1.1.1.1", 5000);
    const { count: ip1Count } = await store.increment("ip:1.1.1.1", 5000);

    const { count: ip2Count } = await store.increment("ip:2.2.2.2", 5000);

    assert.equal(ip1Count, 3, "IP 1 should have 3 hits");
    assert.equal(ip2Count, 1, "IP 2 should have 1 hit (independent counter)");

    store.destroy();
  });
});

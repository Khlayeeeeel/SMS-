/**
 * lib/rateLimit/getClientIp.ts
 *
 * Safely extract the real client IP from a Next.js API request.
 *
 * SECURITY — X-Forwarded-For spoofing protection:
 * ------------------------------------------------
 * When behind a trusted proxy (Docker → Nginx/Cloudflare → Node):
 *   X-Forwarded-For: <client-ip>, <proxy1-ip>, <proxy2-ip>
 *
 * A malicious client can INJECT extra IPs by sending:
 *   X-Forwarded-For: 1.2.3.4, real-attacker-ip
 *
 * The safe strategy:
 *   - Read the RIGHTMOST IP added by YOUR trusted proxy (not the client).
 *   - Configurable via TRUSTED_PROXY_COUNT env var (default: 1).
 *   - If TRUSTED_PROXY_COUNT=0 (direct connection, no proxy), use the
 *     socket remote address directly.
 *
 * Reference: https://adam-p.ca/blog/2022/03/x-forwarded-for/
 */

const TRUSTED_PROXY_COUNT = parseInt(
  process.env.TRUSTED_PROXY_COUNT ?? "1",
  10
);

/**
 * Returns the effective client IP for rate-limit keying.
 * Falls back to "unknown" if no IP can be determined (never crashes).
 */
export function getClientIp(request: Request): string {
  // Direct connection (no proxy layer) — trust socket address
  if (TRUSTED_PROXY_COUNT === 0) {
    // In Next.js App Router, there is no direct socket access on Request.
    // The caller should pass cf-connecting-ip (Cloudflare) or similar.
    return getSingleHeader(request, "cf-connecting-ip") ?? "unknown";
  }

  // Behind a proxy: pick the Nth-from-right IP in X-Forwarded-For
  // where N = TRUSTED_PROXY_COUNT
  const xff = getSingleHeader(request, "x-forwarded-for");
  if (xff) {
    const ips = xff
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean);

    // The rightmost IP is the one added by the last (trusted) proxy.
    // We want the IP to the LEFT of the trusted proxy chain.
    const targetIndex = ips.length - TRUSTED_PROXY_COUNT;
    if (targetIndex >= 0 && ips[targetIndex]) {
      return sanitizeIp(ips[targetIndex]);
    }
  }

  // Cloudflare direct (CF always sets this when proxying)
  const cfIp = getSingleHeader(request, "cf-connecting-ip");
  if (cfIp) return sanitizeIp(cfIp);

  // Last resort
  return "unknown";
}

/**
 * Read a single header value safely. Returns null if missing.
 * Guards against arrays (Next.js normalises headers, but be explicit).
 */
function getSingleHeader(request: Request, name: string): string | null {
  const value = request.headers.get(name);
  if (!value) return null;
  // X-Forwarded-For can be a comma-separated list in a single header value
  // We handle splitting in the caller, so just return the raw string here.
  return value;
}

/**
 * Strip port numbers and normalise IPv6 brackets.
 * "::1" and "::ffff:127.0.0.1" are both localhost — normalise them.
 */
function sanitizeIp(raw: string): string {
  // Strip IPv6 brackets: [::1] → ::1
  let ip = raw.replace(/^\[|\]$/g, "");

  // Strip port: 192.168.1.1:5000 → 192.168.1.1
  if (ip.includes(":") && !ip.includes("::") && ip.split(":").length === 2) {
    ip = ip.split(":")[0];
  }

  // Normalise IPv4-mapped IPv6: ::ffff:127.0.0.1 → 127.0.0.1
  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  return ip || "unknown";
}

/**
 * Simple in-memory rate limiter for /api/submit form endpoints.
 *
 * ─── Why in-memory ─────────────────────────────────────
 *
 * - Zero dependencies, ships today
 * - Sufficient for BIPE's traffic profile (~10s of legitimate
 *   submissions / day, mostly during admission cycles)
 * - Slows down any single attacker's burst — which is exactly what
 *   bot spam looks like — even if it can't perfectly enforce limits
 *   across Vercel cold-start instances
 *
 * ─── Limitations ───────────────────────────────────────
 *
 * - Vercel serverless functions can spawn multiple instances, each
 *   with its own Map. An attacker hitting the deployment from many
 *   vantage points could theoretically get more requests through.
 * - State is lost on cold start (Vercel evicts idle functions after
 *   ~15 minutes of inactivity). A determined attacker waiting between
 *   bursts could effectively double their rate.
 * - No distributed coordination across regions.
 *
 * ─── Upgrade path (when traffic warrants) ──────────────
 *
 * Drop-in replacement of the Map with a KV store. Two free options:
 *
 *   1. Vercel KV (Redis-backed) · setup ~10 min in Vercel dashboard
 *      Replace `buckets.get(key)` / `buckets.set(key, ...)` with
 *      `kv.get(key)` / `kv.set(key, ..., { ex: windowSeconds })`.
 *
 *   2. Upstash Redis · slightly different API but same shape
 *
 * The function signatures here (checkRateLimit, getClientIp) stay
 * stable across the swap — call sites in route.ts don't change.
 *
 * ─── Detection ─────────────────────────────────────────
 *
 * - x-forwarded-for is set by Vercel's edge for every request
 * - Take the first IP (leftmost) — that's the original client
 * - Falls back to x-real-ip, then "anonymous" if both are absent
 *   (local dev mostly)
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  /** Max requests per window. Default: 5. */
  limit?: number;
  /** Window duration in milliseconds. Default: 1 hour. */
  windowMs?: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed. */
  ok: boolean;
  /** Requests remaining in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the window resets. */
  resetAt: number;
  /** Total limit in this window (for response headers). */
  limit: number;
}

/**
 * Periodic cleanup counter. Every ~100 checks we sweep expired buckets
 * to keep the Map from growing unbounded under sustained traffic from
 * many distinct IPs. Without cleanup a long-running instance could
 * accumulate thousands of stale entries (each ~50 bytes — mild memory
 * pressure but tidiness is free).
 */
let checkCounter = 0;

function maybeCleanup() {
  checkCounter += 1;
  if (checkCounter % 100 !== 0) return;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) {
      buckets.delete(key);
    }
  }
}

/**
 * Check + record a rate-limit hit for the given key.
 *
 * @param key  Usually an IP address. Falls back to "anonymous" if no IP.
 * @returns    ok: false if limit exceeded, ok: true otherwise.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = {},
): RateLimitResult {
  maybeCleanup();

  const limit = config.limit ?? 5;
  const windowMs = config.windowMs ?? 60 * 60 * 1000; // 1 hour

  const now = Date.now();
  const bucket = buckets.get(key);

  // Reset bucket if window has elapsed
  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt, limit };
  }

  // Within window — check + increment
  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt, limit };
  }

  bucket.count += 1;
  return {
    ok: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
    limit,
  };
}

/**
 * Extract the client IP from a Next.js Request.
 *
 * Vercel sets x-forwarded-for to the original client IP (leftmost in
 * a comma-separated chain if proxied multiple times). For local dev,
 * this header is absent — we fall back to "anonymous".
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // First IP in the list is the original client
    return xff.split(",")[0]?.trim() || "anonymous";
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "anonymous";
}

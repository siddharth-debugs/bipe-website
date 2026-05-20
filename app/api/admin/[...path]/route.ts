/**
 * Catch-all proxy that forwards every /api/admin/* request to the
 * Django backend. Lives in a route handler instead of next.config.ts
 * rewrites because Next's `:path*` wildcard strips trailing slashes,
 * which DRF (which uses /endpoint/ URLs) responds to with a 301 — the
 * 301 then drops the POST body.
 *
 * This handler preserves the path verbatim, including trailing slash,
 * and passes through method/headers/body unchanged.
 */
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENT_CACHE_TAG } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BACKEND_BASE =
  process.env.BIPE_BACKEND_URL?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api/v1";

/** HTTP methods that change server state — these are the ones that
 *  should bust the public-bundle cache after a successful upstream
 *  response. */
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Headers we drop on the way out (Next adds these; Django doesn't need them
// and some confuse the upstream).
const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "content-length",
  // Vercel-injected — pointless to forward
  "x-forwarded-proto",
  "x-forwarded-host",
  "x-forwarded-for",
  "x-real-ip",
  "x-vercel-deployment-url",
  "x-vercel-id",
  "x-vercel-ip-country",
  "x-vercel-ip-country-region",
  "x-vercel-ip-city",
  "x-vercel-ip-latitude",
  "x-vercel-ip-longitude",
  "x-vercel-ip-timezone",
  "x-vercel-internal-ingress-bucket",
  "x-vercel-proxy-signature",
  "x-vercel-proxy-signature-ts",
]);

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path = [] } = await ctx.params;
  const tail = path.length ? path.join("/") : "";

  // The original request path always ends in `/` (the dashboard always
  // sends DRF-style trailing slashes). Detect that and preserve it,
  // because Next.js drops it from the dynamic-route segments.
  const trailing = req.nextUrl.pathname.endsWith("/") ? "/" : "";
  const search = req.nextUrl.search; // includes leading '?' if present

  const url = `${BACKEND_BASE}/${tail}${trailing}${search}`;

  // Forward headers, dropping hop-by-hop / Vercel-injected ones.
  const fwdHeaders: Record<string, string> = {};
  req.headers.forEach((v, k) => {
    if (!HOP_BY_HOP.has(k.toLowerCase())) fwdHeaders[k] = v;
  });

  const init: RequestInit = {
    method: req.method,
    headers: fwdHeaders,
    redirect: "manual",
    cache: "no-store",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
    // @ts-expect-error — Node fetch needs duplex: 'half' for streaming bodies
    init.duplex = "half";
  }

  const upstream = await fetch(url, init);

  // If the admin just changed a content row, bust the public-bundle
  // cache so the next SSR render of any public page picks up the edit
  // immediately. Scoped to /content/* paths so PUT/DELETE on unrelated
  // endpoints (e.g. /accounts/users/) doesn't trigger unnecessary
  // revalidation. Status-gated so failed mutations don't invalidate.
  if (
    MUTATING_METHODS.has(req.method)
    && upstream.status >= 200
    && upstream.status < 300
    && tail.startsWith("content/")
  ) {
    try {
      revalidateTag(CONTENT_CACHE_TAG);
    } catch {
      // revalidateTag throws in some Next versions when called outside
      // a server-action context — swallow to avoid breaking the proxy.
    }
  }

  // Strip headers we shouldn't echo back to the client.
  const respHeaders = new Headers();
  upstream.headers.forEach((v, k) => {
    if (!HOP_BY_HOP.has(k.toLowerCase())) respHeaders.set(k, v);
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;

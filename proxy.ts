import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Forward the request path to the blog's root layout as an `x-pathname`
 * header.
 *
 * `<html lang>` can only be set by a root layout, and a root layout is not
 * given the route's params — so the only way for one to know which post it is
 * rendering is the request path. The blog needs that: a Hindi /blog/<slug>
 * post must be served inside `<html lang="hi-IN">` to match its
 * self-referencing hi-IN hreflang, or Semrush reports an "hreflang language
 * mismatch" (the finding this was added to clear, Aug 2026).
 *
 * Reading the header via `headers()` opts every route beneath that layout
 * into per-request rendering. Until Sep 2026 there was one root layout for
 * the whole site, so that cost landed on all 111 route patterns — nothing was
 * prerendered, and every visitor waited for a fresh render in Washington DC
 * (performance audit, finding F6). The site is now split into two top-level
 * route groups with a root layout each, and only the blog's reads this.
 *
 * The matcher below is scoped to match: /blog and /blog/<slug>, nothing else.
 * Every other route is prerendered and has no reason to run middleware at
 * all. If another route ever needs its own `<html lang>`, it needs its own
 * route group too — and this matcher has to learn about it.
 *
 * (Next.js 16 renamed the `middleware` file convention to `proxy`.)
 */
export function proxy(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Blog routes only. The blog's root layout is the sole reader of the header
  // this sets; running on the other ~100 prerendered routes would be an edge
  // invocation per request that nothing consumes.
  matcher: ["/blog", "/blog/:slug*"],
};

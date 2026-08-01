import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Forward the request path to the root layout as an `x-pathname` header.
 *
 * App Router renders a single `<html>` element (in app/layout.tsx), so the
 * root layout has no other way to know which route it is rendering — and it
 * needs that to set `<html lang>` per-route (a Hindi /blog/<slug> post must be
 * served inside `<html lang="hi-IN">` to match its self-referencing hi-IN
 * hreflang; otherwise Semrush flags an "hreflang language mismatch" because
 * the container lang says en-IN while the hreflang says hi-IN).
 *
 * The layout reads this header via `headers()`, which opts affected routes
 * into dynamic rendering. That is the accepted trade-off for the fix (Aug 2026
 * audit); the layout's live-data fetches remain tag-cached (revalidate 300),
 * so the data layer is unaffected — only full-page edge caching is traded for
 * per-request rendering.
 *
 * (Next.js 16 renamed the `middleware` file convention to `proxy`.)
 */
export function proxy(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Page routes only — skip Next internals, API routes, and any path with a
  // file extension (llms.txt, robots.txt, sitemap.xml, images, etc.).
  matcher: ["/((?!api|_next/static|_next/image|_next/data|favicon.ico|.*\\.[^/]+$).*)"],
};

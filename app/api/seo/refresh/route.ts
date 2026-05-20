/**
 * /api/seo/refresh — invalidates the Semrush fetch cache.
 *
 * Two callers, two methods:
 *
 *   GET  — Vercel Cron daily refresh. Requires `Authorization: Bearer
 *          ${CRON_SECRET}` (Vercel sends this header automatically
 *          when CRON_SECRET is set in env). Without that env var the
 *          GET path returns 503 — keeps the endpoint safely 401'd
 *          for casual probing.
 *
 *   POST — manual "Refresh" button on /admin/dashboard/seo. Requires
 *          a valid Bearer JWT in the Authorization header — we forward
 *          it to Django's /auth/me/ to validate. If Django answers
 *          200, the user has an active admin session and we proceed.
 *
 * Both methods do the same work: revalidateTag("semrush") so the next
 * fetch from lib/fetch-semrush.ts triggers a fresh API call instead of
 * returning the 24h-cached response.
 *
 * Note: this route does NOT live under /api/admin/* on purpose. That
 * tree is owned by the catch-all proxy in app/api/admin/[...path]/
 * which forwards everything to Django — registering a more-specific
 * route there worked in testing but is fragile (any new sibling could
 * shadow the catch-all unexpectedly). /api/seo/* is unambiguous.
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/lib/fetch-semrush";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BACKEND_BASE =
  process.env.BIPE_BACKEND_URL?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api/v1";

function extractBearer(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

/**
 * Validate an admin JWT by asking Django. We accept any token Django
 * accepts — no permission check beyond "logged-in admin", since the
 * worst case is a logged-in admin burning Semrush API units, which is
 * bounded by Semrush's own rate limit (10 req/s).
 */
async function isValidAdminJwt(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_BASE}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function doRefresh() {
  // Next 16 added a required `profile` arg to revalidateTag — "default"
  // matches the implicit profile our fetch() calls use in
  // lib/fetch-semrush.ts (they don't pass an explicit profile).
  revalidateTag(CACHE_TAG, "default");
  return NextResponse.json({
    ok: true,
    tag: CACHE_TAG,
    refreshedAt: new Date().toISOString(),
  });
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }
  const token = extractBearer(req);
  if (token !== cronSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return doRefresh();
}

export async function POST(req: NextRequest) {
  const token = extractBearer(req);
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing Bearer token" }, { status: 401 });
  }

  // CRON_SECRET path also works via POST — useful for `curl -X POST` test calls.
  if (token === process.env.CRON_SECRET) {
    return doRefresh();
  }

  // Otherwise validate as an admin JWT.
  const valid = await isValidAdminJwt(token);
  if (!valid) {
    return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 });
  }
  return doRefresh();
}

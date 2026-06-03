/**
 * Google Search Console (Search Analytics) client — server-only.
 *
 * Powers the "Live positions — Search Console" panel on
 * /admin/dashboard/seo with FREE, first-party ranking data: the real
 * queries bipevns.org appears for in Google, with actual average
 * position, clicks, impressions and CTR.
 *
 * ─── Why this exists (vs Semrush) ────────────────────────────────
 *
 * The dashboard's other position source is Semrush, which (a) costs
 * API units (an expensive enterprise add-on, sold via sales contact —
 * not self-serve) and (b) reports third-party *estimates*. GSC is
 * free, has no unit cap, and is GOOGLE'S OWN data for our site —
 * strictly more accurate for "where do we actually rank." Semrush's
 * unique value is competitor/keyword-gap data, which GSC can't give;
 * this module covers the part GSC does best (our own positions).
 *
 * Hand-rolled JWT (Node `crypto`), zero new deps — identical pattern
 * to lib/ga4.ts. The two modules hold separate token caches because
 * they use different OAuth scopes (analytics.readonly vs
 * webmasters.readonly).
 *
 * ─── Configuration ───────────────────────────────────────────────
 *
 *   GSC_SITE_URL   the Search Console property, exactly as registered:
 *                    - Domain property:    "sc-domain:bipevns.org"
 *                    - URL-prefix property: "https://bipevns.org/"
 *                  BIPE uses the Domain property → "sc-domain:bipevns.org".
 *
 *   Credentials — reuses the GA4 service account by default, so the
 *   only new setup is GSC_SITE_URL + granting that service account
 *   access in Search Console (Settings → Users and permissions → add
 *   the service-account email as a Full/Restricted user). Override
 *   with GSC-specific creds if you'd rather keep them separate:
 *     GSC_SERVICE_ACCOUNT_EMAIL        (falls back to GA4_SERVICE_ACCOUNT_EMAIL)
 *     GSC_SERVICE_ACCOUNT_PRIVATE_KEY  (falls back to GA4_SERVICE_ACCOUNT_PRIVATE_KEY)
 *
 * ─── Failure mode ────────────────────────────────────────────────
 *
 * isGSCConfigured() returns false when site URL or creds are missing.
 * getSearchAnalytics never throws — errors return { ok: false, error }
 * so the admin panel can render the message inline.
 *
 * Note: GSC data lags ~2-3 days; the most recent days in any window
 * will be partial or empty. That's expected, not a bug.
 */

import crypto from "node:crypto";

const SC_API = "https://www.googleapis.com/webmasters/v3/sites";

type EnvBundle = {
  siteUrl: string;
  clientEmail: string;
  privateKey: string;
};

/** True when the site URL and a usable service account are both set. */
export function isGSCConfigured(): boolean {
  const hasSite = Boolean(process.env.GSC_SITE_URL);
  const hasEmail = Boolean(
    process.env.GSC_SERVICE_ACCOUNT_EMAIL || process.env.GA4_SERVICE_ACCOUNT_EMAIL,
  );
  const hasKey = Boolean(
    process.env.GSC_SERVICE_ACCOUNT_PRIVATE_KEY ||
      process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
  return hasSite && hasEmail && hasKey;
}

function readEnv(): EnvBundle | null {
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  const clientEmail = (
    process.env.GSC_SERVICE_ACCOUNT_EMAIL || process.env.GA4_SERVICE_ACCOUNT_EMAIL
  )?.trim();
  const rawKey =
    process.env.GSC_SERVICE_ACCOUNT_PRIVATE_KEY ||
    process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!siteUrl || !clientEmail || !rawKey) return null;
  // Vercel stores PEM newlines as literal \n — restore them.
  const privateKey = rawKey.replace(/\\n/g, "\n");
  return { siteUrl, clientEmail, privateKey };
}

// Separate cache from lib/ga4.ts — different scope, different token.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(env: EnvBundle): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: env.clientEmail,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const enc = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const unsigned = `${enc(header)}.${enc(payload)}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(env.privateKey)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OAuth token exchange ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) {
    throw new Error("OAuth response missing access_token");
  }
  const expiresIn = json.expires_in ?? 3600;
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (expiresIn - 600) * 1000,
  };
  return cachedToken.token;
}

export type GscRow = {
  query: string;
  clicks: number;
  impressions: number;
  /** Click-through rate, 0-1. */
  ctr: number;
  /** Average position (lower = better). */
  position: number;
};

export type GscResult =
  | { ok: true; rows: GscRow[]; daysBack: number; fetchedAt: string }
  | { ok: false; error: string };

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Top search queries for the site over the last N days, sorted by
 * clicks (GSC's default). Never throws — returns { ok: false, error }.
 *
 *   const r = await getSearchAnalytics(28, 25);
 */
export async function getSearchAnalytics(
  daysBack = 28,
  rowLimit = 25,
): Promise<GscResult> {
  const env = readEnv();
  if (!env) return { ok: false, error: "GSC env vars not set" };
  try {
    const token = await getAccessToken(env);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysBack);

    const res = await fetch(
      `${SC_API}/${encodeURIComponent(env.siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: ymd(start),
          endDate: ymd(end),
          dimensions: ["query"],
          rowLimit,
          dataState: "all",
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `Search Console API ${res.status}: ${text.slice(0, 240)}` };
    }
    const json = (await res.json()) as {
      rows?: Array<{
        keys?: string[];
        clicks?: number;
        impressions?: number;
        ctr?: number;
        position?: number;
      }>;
    };
    const rows: GscRow[] = (json.rows ?? []).map((r) => ({
      query: r.keys?.[0] ?? "",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }));
    return { ok: true, rows, daysBack, fetchedAt: new Date().toISOString() };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown Search Console error",
    };
  }
}

/**
 * GA4 Data API client — server-only.
 *
 * Powers /admin/dashboard/analytics so operators can see call /
 * WhatsApp / form-submit counts without logging into Google Analytics.
 *
 * ─── Why hand-rolled, not @google-analytics/data ─────────────
 *
 * The official SDK pulls in google-auth-library + protobuf-related
 * deps (~4-5 MB total). For one read-only request hitting a single
 * REST endpoint, that's overkill. This module signs a service-
 * account JWT with Node's built-in `crypto` and calls the Data API
 * over fetch. Zero new dependencies.
 *
 * ─── Configuration ───────────────────────────────────────────
 *
 *   GA4_PROPERTY_ID                — numeric GA4 property ID (NOT
 *                                    the G-XXXX measurement ID).
 *                                    Find it in GA4 → Admin →
 *                                    Property Settings.
 *                                    e.g. "501234567"
 *   GA4_SERVICE_ACCOUNT_EMAIL      — service account email,
 *                                    e.g. "ga4@PROJECT.iam.gserviceaccount.com"
 *   GA4_SERVICE_ACCOUNT_PRIVATE_KEY — PEM-formatted private key.
 *                                    For Vercel: paste with literal
 *                                    \n (the env var stores them
 *                                    as \n; we replace before use).
 *
 *   See ANALYTICS_SETUP.md (repo root) for the full setup walkthrough.
 *
 * ─── Failure mode ────────────────────────────────────────────
 *
 * isConfigured() returns false when any env var is missing. The
 * admin page checks this first and renders a setup-instructions
 * panel instead of trying to call the API. Real API errors are
 * caught and returned as { ok: false, error } — the page surfaces
 * the error text inline so the operator can fix the credentials.
 */

import crypto from "node:crypto";

const DATA_API = "https://analyticsdata.googleapis.com/v1beta/properties";

type EnvBundle = {
  propertyId: string;
  clientEmail: string;
  privateKey: string;
};

/** True when every GA4 env var is set. The admin page checks this
 *  before attempting any API call. */
export function isGA4Configured(): boolean {
  return Boolean(
    process.env.GA4_PROPERTY_ID &&
      process.env.GA4_SERVICE_ACCOUNT_EMAIL &&
      process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
}

function readEnv(): EnvBundle | null {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim();
  const clientEmail = process.env.GA4_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!propertyId || !clientEmail || !rawKey) return null;
  // Vercel stores newlines in env vars as literal \n — restore them
  // so the PEM parser is happy.
  const privateKey = rawKey.replace(/\\n/g, "\n");
  return { propertyId, clientEmail, privateKey };
}

/**
 * Sign a service-account JWT for Google's OAuth2 token endpoint and
 * exchange it for a short-lived access token scoped to the Data API.
 * Tokens are cached in-memory for ~50 minutes (Google issues 1h
 * tokens; we refresh early to leave headroom).
 */
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(env: EnvBundle): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: env.clientEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
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
    // Refresh 10 minutes before actual expiry so a long-running
    // dashboard render doesn't hit a 401 mid-flight.
    expiresAt: Date.now() + (expiresIn - 600) * 1000,
  };
  return cachedToken.token;
}

export type EventCount = {
  eventName: string;
  count: number;
  users: number;
};

export type GA4Result =
  | { ok: true; counts: EventCount[]; daysBack: number; fetchedAt: string }
  | { ok: false; error: string };

/**
 * Pull event counts for the given event names over the last N days.
 *
 *   const r = await getEventCounts(
 *     ["call_click", "whatsapp_click", "apply_submit"],
 *     7,
 *   );
 *
 * Always returns — never throws. Errors are wrapped in
 * { ok: false, error } so the caller can render them inline.
 */
export async function getEventCounts(
  eventNames: string[],
  daysBack = 7,
): Promise<GA4Result> {
  const env = readEnv();
  if (!env) {
    return { ok: false, error: "GA4 env vars not set" };
  }
  if (!eventNames.length) {
    return { ok: true, counts: [], daysBack, fetchedAt: new Date().toISOString() };
  }
  try {
    const token = await getAccessToken(env);
    const res = await fetch(`${DATA_API}/${env.propertyId}:runReport`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${daysBack}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: { values: eventNames, caseSensitive: true },
          },
        },
        limit: 100,
      }),
      // 15s server-side timeout — admin renders are interactive but
      // shouldn't hang forever on a sluggish Google response.
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Data API ${res.status}: ${text.slice(0, 240)}`,
      };
    }
    const json = (await res.json()) as {
      rows?: Array<{ dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }>;
    };
    // Fill in zero rows for events that fired no times — the report
    // omits them but the dashboard should still show them so the
    // operator knows the wiring is intact.
    const byName = new Map<string, EventCount>();
    for (const name of eventNames) {
      byName.set(name, { eventName: name, count: 0, users: 0 });
    }
    for (const row of json.rows ?? []) {
      const name = row.dimensionValues?.[0]?.value;
      const count = Number(row.metricValues?.[0]?.value ?? 0);
      const users = Number(row.metricValues?.[1]?.value ?? 0);
      if (name && byName.has(name)) {
        byName.set(name, { eventName: name, count, users });
      }
    }
    return {
      ok: true,
      counts: Array.from(byName.values()),
      daysBack,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "GA4 fetch failed",
    };
  }
}

/** The canonical list of events the BIPE site fires. Used by the
 *  admin page to decide what to ask GA4 for, and by the docs to
 *  reference the same source of truth. */
export const BIPE_TRACKED_EVENTS = [
  "call_click",
  "whatsapp_click",
  "mailto_click",
  "apply_submit",
  "contact_submit",
  "visit_submit",
  "enquiry_submit",
] as const;

export type BipeEventName = (typeof BIPE_TRACKED_EVENTS)[number];

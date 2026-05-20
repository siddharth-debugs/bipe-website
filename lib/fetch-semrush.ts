/**
 * Semrush API wrapper.
 *
 * Hits the four endpoints we surface on /admin/dashboard/seo. Each
 * call goes through Next.js's fetch cache with a 24h revalidate +
 * shared `semrush` tag, so:
 *
 *   1. Within 24h: subsequent calls return the cached response — no
 *      Semrush API units consumed.
 *   2. After 24h: the next request triggers an in-background refresh
 *      (ISR semantics).
 *   3. On-demand refresh: `revalidateTag("semrush")` (from the
 *      refresh route) clears all four caches atomically.
 *
 * Cost per full refresh: ~80 API units across all four endpoints
 * (well under the 10,000-units/day quota a Pro+API plan provides).
 *
 * Environment:
 *
 *   SEMRUSH_API_KEY    required. 32-char key from
 *                      semrush.com/accounts/subscription-info/api-units/
 *
 * Response format: Semrush returns semicolon-separated values with
 * a header row. We parse that into typed JS objects matching the
 * existing SeoSnapshot shape in lib/seo-snapshot.ts.
 */

import type {
  SeoSnapshot,
  SeoDomainOverview,
  SeoTopPage,
  SeoPosition,
  SeoCompetitor,
} from "@/lib/seo-snapshot";

const API_URL = "https://api.semrush.com/";
const CACHE_TAG = "semrush";
const REVALIDATE_SECONDS = 60 * 60 * 24; // 24h

const DOMAIN = "bipevns.org";
const DATABASE = "in";

function requireKey(): string {
  const key = process.env.SEMRUSH_API_KEY;
  if (!key) {
    throw new Error(
      "SEMRUSH_API_KEY is not set. Add it to Vercel env vars: " +
        "https://vercel.com/{your-team}/{project}/settings/environment-variables",
    );
  }
  return key;
}

/**
 * Low-level Semrush fetch. Returns parsed rows (each row is an object
 * keyed by column header). Throws if the response is an error
 * (Semrush returns errors as plain text starting with "ERROR :").
 */
async function callSemrush(params: Record<string, string>): Promise<Record<string, string>[]> {
  const key = requireKey();
  const search = new URLSearchParams({ ...params, key });
  const url = `${API_URL}?${search.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
  });

  if (!res.ok) {
    throw new Error(`Semrush HTTP ${res.status} ${res.statusText} for type=${params.type}`);
  }

  const text = (await res.text()).trim();

  // Semrush sends API errors as plain-text strings. Catch and surface
  // them with the original type so debugging is fast.
  if (text.startsWith("ERROR")) {
    throw new Error(`Semrush API error for type=${params.type}: ${text}`);
  }

  // Empty body = no data for this query. Treat as zero rows rather
  // than throwing — domain_organic_unique can legitimately return
  // empty for small domains.
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(";");
  return lines.slice(1).map((line) => {
    const values = line.split(";");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row;
  });
}

// ─── Endpoint wrappers ──────────────────────────────────────────────

/** domain_rank — overview block (Authority Score, organic counts, traffic). */
async function fetchOverview(): Promise<SeoDomainOverview> {
  const rows = await callSemrush({
    type: "domain_rank",
    domain: DOMAIN,
    database: DATABASE,
  });
  if (rows.length === 0) {
    throw new Error("domain_rank returned no rows — domain may not be indexed yet");
  }
  const r = rows[0];
  return {
    domain: r["Domain"] ?? DOMAIN,
    rank: Number(r["Rank"] ?? 0),
    organicKeywords: Number(r["Organic Keywords"] ?? 0),
    organicTraffic: Number(r["Organic Traffic"] ?? 0),
    organicCost: Number(r["Organic Cost"] ?? 0),
  };
}

/** domain_organic — every keyword the domain ranks for, with position. */
async function fetchPositions(limit = 50): Promise<SeoPosition[]> {
  const rows = await callSemrush({
    type: "domain_organic",
    domain: DOMAIN,
    database: DATABASE,
    display_limit: String(limit),
    display_sort: "po_asc",
  });
  return rows.map((r) => ({
    keyword: r["Keyword"] ?? "",
    position: Number(r["Position"] ?? 0),
    previousPosition: Number(r["Previous Position"] ?? 0),
    positionDelta: Number(r["Position Difference"] ?? 0),
    searchVolume: Number(r["Search Volume"] ?? 0),
    url: r["Url"] ?? "",
    trafficPct: Number(r["Traffic (%)"] ?? 0),
  }));
}

/** domain_organic_unique — top ranking URLs, by traffic share. */
async function fetchTopPages(limit = 30): Promise<SeoTopPage[]> {
  const rows = await callSemrush({
    type: "domain_organic_unique",
    domain: DOMAIN,
    database: DATABASE,
    display_limit: String(limit),
    display_sort: "tr_desc",
  });
  return rows.map((r) => ({
    url: r["Url"] ?? "",
    keywords: Number(r["Number of Keywords"] ?? 0),
    traffic: Number(r["Traffic"] ?? 0),
    trafficPct: Number(r["Traffic (%)"] ?? 0),
  }));
}

/** domain_organic_organic — top competitors by keyword-profile overlap. */
async function fetchCompetitors(limit = 10): Promise<SeoCompetitor[]> {
  const rows = await callSemrush({
    type: "domain_organic_organic",
    domain: DOMAIN,
    database: DATABASE,
    display_limit: String(limit),
    display_sort: "cr_desc",
  });
  return rows.map((r) => ({
    domain: r["Domain"] ?? "",
    relevance: Number(r["Competitor Relevance"] ?? 0),
    commonKeywords: Number(r["Common Keywords"] ?? 0),
    theirOrganicKeywords: Number(r["Organic Keywords"] ?? 0),
    theirOrganicTraffic: Number(r["Organic Traffic"] ?? 0),
  }));
}

// ─── Public entry point ─────────────────────────────────────────────

/**
 * One-shot full snapshot fetch. All four endpoints in parallel; the
 * fetch cache deduplicates within a single 24h window. Returns the
 * same SeoSnapshot shape as the static fallback in lib/seo-snapshot.ts.
 */
export async function fetchSemrushSnapshot(): Promise<SeoSnapshot> {
  const [overview, topPositions, topPages, competitors] = await Promise.all([
    fetchOverview(),
    fetchPositions(),
    fetchTopPages(),
    fetchCompetitors(),
  ]);

  return {
    date: new Date().toISOString().slice(0, 10),
    source: "semrush",
    database: DATABASE,
    overview,
    topPages,
    topPositions,
    competitors,
  };
}

export { CACHE_TAG };

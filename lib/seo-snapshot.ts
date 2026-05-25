/**
 * Domain-level SEO snapshot.
 *
 * Sibling file to lib/keyword-positions.ts. Where that one tracks
 * individual keyword positions over time, this one captures the
 * domain-wide signals that surround them:
 *
 *   - Total organic-keyword footprint and traffic estimate
 *   - Which BIPE pages drive the traffic (top pages)
 *   - Who Google associates BIPE with (competitors)
 *
 * ─── How to refresh (Phase A, manual) ───────────────────────────
 *
 * Today this is updated by a Claude Code session pulling Semrush
 * data via MCP tools (see commit log). Whoever's editing should:
 *   1. Run the same three Semrush calls below.
 *   2. Replace the constants with the fresh numbers.
 *   3. Bump `date` to today.
 *   4. Commit.
 *
 * ─── How to refresh (Phase B, automated) ─────────────────────────
 *
 * Once SEMRUSH_API_KEY is provisioned in Vercel env and a Vercel
 * cron is wired up, this file becomes a write target for the cron:
 * `app/api/admin/seo/refresh/route.ts` will fetch the same data
 * and overwrite this module export, then `git commit + push` (or
 * write to a Postgres cache, depending on which architecture wins).
 *
 * The TypeScript types here intentionally mirror Semrush's column
 * layout so the swap from manual to automated is a near drop-in.
 */

export interface SeoDomainOverview {
  /** Domain analyzed. */
  domain: string;
  /** Semrush global authority rank. LOWER is better. */
  rank: number;
  /** Total keywords for which this domain appears in Google top 100. */
  organicKeywords: number;
  /** Semrush's estimated monthly organic visits in this database. */
  organicTraffic: number;
  /** Semrush's estimated USD value if those visits had to be bought via paid ads. */
  organicCost: number;
}

export interface SeoTopPage {
  url: string;
  /** Count of keywords the URL ranks for in this database. */
  keywords: number;
  /** Estimated monthly organic visits to this URL. */
  traffic: number;
  /** Percentage of the domain's total organic traffic this URL accounts for. */
  trafficPct: number;
}

export interface SeoPosition {
  keyword: string;
  position: number;
  /** Position one month ago. Same as `position` if no change. */
  previousPosition: number;
  /** position - previousPosition. Positive = fell. Negative = rose. */
  positionDelta: number;
  searchVolume: number;
  /** The exact ranking URL Semrush observed (often differs from our intended target). */
  url: string;
  /** Percent of the domain's organic traffic this rank produces. */
  trafficPct: number;
}

export interface SeoCompetitor {
  domain: string;
  /** 0-1; how relevant this domain is as a competitor (1 = identical keyword profile). */
  relevance: number;
  /** Keywords both domains rank for. */
  commonKeywords: number;
  /** This competitor's total organic-keyword count. */
  theirOrganicKeywords: number;
  /** Their estimated monthly organic visits. */
  theirOrganicTraffic: number;
}

export interface SeoSnapshot {
  /** ISO date when the data was pulled. */
  date: string;
  /** Which tool the data came from. */
  source: "semrush" | "ahrefs" | "gsc";
  /** Two-letter Google database code — "in" = google.co.in. */
  database: string;
  overview: SeoDomainOverview;
  /** Sorted: highest traffic first. */
  topPages: SeoTopPage[];
  /** Sorted: best position first. */
  topPositions: SeoPosition[];
  /** Sorted: most relevant competitor first. */
  competitors: SeoCompetitor[];
}

/**
 * Seed snapshot pulled 2026-05-20 via Semrush MCP tools.
 *
 * Three API calls used:
 *   1. domain_rank        — overview block below
 *   2. domain_organic     — topPositions (all 18 organic rankings)
 *   3. domain_organic_unique     — topPages (only 7 URLs visible to Semrush)
 *   4. domain_organic_organic    — competitors (top 10 by relevance)
 *
 * Cost: ~80 API units total (well under the 10,000/day quota a basic
 * Pro+API plan would have).
 */
export const SEO_SNAPSHOT: SeoSnapshot = {
  date: "2026-05-20",
  source: "semrush",
  database: "in",

  overview: {
    domain: "bipevns.org",
    rank: 492591,
    organicKeywords: 18,
    organicTraffic: 397,
    organicCost: 0,
  },

  topPages: [
    // ~98% of organic traffic lands on the homepage. The other entries
    // are old URLs (e.g. /bipe-media, /polytechnic-courses) from a
    // previous version of the site that still rank for brand long-tails
    // and a single faculty name. Worth keeping an eye on `/thank-u`
    // being indexed at all — it should probably get a noindex header.
    { url: "https://bipevns.org/",                       keywords: 6, traffic: 389, trafficPct: 97.98 },
    { url: "https://www.bipevns.org/",                   keywords: 7, traffic: 6,   trafficPct: 1.51  },
    { url: "https://bipevns.org/contact-us",             keywords: 1, traffic: 1,   trafficPct: 0.25  },
    { url: "https://www.bipevns.org/bipe-media",         keywords: 1, traffic: 1,   trafficPct: 0.25  },
    { url: "https://bipevns.org/polytechnic-courses",    keywords: 1, traffic: 0,   trafficPct: 0.00  },
    { url: "https://bipevns.org/faculties",              keywords: 1, traffic: 0,   trafficPct: 0.00  },
    { url: "https://bipevns.org/thank-u",                keywords: 1, traffic: 0,   trafficPct: 0.00  },
  ],

  // All 18 organic rankings Semrush observed for bipevns.org in the
  // Indian database. Duplicates are intentional — Semrush counts the
  // same keyword on different ranking URLs separately (e.g.
  // "banaras institute of polytechnic & engineering" ranks at #1 on /,
  // #14 on /contact-us, #22 on /bipe-media, #56 on /thank-u — that's
  // four distinct landings).
  topPositions: [
    { keyword: "banaras institute of polytechnic & engineering", position: 1,  previousPosition: 1,  positionDelta: 0, searchVolume: 720,  url: "https://bipevns.org/",                      trafficPct: 85.13 },
    { keyword: "bipe",                                            position: 2,  previousPosition: 2,  positionDelta: 0, searchVolume: 1000, url: "https://bipevns.org/",                      trafficPct: 12.59 },
    { keyword: "banaras institute of technology",                 position: 3,  previousPosition: 3,  positionDelta: 0, searchVolume: 110,  url: "https://www.bipevns.org/",                  trafficPct: 1.25  },
    { keyword: "polytechnic college in varanasi",                 position: 12, previousPosition: 12, positionDelta: 0, searchVolume: 590,  url: "https://www.bipevns.org/",                  trafficPct: 0.25  },
    { keyword: "banaras institute of polytechnic & engineering",  position: 14, previousPosition: 14, positionDelta: 0, searchVolume: 720,  url: "https://bipevns.org/contact-us",            trafficPct: 0.25  },
    { keyword: "government polytechnic college in varanasi",      position: 17, previousPosition: 17, positionDelta: 0, searchVolume: 110,  url: "https://bipevns.org/",                      trafficPct: 0.00  },
    { keyword: "engineering colleges in varanasi",                position: 18, previousPosition: 18, positionDelta: 0, searchVolume: 1000, url: "https://bipevns.org/",                      trafficPct: 0.25  },
    { keyword: "government polytechnic varanasi",                 position: 19, previousPosition: 19, positionDelta: 0, searchVolume: 320,  url: "https://www.bipevns.org/",                  trafficPct: 0.00  },
    { keyword: "banaras institute of polytechnic & engineering",  position: 22, previousPosition: 22, positionDelta: 0, searchVolume: 720,  url: "https://www.bipevns.org/bipe-media",        trafficPct: 0.25  },
    { keyword: "baba bindeshwari singh institute of technology and management", position: 24, previousPosition: 24, positionDelta: 0, searchVolume: 480, url: "https://www.bipevns.org/", trafficPct: 0.00 },
    { keyword: "engineering colleges in varanasi",                position: 25, previousPosition: 25, positionDelta: 0, searchVolume: 1000, url: "https://bipevns.org/",                      trafficPct: 0.00  },
    { keyword: "government girls polytechnic varanasi",           position: 36, previousPosition: 36, positionDelta: 0, searchVolume: 110,  url: "https://bipevns.org/",                      trafficPct: 0.00  },
    { keyword: "banaras institute of technology",                 position: 37, previousPosition: 37, positionDelta: 0, searchVolume: 110,  url: "https://bipevns.org/polytechnic-courses",   trafficPct: 0.00  },
    { keyword: "arpit kumar kashyap",                             position: 40, previousPosition: 40, positionDelta: 0, searchVolume: 390,  url: "https://bipevns.org/faculties",             trafficPct: 0.00  },
    { keyword: "banaras institute of teacher education",          position: 52, previousPosition: 52, positionDelta: 0, searchVolume: 140,  url: "https://www.bipevns.org/",                  trafficPct: 0.00  },
    { keyword: "banaras institute of polytechnic & engineering",  position: 56, previousPosition: 56, positionDelta: 0, searchVolume: 720,  url: "https://bipevns.org/thank-u",               trafficPct: 0.00  },
    { keyword: "baba bindeshwari singh institute of technology and management", position: 57, previousPosition: 57, positionDelta: 0, searchVolume: 480, url: "https://www.bipevns.org/", trafficPct: 0.00 },
    { keyword: "b tech college in varanasi",                      position: 87, previousPosition: 87, positionDelta: 0, searchVolume: 320,  url: "https://www.bipevns.org/",                  trafficPct: 0.00  },
  ],

  // Top 10 by competitor relevance score. kashiit.ac.in is the most
  // significant — they have 560 organic keywords and 20,340 estimated
  // monthly traffic, 3 of which overlap with us. INTERNAL SEO-INTEL
  // ONLY — we do NOT name private competitors on any public page
  // (repositioned 25 May 2026: category leaders define the standard,
  // they don't legitimise smaller players by mentioning them). The
  // real competitive set is government & aided polytechnics — see
  // /private-vs-government-polytechnic. ggpvaranasi.in is interesting:
  // Government Girls Polytechnic Varanasi, which is why we rank #36
  // for "government girls polytechnic varanasi" — entity confusion
  // that /about/affiliations should help disambiguate.
  competitors: [
    { domain: "ambitionit.in",   relevance: 0.25, commonKeywords: 3, theirOrganicKeywords: 38,   theirOrganicTraffic: 1822  },
    { domain: "ggpvaranasi.in",  relevance: 0.23, commonKeywords: 3, theirOrganicKeywords: 41,   theirOrganicTraffic: 638   },
    { domain: "extremeflightrc.com", relevance: 0.17, commonKeywords: 1, theirOrganicKeywords: 106, theirOrganicTraffic: 52 },
    { domain: "vnitm.co",        relevance: 0.13, commonKeywords: 1, theirOrganicKeywords: 28,   theirOrganicTraffic: 2     },
    { domain: "bipeducation.com",relevance: 0.12, commonKeywords: 1, theirOrganicKeywords: 1,    theirOrganicTraffic: 1     },
    { domain: "parcex.org",      relevance: 0.12, commonKeywords: 1, theirOrganicKeywords: 4,    theirOrganicTraffic: 5     },
    { domain: "kashiit.ac.in",   relevance: 0.05, commonKeywords: 3, theirOrganicKeywords: 560,  theirOrganicTraffic: 20340 },
    { domain: "geneve.ch",       relevance: 0.05, commonKeywords: 1, theirOrganicKeywords: 1016, theirOrganicTraffic: 282   },
    { domain: "sheatcollege.com",relevance: 0.03, commonKeywords: 2, theirOrganicKeywords: 531,  theirOrganicTraffic: 4361  },
    { domain: "rswaet.in",       relevance: 0.03, commonKeywords: 1, theirOrganicKeywords: 1,    theirOrganicTraffic: 76    },
  ],
};

/**
 * URLs that have been remediated on our side (typically via 301
 * redirect in next.config.ts) but still show up in Semrush snapshots
 * because Google hasn't re-crawled and re-indexed yet. Typical lag
 * 2-4 weeks after the redirect ships.
 *
 * Surfacing the remediation state in the dashboard alert lets an
 * admin tell at a glance which zombies are open problems vs which
 * are "shipped, waiting for SERP refresh." Without this list, every
 * snapshot-refresh would re-raise the same alarm for issues we've
 * already handled.
 *
 * Format: zombie path → { redirectsTo, sinceISO }
 */
export const REMEDIATED_ZOMBIE_PATHS: Record<string, { redirectsTo: string; sinceISO: string }> = {
  "/thank-u":             { redirectsTo: "/",        sinceISO: "2026-05-20" },
  "/bipe-media":          { redirectsTo: "/events",  sinceISO: "2026-05-20" },
  "/polytechnic-courses": { redirectsTo: "/courses", sinceISO: "2026-05-20" },
  "/faculties":           { redirectsTo: "/faculty", sinceISO: "2026-05-20" },
};

/**
 * Quick helper: pages on bipevns.org that probably shouldn't be
 * ranking at all (404'd, deleted, or thank-you-style pages that
 * leaked into the index). Surface in the dashboard as a flag.
 *
 * Returns the same SeoTopPage rows the snapshot has, plus an extra
 * `remediation` field if we've already shipped a fix (301 redirect)
 * that just hasn't propagated to Semrush yet.
 */
export type ZombiePage = SeoTopPage & {
  remediation?: { redirectsTo: string; sinceISO: string };
};

export function indexedZombiePages(snapshot: SeoSnapshot = SEO_SNAPSHOT): ZombiePage[] {
  const zombiePatterns = [
    "/thank-u",              // form thank-you — should be noindex (now 301 → /)
    "/bipe-media",           // legacy URL — current site uses /events
    "/polytechnic-courses",  // legacy URL — current site uses /courses
    "/faculties",            // legacy URL — current site uses /faculty
  ];
  return snapshot.topPages
    .filter((p) => zombiePatterns.some((pat) => p.url.includes(pat)))
    .map((p) => {
      // Identify which of the patterns this URL matched so we can look
      // up its remediation entry.
      const matchedPattern = zombiePatterns.find((pat) => p.url.includes(pat));
      const remediation = matchedPattern
        ? REMEDIATED_ZOMBIE_PATHS[matchedPattern]
        : undefined;
      return { ...p, remediation };
    });
}

/**
 * Quick helper: keywords where we're on pages 2-3 (rank 11-30) and
 * a small push could move us to page 1. Same definition as
 * lib/keyword-positions.ts's quickWins but applied to live Semrush data.
 */
export function semrushQuickWins(snapshot: SeoSnapshot = SEO_SNAPSHOT): SeoPosition[] {
  return snapshot.topPositions
    .filter((p) => p.position >= 4 && p.position <= 30)
    .sort((a, b) => a.position - b.position);
}

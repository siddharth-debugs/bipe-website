/**
 * Keyword position tracker.
 *
 * Snapshot of BIPE's organic ranking position for each tracked keyword
 * at a given point in time. Source-of-truth for the admin SEO dashboard
 * at /admin/dashboard/seo.
 *
 * ─── How to update ────────────────────────────────────────────────
 *
 * Manual cadence (current):
 *   - Run a fresh Semrush / Ahrefs / GSC export.
 *   - Add a new entry to POSITION_SNAPSHOTS at the top of the array.
 *   - Set `date` to today (ISO YYYY-MM-DD).
 *   - Set `source` to whichever tool you used.
 *   - Copy the keyword rows from the latest snapshot below it (they'll
 *     be your baseline), then overwrite the `currentRank` field with
 *     the fresh number from the export.
 *   - Commit. The /admin/dashboard/seo page reads the array's first
 *     entry (most recent) by default.
 *
 * Automated cadence (future):
 *   - Once a Semrush API key is provisioned, replace this static array
 *     with a server-action that fetches the API on a cron schedule and
 *     writes to a Django model on the backend. The TypeScript shape
 *     here (KeywordPosition) is intentionally the same shape Semrush
 *     returns from its `domain_ranks` endpoint, so the swap is mostly
 *     mechanical.
 *
 * ─── Seed data ────────────────────────────────────────────────────
 *
 * The initial snapshot below was extracted from BITE_BIPE_Phase1_
 * Keyword_Research.xlsx (Semrush export, May 2026). Every row from the
 * BIPE_Keywords sheet plus the Current_Rankings sheet's BIPE entries
 * is included. Where a row was "Not ranked" in Semrush, currentRank is
 * null — the page treats null as "outside top 100".
 */

export type KeywordTier = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type KeywordIntent = "Navigational" | "Transactional" | "Commercial" | "Informational";
export type KeywordSource = "semrush" | "ahrefs" | "gsc" | "manual";

export interface KeywordPosition {
  /** The query as typed by the user. Lowercase, no punctuation tweaks. */
  keyword: string;
  /** Internal categorisation — see BIPE_Keyword_Strategy.xlsx for tier definitions. */
  tier: KeywordTier;
  /** Average monthly searches in India per the source tool. */
  monthlySearches: number;
  /** Cost-per-click in INR (proxy for commercial intent). */
  cpcInr: number;
  /** Competition score 0-1 (paid bidding density; proxy for organic difficulty). */
  competition: number;
  intent: KeywordIntent;
  /** The canonical page on bipevns.org we want ranking for this query. */
  targetPage: string;
  /** Current organic rank in Google.co.in. null = not in top 100. */
  currentRank: number | null;
  /** Free-text notes — last-known mover, gotcha, etc. */
  notes?: string;
}

export interface PositionSnapshot {
  /** ISO date the data was pulled. */
  date: string;
  /** Which tool the data came from. */
  source: KeywordSource;
  /** Free-text label — "Phase 1 baseline", "post-keyword-roadmap", etc. */
  label: string;
  ranks: KeywordPosition[];
}

export const POSITION_SNAPSHOTS: PositionSnapshot[] = [
  {
    date: "2026-05-19",
    source: "semrush",
    label: "Phase 1 baseline — pre-roadmap",
    ranks: [
      // T1 — Local Money
      { keyword: "polytechnic college in varanasi",   tier: "B", monthlySearches: 590,   cpcInr: 0.14, competition: 0.07, intent: "Transactional",  targetPage: "/",                                  currentRank: 12,   notes: "Page 2 — Commit A (homepage hero) targets push to top 5." },
      { keyword: "polytechnic colleges in varanasi",  tier: "B", monthlySearches: 590,   cpcInr: 0.14, competition: 0.07, intent: "Transactional",  targetPage: "/",                                  currentRank: null },
      { keyword: "polytechnic in varanasi",           tier: "B", monthlySearches: 70,    cpcInr: 0,    competition: 0.33, intent: "Transactional",  targetPage: "/",                                  currentRank: null },
      { keyword: "engineering colleges in varanasi",  tier: "B", monthlySearches: 1000,  cpcInr: 0.35, competition: 0.14, intent: "Transactional",  targetPage: "/",                                  currentRank: 18,   notes: "Page 2 — LocalBusiness schema (Commit D) should help." },
      { keyword: "polytechnic admission 2026",        tier: "C", monthlySearches: 390,   cpcInr: 0.33, competition: 0.12, intent: "Transactional",  targetPage: "/admission",                         currentRank: null },
      { keyword: "jeecup 2026",                       tier: "C", monthlySearches: 2400,  cpcInr: 0.28, competition: 0.05, intent: "Transactional",  targetPage: "/jeecup",                            currentRank: null,  notes: "Title now contains 'JEECUP 2026'." },
      { keyword: "jeecup counselling",                tier: "C", monthlySearches: 18100, cpcInr: 0.43, competition: 0.01, intent: "Transactional",  targetPage: "/jeecup-counselling",                currentRank: null,  notes: "New dedicated page (Commit E). Highest volume in universe." },
      { keyword: "up polytechnic",                    tier: "C", monthlySearches: 27100, cpcInr: 0.27, competition: 0.02, intent: "Transactional",  targetPage: "/admission",                         currentRank: null,  notes: "Audit advice: do NOT target head-on — too competitive nationally." },

      // T2 — Branch Programmes
      { keyword: "diploma in civil engineering",      tier: "D", monthlySearches: 9900,  cpcInr: 0.35, competition: 0.09, intent: "Informational", targetPage: "/courses/civil-engineering",                  currentRank: null, notes: "Branch title rewritten to lead with phrase (Commit B)." },
      { keyword: "diploma in mechanical engineering", tier: "D", monthlySearches: 3600,  cpcInr: 0.36, competition: 0.09, intent: "Informational", targetPage: "/courses/mechanical-engineering-production",  currentRank: null, notes: "Same — Commit B." },
      { keyword: "diploma in computer science",       tier: "D", monthlySearches: 9900,  cpcInr: 0.43, competition: 0.13, intent: "Informational", targetPage: "/courses/computer-science-engineering",       currentRank: null },
      { keyword: "diploma in electrical engineering", tier: "D", monthlySearches: 2400,  cpcInr: 0.31, competition: 0.09, intent: "Informational", targetPage: "/courses/electrical-engineering",             currentRank: null },
      { keyword: "diploma in electronics engineering",tier: "D", monthlySearches: 720,   cpcInr: 0.39, competition: 0.06, intent: "Informational", targetPage: "(BIPE doesn't offer)",                       currentRank: null, notes: "BIPE has no Electronics branch — out of scope." },

      // T2 — Programme Info
      { keyword: "polytechnic course",                tier: "C", monthlySearches: 18100, cpcInr: 0.32, competition: 0.03, intent: "Informational", targetPage: "/courses",                              currentRank: null },
      { keyword: "polytechnic admission",             tier: "C", monthlySearches: 14800, cpcInr: 0.36, competition: 0.12, intent: "Transactional", targetPage: "/admission",                            currentRank: null },
      { keyword: "polytechnic syllabus",              tier: "C", monthlySearches: 3600,  cpcInr: 0.36, competition: 0.33, intent: "Informational", targetPage: "(no dedicated page)",                   currentRank: null },
      { keyword: "polytechnic fees",                  tier: "C", monthlySearches: 1600,  cpcInr: 0,    competition: 0,    intent: "Commercial",     targetPage: "/fees",                                 currentRank: null, notes: "Title now 'Polytechnic fees 2026-27'." },
      { keyword: "polytechnic eligibility",           tier: "C", monthlySearches: 590,   cpcInr: 0,    competition: 0.01, intent: "Informational", targetPage: "(no dedicated page — covered in Hindi blog)", currentRank: null },
      { keyword: "polytechnic colleges near me",      tier: "B", monthlySearches: 4400,  cpcInr: 0.26, competition: 0.02, intent: "Transactional", targetPage: "/",                                     currentRank: null, notes: "LocalBusiness schema + GBP claim unlocks the local pack." },
      { keyword: "polytechnic colleges in lucknow",   tier: "B", monthlySearches: 1000,  cpcInr: 0.16, competition: 0.06, intent: "Transactional", targetPage: "(out of catchment)",                    currentRank: null },

      // T3 — Hindi / Hinglish
      { keyword: "polytechnic kya hai",               tier: "C", monthlySearches: 2900,  cpcInr: 0,    competition: 0.33, intent: "Informational", targetPage: "/blog/polytechnic-kya-hai-aur-kaise-kare", currentRank: null, notes: "New Hindi blog post (Commit C)." },
      { keyword: "polytechnic kaise kare",            tier: "C", monthlySearches: 320,   cpcInr: 0.26, competition: 0.04, intent: "Informational", targetPage: "/blog/polytechnic-kya-hai-aur-kaise-kare", currentRank: null, notes: "Same post — phrase in title." },
      { keyword: "what is polytechnic",               tier: "C", monthlySearches: 5400,  cpcInr: 0,    competition: 0.33, intent: "Informational", targetPage: "/blog/polytechnic-kya-hai-aur-kaise-kare", currentRank: null },
      { keyword: "what is polytechnic courses",       tier: "C", monthlySearches: 2400,  cpcInr: 0,    competition: 0.33, intent: "Informational", targetPage: "/blog/polytechnic-kya-hai-aur-kaise-kare", currentRank: null },
      { keyword: "polytechnic full form",             tier: "C", monthlySearches: 1000,  cpcInr: 0,    competition: 0,    intent: "Informational", targetPage: "(could be a blog stub)",                 currentRank: null },
      { keyword: "polytechnic course details",        tier: "C", monthlySearches: 320,   cpcInr: 0.3,  competition: 0.01, intent: "Informational", targetPage: "/courses",                              currentRank: null },
      { keyword: "polytechnic admission process",     tier: "C", monthlySearches: 210,   cpcInr: 0.35, competition: 0.04, intent: "Informational", targetPage: "/admission",                            currentRank: null },
      { keyword: "polytechnic after 10th",            tier: "C", monthlySearches: 720,   cpcInr: 0.36, competition: 0.08, intent: "Informational", targetPage: "/blog/polytechnic-kya-hai-aur-kaise-kare", currentRank: null },
      { keyword: "diploma after 10th",                tier: "C", monthlySearches: 8100,  cpcInr: 0.41, competition: 0.15, intent: "Informational", targetPage: "/blog/diploma-vs-iti-vs-btech-after-class-10", currentRank: null },
      { keyword: "polytechnic vs iti",                tier: "E", monthlySearches: 210,   cpcInr: 0,    competition: 0,    intent: "Informational", targetPage: "/blog/diploma-vs-iti-vs-btech-after-class-10", currentRank: null },
      { keyword: "is polytechnic and diploma same",   tier: "E", monthlySearches: 390,   cpcInr: 0,    competition: 0.33, intent: "Informational", targetPage: "/blog/diploma-vs-iti-vs-btech-after-class-10", currentRank: null },

      // T4 — Brand (already strong)
      { keyword: "bipe",                                  tier: "A", monthlySearches: 1000, cpcInr: 0, competition: 0,    intent: "Navigational", targetPage: "/", currentRank: 2,  notes: "Push to #1 — easy brand defence." },
      { keyword: "banaras institute of polytechnic & engineering", tier: "A", monthlySearches: 720, cpcInr: 0, competition: 0.01, intent: "Navigational", targetPage: "/", currentRank: 1,  notes: "Hold." },
      { keyword: "bipe varanasi",                         tier: "A", monthlySearches: 20,   cpcInr: 0, competition: 0.33, intent: "Navigational", targetPage: "/", currentRank: null },
      { keyword: "banaras institute of technology",       tier: "A", monthlySearches: 110,  cpcInr: 0, competition: 0,    intent: "Navigational", targetPage: "/", currentRank: 3,  notes: "Partial brand match — BITE confusion. Acceptable as-is." },

      // T4 — Wrong-intent rankings (BIPE shouldn't rank for these)
      { keyword: "government polytechnic varanasi",         tier: "H", monthlySearches: 320, cpcInr: 0, competition: 0,    intent: "Transactional", targetPage: "(BIPE is private)",  currentRank: 19,  notes: "Wrong intent — Commit D schema clarifies 'private'." },
      { keyword: "government polytechnic college in varanasi", tier: "H", monthlySearches: 110, cpcInr: 0, competition: 0,    intent: "Transactional", targetPage: "(BIPE is private)", currentRank: 17,  notes: "Same — should drop once schema propagates." },
      { keyword: "government girls polytechnic varanasi",   tier: "H", monthlySearches: 110, cpcInr: 0, competition: 0,    intent: "Transactional", targetPage: "(BIPE is private + co-ed)", currentRank: 36, notes: "Wrong on two fronts. Schema fix should help; co-ed clarification could be added later." },
      { keyword: "b tech college in varanasi",              tier: "H", monthlySearches: 320, cpcInr: 0, competition: 0,    intent: "Transactional", targetPage: "(BIPE is diploma, not B.Tech)", currentRank: 87, notes: "Out of scope — BIPE doesn't offer B.Tech." },
      { keyword: "baba bindeshwari singh institute of technology and management", tier: "H", monthlySearches: 480, cpcInr: 0, competition: 0, intent: "Navigational", targetPage: "(different entity)", currentRank: 24, notes: "Entity confusion — investigate why Google associates this name with BIPE." },
    ],
  },
];

/**
 * Helper: latest snapshot (assumes the array is sorted newest-first).
 */
export function latestSnapshot(): PositionSnapshot {
  return POSITION_SNAPSHOTS[0];
}

/**
 * Helper: total monthly search potential we're targeting (sum of all
 * monthlySearches in the latest snapshot, excluding "out of scope" rows).
 */
export function totalAddressableVolume(snapshot: PositionSnapshot = latestSnapshot()): number {
  return snapshot.ranks
    .filter((r) => !r.targetPage.startsWith("(") || r.targetPage.startsWith("(no dedicated"))
    .reduce((sum, r) => sum + r.monthlySearches, 0);
}

/**
 * Helper: which keywords are realistic short-term wins?
 * Definition: currently ranking somewhere AND under top 30.
 */
export function quickWins(snapshot: PositionSnapshot = latestSnapshot()): KeywordPosition[] {
  return snapshot.ranks
    .filter((r) => r.currentRank !== null && r.currentRank <= 30)
    .sort((a, b) => (a.currentRank ?? 999) - (b.currentRank ?? 999));
}

/**
 * Helper: keywords we want but don't yet have. The growth-opportunity map.
 *
 * Filter:
 *   - currentRank === null (not in top 100)
 *   - monthlySearches >= minVolume (default 500 — low signal-to-noise below)
 *   - targetPage is NOT a parenthetical "BIPE doesn't offer / different
 *     entity / out of catchment / is private / is diploma" note
 *
 * Keeps "(no dedicated page)" and similar in-scope-but-missing rows —
 * those are content-debt opportunities, not out-of-scope rejections.
 *
 * Sorted by monthly volume descending: the biggest unclaimed prize at
 * the top. Each row gets the existing `notes` field, which often
 * carries the strategic gloss (e.g. "Audit advice: do NOT target head-on").
 */
export function opportunityTargets(
  snapshot: PositionSnapshot = latestSnapshot(),
  minVolume = 500,
): KeywordPosition[] {
  return snapshot.ranks
    .filter((r) => r.currentRank === null)
    .filter((r) => r.monthlySearches >= minVolume)
    .filter((r) => {
      if (!r.targetPage.startsWith("(")) return true;
      const tp = r.targetPage.toLowerCase();
      // Drop genuinely out-of-scope rows. The "(no dedicated page ...)"
      // and "(could be a blog stub)" rows stay because those ARE
      // opportunities, just not yet acted on.
      if (
        tp.includes("doesn't offer") ||
        tp.includes("different entity") ||
        tp.includes("out of catchment") ||
        tp.includes("is private") ||
        tp.includes("is diploma, not") ||
        tp.includes("co-ed")
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.monthlySearches - a.monthlySearches);
}

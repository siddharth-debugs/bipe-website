/**
 * PLACEMENT STATS — the single source of truth for every placement
 * number on the BIPE website.
 *
 * This module IS the design-system pattern for placement data. All
 * the constants exported below are computed from
 * lib/alumni-manifest.json at module-load time, so when the TPO
 * updates the XLSX in data/source/ and we re-run the parser, every
 * surface that imports from here updates automatically — no grep
 * for stale "1,363" strings, no hand-editing of /placements vs
 * /alumni vs homepage stats.
 *
 *   data/source/all-placed-students.xlsx          (TPO writes here)
 *                ↓ scripts/parse-placement-xlsx.py
 *   lib/alumni-manifest.json                       (parsed structure)
 *                ↓ this module
 *   lib/placement-stats.ts  (PLACEMENT_STATS const)
 *                ↓ named-import everywhere
 *   /alumni · /placements · homepage · schema · meta descriptions
 *
 * To update placement numbers everywhere:
 *
 *   1. Replace data/source/all-placed-students.xlsx with the new
 *      TPO file (or have TPO drop the new file into the same path).
 *   2. Run:    python3 scripts/parse-placement-xlsx.py
 *   3. Commit  data/source/*.xlsx, lib/alumni-manifest.json
 *      (placement-stats.ts itself doesn't change — it reads from
 *      the manifest at module-load).
 *
 * The PLACEMENT_CANONICAL block at the bottom is the manual override
 * for marketing-claim numbers (e.g. the "46 recruiters across India"
 * marketing claim that includes named-recruiter-pool drives the data
 * doesn't fully split). When the data and the canonical claim
 * disagree, the canonical claim wins on user-facing surfaces — but
 * we keep the data-derived number as `*Verified` so analysts and
 * crawlers see the diff.
 */

import manifest from "@/lib/alumni-manifest.json";

// ─── Computed from the manifest ────────────────────────────────────

const m = manifest as {
  totalAlumni: number;
  totalJoined: number;
  totalOffered: number;
  totalDrives: number;
  distinctRecruiters: number;
  poolDriveCount: number;
  poolStudentCount: number;
  topRecruiter: { name: string; count: number };
  recruiterCounts: Record<string, number>;
  branches: string[];
  years: string[];
};

const startYear = m.years.length > 0 ? Number(m.years[0]) : 2016;
const endYear = m.years.length > 0 ? Number(m.years[m.years.length - 1]) : 2025;

/**
 * Verified-from-the-XLSX numbers. The `Verified` suffix is the data
 * trust signal — these are exactly what the TPO-maintained file
 * shows, no marketing rounding. Use these on:
 *   - structured data (Schema.org)
 *   - admin / placement-cell dashboards
 *   - SEO meta descriptions where the number IS the value prop
 */
export const PLACEMENT_VERIFIED = {
  /** Total named students in the TPO file. */
  totalPlacements: m.totalAlumni,
  /** Drives documented in the file. */
  totalDrives: m.totalDrives,
  /** Distinct single-recruiter companies (excludes multi-recruiter
   *  pool drives, which are tagged separately). */
  distinctRecruiters: m.distinctRecruiters,
  /** Multi-recruiter pool drives — drives where the TPO combined
   *  several recruiters under one row. Counted as drives but NOT
   *  rolled into distinctRecruiters. */
  poolDriveCount: m.poolDriveCount,
  /** Students placed via multi-recruiter pool drives. */
  poolStudentCount: m.poolStudentCount,
  /** Top single-recruiter company by placement count. */
  topRecruiter: m.topRecruiter,
  /** First and last calendar year the manifest covers. */
  startYear,
  endYear,
  /** Inclusive years count, e.g. 2016–2026 = 10. */
  yearsOnRecord: endYear - startYear + 1,
  /** Full list of distinct branches in the manifest. */
  branches: m.branches,
  /** All years that have at least one record. */
  years: m.years,
  /** Top-N recruiter leaderboard for the placements page. */
  topRecruiters(limit = 10): Array<{ name: string; count: number }> {
    return Object.entries(m.recruiterCounts)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  },
} as const;

// ─── Marketing-claim canonical numbers ─────────────────────────────
//
// These are the round, headline-friendly numbers used in marketing
// copy. They come from the TPO and exceed the strict data-derived
// numbers because the TPO knows about recruiters who came for pool
// drives or in years the file doesn't fully split.
//
// When this block and PLACEMENT_VERIFIED disagree, public-facing
// hero copy uses CANONICAL; structured data and rich snippets use
// VERIFIED.

export const PLACEMENT_CANONICAL = {
  /**
   * Marketing-friendly recruiter count. Currently exceeds the
   * verified `distinctRecruiters` (29) because the TPO has named
   * 44 named recruiters historically and the file folds some into
   * multi-recruiter pool rows. When this drops below `verified`,
   * use the verified number instead (it's always defensible).
   */
  // 46, not 44 — owner ruling 3 Sep 2026 after the session-2026 drives
  // added Knorr-Bremse and Shapoorji Pallonji as genuinely new companies
  // (R R Parkon already existed inside the pooled drives, so it is not a
  // third increment). Still deliberately above the verified
  // distinctRecruiters, which cannot see companies folded into
  // multi-recruiter pool rows.
  totalRecruiters: 46,
} as const;

// ─── Combined public-facing constants ──────────────────────────────
//
// These are what most components should import. They blend the
// canonical claim with the verified data so the public stat tiles
// stay consistent.

export const PLACEMENT_STATS = {
  /** "1,363" — the verified placements number. Used on hero strips
   *  AND structured data, because it's both round AND defensible. */
  totalPlacements: PLACEMENT_VERIFIED.totalPlacements,
  /** "46" — marketing claim used in headline copy. Falls back to the
   *  verified distinct-recruiter count if the canonical drops below. */
  totalRecruiters: Math.max(
    PLACEMENT_CANONICAL.totalRecruiters,
    PLACEMENT_VERIFIED.distinctRecruiters,
  ),
  /** "51" — exact count from the file. Use this for "Drives
   *  documented" tiles. */
  totalDrives: PLACEMENT_VERIFIED.totalDrives,
  /** "Vikas Group" — top single recruiter. */
  topRecruiterName: PLACEMENT_VERIFIED.topRecruiter.name,
  /** "202" — placements at the top recruiter. */
  topRecruiterCount: PLACEMENT_VERIFIED.topRecruiter.count,
  /** "2016" – "2026" range. */
  startYear: PLACEMENT_VERIFIED.startYear,
  endYear: PLACEMENT_VERIFIED.endYear,
  yearsOnRecord: PLACEMENT_VERIFIED.yearsOnRecord,
  /** Same number as totalPlacements — exported separately so the
   *  "named in this directory" tile on /alumni doesn't need to do
   *  its own length calc. */
  namedInDirectory: PLACEMENT_VERIFIED.totalPlacements,
} as const;

/**
 * Format a placements count with the Indian-locale comma grouping
 * (1,363 not 1331). Use this whenever a number flows into prose.
 */
export function formatPlacements(n: number): string {
  return n.toLocaleString("en-IN");
}

/**
 * Build a "placements through YYYY" suffix the way the rest of the
 * site already uses. Single source so the year-end suffix stays in
 * sync with the manifest.
 */
export function placementsThroughLabel(): string {
  return `${formatPlacements(PLACEMENT_STATS.totalPlacements)} placements through ${PLACEMENT_STATS.endYear}`;
}

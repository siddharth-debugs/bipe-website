/**
 * JEECUP 2026 counselling-round schedule + copy for the homepage announcement.
 *
 * The banner auto-rolls Round 1 → 2 → 3 as each round's choice-filling window
 * closes, then hides after Round 3 ends. All thresholds are IST (+05:30) so the
 * roll happens at the same instant for every visitor, regardless of their device
 * timezone. This module is pure data + a pure function (no "use client", no
 * Date.now() at module scope) so the server's initial render and the client's
 * live re-check agree — no hydration mismatch.
 *
 * Official JEECUP 2026 Phase-1 schedule (per the counselling notification):
 *   Round 1 — choice-filling 25–30 Jun, seat allotment 1 Jul
 *   Round 2 — choice-filling 7–9 Jul,  seat allotment 10 Jul
 *   Round 3 — choice-filling 16–19 Jul, seat allotment 20 Jul (round ends ~25 Jul)
 *
 * To re-use for a future cycle, edit the dates in the copy + the `rollAt`
 * thresholds below. The banner shows round N while now < rollAt[N], then the
 * next one; once now ≥ the last rollAt it returns null (hidden).
 */
export type BannerRound = {
  n: 1 | 2 | 3;
  eyebrow: string;
  headline: string;
  hindi: string;
  /** Show this round while now < rollAtMs; after that, roll to the next round. */
  rollAtMs: number;
};

const at = (iso: string) => new Date(iso).getTime();

export const BANNER_ROUNDS: BannerRound[] = [
  {
    n: 1,
    eyebrow: "JEECUP 2026 · Round 1",
    headline:
      "Pre-Counselling Registration is open — reserve your branch at BIPE (code 4455) before Round 1 choice-filling (25–30 June).",
    hindi:
      "JEECUP Round 1 choice-filling 25–30 जून — choice-filling से पहले BIPE में अपनी ब्रांच (code 4455) reserve करें।",
    rollAtMs: at("2026-07-01T00:00:00+05:30"), // after Round 1 choice-filling
  },
  {
    n: 2,
    eyebrow: "JEECUP 2026 · Round 2",
    headline:
      "Pre-Counselling Registration is open — reserve your branch at BIPE (code 4455) before Round 2 choice-filling (7–9 July).",
    hindi:
      "JEECUP Round 2 choice-filling 7–9 जुलाई — choice-filling से पहले BIPE में अपनी ब्रांच (code 4455) reserve करें।",
    rollAtMs: at("2026-07-10T00:00:00+05:30"), // after Round 2 choice-filling
  },
  {
    n: 3,
    eyebrow: "JEECUP 2026 · Round 3",
    headline:
      "Pre-Counselling Registration is open — reserve your branch at BIPE (code 4455) before Round 3 choice-filling (16–19 July).",
    hindi:
      "JEECUP Round 3 choice-filling 16–19 जुलाई — choice-filling से पहले BIPE में अपनी ब्रांच (code 4455) reserve करें।",
    rollAtMs: at("2026-07-26T00:00:00+05:30"), // close of Round 3 (25 Jul) → then hide
  },
];

/** The round to show at `nowMs`, or null once Round 3 has ended. */
export function bannerRoundAt(nowMs: number): BannerRound | null {
  for (const r of BANNER_ROUNDS) if (nowMs < r.rollAtMs) return r;
  return null;
}

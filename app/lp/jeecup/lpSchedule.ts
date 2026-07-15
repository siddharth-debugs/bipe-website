/**
 * JEECUP 2026 counselling phases for the /lp/jeecup urgency strip.
 *
 * Pure data + a pure selector — NO "use client", so the server page can
 * compute the initial phase for hydration and the client component
 * (LpScheduleNote.tsx) can re-check the live clock on mount. Mirrors the
 * lib/jeecupBannerRounds.ts pattern. Official Phase-1 schedule:
 * Round 3 choice-filling 16–19 Jul · allotment 20 Jul · fee/report to 25 Jul.
 * Dates are this cycle's; edit next year.
 */
export type LpPhase = { badge: string; text: string };

const at = (iso: string) => new Date(iso).getTime();

export const LP_PHASES: Array<LpPhase & { until: number }> = [
  {
    badge: "Round 3 · 16–19 July",
    text: "Round 3 choice-filling opens 16 July — the last main round. Seats at BIPE moved fast in Rounds 1 & 2: do your Pre-Counselling Registration today and walk into choice-filling with your branch held.",
    until: at("2026-07-16T00:00:00+05:30"),
  },
  {
    badge: "Round 3 LIVE · closes 19 July",
    text: "Round 3 choice-filling is ON (16–19 July) — the last main round. Add BIPE code 4455 to your choices now; seats moved fast in Rounds 1 & 2.",
    until: at("2026-07-20T00:00:00+05:30"),
  },
  {
    badge: "Round 3 allotment · 20 July",
    text: "Round 3 allotment is out 20 July. Allotted BIPE 4455? Report and confirm by 25 July. Rank didn't reach this round? Register below — we'll guide you into the next rounds and the spot window.",
    until: at("2026-07-26T00:00:00+05:30"),
  },
  {
    badge: "Spot & later rounds · classes 1 Aug",
    text: "Main Phase-1 rounds are over — later rounds and the spot-admission window continue at BIPE while seats last. Classes begin 1 August: register now and admissions will walk you through the fastest route.",
    until: Number.POSITIVE_INFINITY,
  },
];

/** Index into LP_PHASES for the given timestamp. */
export function phaseIndexAt(nowMs: number): number {
  for (let i = 0; i < LP_PHASES.length; i++) if (nowMs < LP_PHASES[i].until) return i;
  return LP_PHASES.length - 1;
}

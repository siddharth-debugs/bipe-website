/**
 * JEECUP 2026 counselling phases for the /lp/jeecup urgency strip.
 *
 * Pure data + a pure selector — NO "use client", so the server page can
 * compute the initial phase for hydration and the client component
 * (LpScheduleNote.tsx) can re-check the live clock on mount. Mirrors the
 * lib/jeecupBannerRounds.ts pattern.
 *
 * Round structure: Phase 1 (Rounds 1–3) is UP-domicile only; Phase 2
 * (Round 4 onward) opens to all states. Round 4 is the major re-opening — the
 * first round other-state candidates (Bihar, Jharkhand, MP) can join, plus
 * anyone who missed Rounds 1–3. Round-4/5 exact dates release progressively on
 * the portal, so that copy avoids hard dates. Dates are this cycle's; edit next
 * year.
 */
export type LpPhase = { badge: string; text: string };

const at = (iso: string) => new Date(iso).getTime();

export const LP_PHASES: Array<LpPhase & { until: number }> = [
  {
    badge: "Round 3 · 16–19 July",
    // "160+" is the owner-confirmed count (~165 admitted across Rounds 1–3,
    // 20 Jul 2026) — rounded down so it stays true as it grows.
    text: "Round 3 choice-filling opens 16 July. 160+ admissions are already confirmed at BIPE this season: do your Pre-Counselling Registration today and walk into choice-filling with your branch held.",
    until: at("2026-07-16T00:00:00+05:30"),
  },
  {
    badge: "Round 3 LIVE · closes 19 July",
    text: "Round 3 choice-filling is ON (16–19 July). Add BIPE code 4455 to your choices now — 160+ admissions already confirmed this season.",
    until: at("2026-07-20T00:00:00+05:30"),
  },
  {
    badge: "Round 3 allotment · Round 4 next",
    text: "Round 3 allotment is out (20 July) — report by 25 July if allotted. Not allotted, or from another state? Round 4 (Phase 2) opens next and it's open to ALL states. Register below and we'll guide you in.",
    until: at("2026-07-23T00:00:00+05:30"),
  },
  {
    badge: "Round 4 · Phase 2 · all states",
    text: "Round 4 is the big re-opening — Phase 2 welcomes candidates from every state (Bihar, Jharkhand, MP too) and anyone who missed Rounds 1–3. Open / general category, no UP domicile needed. Reserve your branch at BIPE (code 4455) — 160+ admitted so far.",
    until: at("2026-08-06T00:00:00+05:30"),
  },
  {
    badge: "Round 5 · final round · classes 1 Aug",
    text: "JEECUP Round 5 is the final counselling round — last seats at BIPE, open to all states. Classes begin 1 August. Register now and admissions will walk you through the fastest route to a confirmed seat.",
    until: Number.POSITIVE_INFINITY,
  },
];

/** Index into LP_PHASES for the given timestamp. */
export function phaseIndexAt(nowMs: number): number {
  for (let i = 0; i < LP_PHASES.length; i++) if (nowMs < LP_PHASES[i].until) return i;
  return LP_PHASES.length - 1;
}

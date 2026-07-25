/**
 * JEECUP 2026 counselling-round schedule + copy for the homepage announcement.
 *
 * The banner auto-rolls through the live counselling round as each window
 * closes. All thresholds are IST (+05:30) so the roll happens at the same
 * instant for every visitor, regardless of device timezone. Pure data + a pure
 * function (no "use client", no Date.now() at module scope) so the server's
 * initial render and the client's live re-check agree — no hydration mismatch.
 *
 * Official JEECUP 2026 structure — TWO PHASES, five main rounds:
 *   PHASE 1 · Rounds 1–3 · UP-DOMICILE ONLY
 *     Round 1 — choice-filling 25–30 Jun, allotment 1 Jul
 *     Round 2 — choice-filling 7–9 Jul,   allotment 10 Jul
 *     Round 3 — choice-filling 16–19 Jul, allotment 20 Jul (report by ~25 Jul)
 *   PHASE 2 · Rounds 4–5 · OPEN TO ALL STATES (Bihar, Jharkhand, MP…)
 *     Round 4 — the major re-opening: other-state candidates become eligible
 *               for the first time, plus UP candidates who missed/weren't
 *               allotted in Rounds 1–3. Dates released progressively on the
 *               portal (Round-4 choice-filling expected ~23–25 Jul) — so the
 *               Round-4/5 copy below deliberately avoids a hard date and points
 *               to jeecup.admissions.nic.in.
 *     Round 5 — final round (choice-filling expected early Aug).
 *
 * To re-use for a future cycle, edit the copy + `rollAt` thresholds. The banner
 * shows round N while now < rollAt[N], then the next one; once now ≥ the last
 * rollAt it returns null (hidden).
 */
export type BannerRound = {
  n: 1 | 2 | 3 | 4 | 5;
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
    eyebrow: "JEECUP 2026 · Round 3 Allotment",
    headline:
      "JEECUP Round 3 allotment is out — report by 25 July if you got a seat. Missed Rounds 1–3, or from another state? Round 4 (Phase 2) opens next for ALL states. Reserve your branch at BIPE, code 4455.",
    hindi:
      "JEECUP Round 3 allotment आ गया — seat मिली तो 25 जुलाई तक report करें। मौका छूट गया या दूसरे राज्य से हैं? Round 4 (Phase 2) सभी राज्यों के लिए खुल रहा है। BIPE में reserve करें, code 4455।",
    rollAtMs: at("2026-07-20T00:00:00+05:30"), // Round 3 selection done → focus shifts to Round 4 (owner, 20 Jul)
  },
  {
    n: 4,
    eyebrow: "JEECUP 2026 · Round 4 · reserve by 27 July",
    headline:
      "JEECUP Round 4 is the big one — Phase 2 opens to ALL states (Bihar, Jharkhand, MP too), plus anyone who missed Rounds 1–3. Reserve your branch at BIPE by 27 July (code 4455) — register by then and the office holds your branch + seat.",
    hindi:
      "JEECUP Round 4 सबसे बड़ा मौका — Phase 2 में अब सभी राज्यों के students eligible (Bihar, Jharkhand, MP भी), और जिनका Rounds 1–3 में मौका छूटा वो भी। 27 जुलाई तक BIPE में branch reserve करें (code 4455) — तब तक registration पूरा करें और office आपकी branch + seat hold कर देगा।",
    rollAtMs: at("2026-08-06T00:00:00+05:30"), // Round 4 window → roll to Round 5
  },
  {
    n: 5,
    eyebrow: "JEECUP 2026 · Round 5 · Final round",
    headline:
      "JEECUP Round 5 — the final counselling round. Last seats at BIPE (code 4455), open to all states. Classes begin 1 August — reserve your branch now before the seats close.",
    hindi:
      "JEECUP Round 5 — आख़िरी counselling round। BIPE में last seats (code 4455), सभी राज्यों के लिए। Classes 1 August से — seats बंद होने से पहले अभी reserve करें।",
    rollAtMs: at("2026-08-16T00:00:00+05:30"), // end of Phase 2 → then hide
  },
];

/** The round to show at `nowMs`, or null once the final round has ended. */
export function bannerRoundAt(nowMs: number): BannerRound | null {
  for (const r of BANNER_ROUNDS) if (nowMs < r.rollAtMs) return r;
  return null;
}

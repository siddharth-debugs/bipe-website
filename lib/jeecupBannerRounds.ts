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
      "Pre-Counselling Registration is open — add BIPE (code 4455) to your choice list before Round 1 choice-filling (25–30 June).",
    hindi:
      "JEECUP Round 1 choice-filling 25–30 जून — choice-filling से पहले अपनी choices में BIPE (code 4455) जोड़ें।",
    rollAtMs: at("2026-07-01T00:00:00+05:30"), // after Round 1 choice-filling
  },
  {
    n: 2,
    eyebrow: "JEECUP 2026 · Round 2",
    headline:
      "Pre-Counselling Registration is open — add BIPE (code 4455) to your choice list before Round 2 choice-filling (7–9 July).",
    hindi:
      "JEECUP Round 2 choice-filling 7–9 जुलाई — choice-filling से पहले अपनी choices में BIPE (code 4455) जोड़ें।",
    rollAtMs: at("2026-07-10T00:00:00+05:30"), // after Round 2 choice-filling
  },
  {
    n: 3,
    eyebrow: "JEECUP 2026 · Round 3 Allotment",
    headline:
      "JEECUP Round 3 allotment is out — report by 25 July if you got a seat. Missed Rounds 1–3, or from another state? Round 4 (Phase 2) opens next for ALL states. Add BIPE (code 4455) to your choice list.",
    hindi:
      "JEECUP Round 3 allotment आ गया — seat मिली तो 25 जुलाई तक report करें। मौका छूट गया या दूसरे राज्य से हैं? Round 4 (Phase 2) सभी राज्यों के लिए खुल रहा है। अपनी choices में BIPE (code 4455) जोड़ें।",
    rollAtMs: at("2026-07-20T00:00:00+05:30"), // Round 3 selection done → focus shifts to Round 4 (owner, 20 Jul)
  },
  {
    n: 4,
    eyebrow: "JEECUP 2026 · Round 4 · Classes begin 1 Aug",
    headline:
      "JEECUP Round 4 (Phase 2) counselling is on — open to ALL states (Bihar, Jharkhand, MP too) and anyone who missed Rounds 1–3. Add BIPE code 4455 to your choices. Classes begin 1 August — talk to admissions today.",
    hindi:
      "JEECUP Round 4 (Phase 2) counselling चल रही है — सभी राज्यों के लिए (Bihar, Jharkhand, MP भी) और जिनका Rounds 1–3 में मौका छूटा उनके लिए भी। BIPE code 4455 अपनी choices में add करें। Classes 1 August से — आज ही admissions से बात करें।",
    // Rolled forward to 4 Aug (owner direction): the session has started
    // and JEECUP moved on to the final round, so Round-4 copy was stale.
    rollAtMs: at("2026-08-04T00:00:00+05:30"), // Round 4 window → roll to Round 5
  },
  {
    n: 5,
    eyebrow: "JEECUP 2026 · Round 5 · Final round",
    headline:
      "JEECUP Round 5 is the FINAL counselling round, open to all states including Bihar. Add BIPE (code 4455) to your choice list. Classes are already under way, so a seat allotted now means some catch-up.",
    hindi:
      "JEECUP Round 5 — आख़िरी counselling round, सभी राज्यों के लिए (Bihar भी)। अपनी choices में BIPE (code 4455) जोड़ें। Classes शुरू हो चुकी हैं, इसलिए कुछ catch-up करना होगा।",
    rollAtMs: at("2026-08-16T00:00:00+05:30"), // end of Phase 2 → then hide
  },
];

// RETIRED for 2026-27 (3 Sep 2026). Every rollAtMs above is in the past, so
// bannerRoundAt() returns null and the banner renders nothing.
//
// The headlines were scrubbed of seat-availability claims on 3 Sep 2026: they
// used to say "reserve your branch at BIPE" and "last seats at BIPE", which the
// owner's 2026-27 closure ruling forbids — and which misdescribed the mechanism
// anyway, since a candidate adds code 4455 to their JEECUP choice list rather
// than reserving anything with the college. They now say that instead, so
// reviving this for a future cycle is safe on that count.
//
// Still to change before any reuse: the eyebrows and dates are 2026-specific,
// and rollAtMs must move forward or the banner stays hidden. Do NOT reintroduce
// any claim about seats being available, few, or held.

/** The round to show at `nowMs`, or null once the final round has ended. */
export function bannerRoundAt(nowMs: number): BannerRound | null {
  for (const r of BANNER_ROUNDS) if (nowMs < r.rollAtMs) return r;
  return null;
}

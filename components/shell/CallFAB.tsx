"use client";

import { useNow } from "@/lib/useNow";
import { DATA } from "@/lib/data";
import { bannerRoundAt, type BannerRound } from "@/lib/jeecupBannerRounds";

/**
 * Floating "Round N help? Call" pill — the voice-channel twin of the
 * WhatsApp FAB, docked lower-LEFT so the two never collide.
 *
 * Owner direction (17 Jul 2026, mid Meta-campaign): ad leads land on the
 * homepage from the Instant Form's thank-you screen, and counselling-window
 * visitors should have a phone affordance one thumb away — a missed call
 * still lands in the admissions call log as a ring-back lead.
 *
 * Round-aware via the same schedule as the homepage banner
 * (lib/jeecupBannerRounds): the label reads "Round 3 help?" today, rolls with
 * the rounds, and the pill unmounts entirely once the main rounds end
 * (26 Jul) — no stale campaign chrome to clean up.
 *
 * Client-mounted only (null on SSR + first paint) so the date check can't
 * cause a hydration mismatch; a FAB popping in a frame late is imperceptible.
 */
export function CallFAB() {
  // null through SSR and hydration, so the pill is absent from the server
  // HTML and the first client paint exactly as before; the live clock
  // arrives immediately after mount. See lib/useNow.ts.
  const now = useNow();
  const round = now === null ? null : bannerRoundAt(now);

  if (!round) return null;

  return (
    <a
      href={`tel:${DATA.contact.phone.replace(/[^\d+]/g, "")}`}
      className="call-fab"
      aria-label={`Round ${round.n} counselling help — call BIPE admissions`}
    >
      📞 Round {round.n} help?
    </a>
  );
}

"use client";

import { useNow } from "@/lib/useNow";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { BANNER_ROUNDS, bannerRoundAt } from "@/lib/jeecupBannerRounds";

/**
 * Homepage JEECUP counselling announcement.
 *
 * Auto-rolls Round 1 → 2 → 3 as each choice-filling window closes, then hides
 * after Round 3 — driven entirely off the live clock, so it flips at the exact
 * IST threshold (see lib/jeecupBannerRounds.ts) with no rebuild and no manual
 * edits.
 *
 * `initialN` is the round number the server computed at render/build time. The
 * client starts from it (so the hydrated markup matches the server HTML), then
 * re-checks the live clock once on mount and rolls if a threshold has since
 * passed. `0` means "hidden" (before/after the campaign).
 */
export function JeecupCounsellingBanner({ initialN }: { initialN: number }) {
  // Server HTML and the hydration pass both use initialN, so the markup
  // matches; once mounted the live clock takes over and rolls the round.
  // See lib/useNow.ts.
  const now = useNow();
  const n = now === null ? initialN : bannerRoundAt(now)?.n ?? 0;

  const round = BANNER_ROUNDS.find((r) => r.n === n);
  if (!round) return null;

  return (
    <aside
      aria-label="JEECUP 2026 counselling announcement"
      className="jeecup-result-bar"
      style={{ background: "var(--ink)", color: "var(--paper)", borderTop: "3px solid var(--accent)", borderBottom: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)" }}
    >
      <div
        className="container"
        style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "16px", flexWrap: "wrap", textAlign: "center" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <span className="row" style={{ alignItems: "center", gap: 8 }}>
            <span className="live-dot" />
            <span className="eyebrow" style={{ color: "var(--accent)", margin: 0, whiteSpace: "nowrap" }}>{round.eyebrow}</span>
          </span>
          <span style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>
            {round.headline}
            <span style={{ display: "block", fontWeight: 400, fontSize: 13, opacity: 0.82, marginTop: 2 }}>
              {round.hindi}
            </span>
          </span>
        </span>
        <span className="row" style={{ gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/jeecup-counselling"
            className="btn btn-sm"
            style={{ background: "color-mix(in oklab, var(--paper) 16%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 30%, transparent)", whiteSpace: "nowrap" }}
          >
            Counselling dates →
          </Link>
          <Link href="/early-registration" className="btn btn-primary btn-sm jeecup-result-cta" style={{ whiteSpace: "nowrap" }}>
            Talk to admissions →
          </Link>
          {/* Direct line for the counselling-anxious (owner request, Jul 2026) —
              label derives the round from the same schedule, so it rolls itself.
              A missed call still lands in the admissions log = ring-back lead. */}
          <a
            href={`tel:${DATA.contact.phone.replace(/[^\d+]/g, "")}`}
            className="btn btn-sm"
            style={{ background: "var(--accent)", color: "var(--ink)", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            📞 Round {round.n} help? Call
          </a>
        </span>
      </div>
    </aside>
  );
}

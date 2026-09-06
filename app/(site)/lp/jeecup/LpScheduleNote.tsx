"use client";

import { useNow } from "@/lib/useNow";
import { DATA } from "@/lib/data";
import { LP_PHASES, phaseIndexAt } from "./lpSchedule";

/**
 * Schedule-aware urgency strip for the /lp/jeecup ad landing page.
 *
 * Paid traffic lands here from ads that reference the live JEECUP counselling
 * calendar — the page must agree with the ad, or the click reads as stale.
 * Phase data + thresholds live in ./lpSchedule.ts (server-safe); this is the
 * same hydration pattern as JeecupCounsellingBanner: the server renders the
 * build-time phase via `initialIndex`, the client re-checks the live clock on
 * mount and rolls at the exact IST threshold. After the main phase it pivots
 * to the later-rounds/spot message rather than hiding — ads keep running into
 * August, so the page must keep making sense.
 */
export default function LpScheduleNote({ initialIndex }: { initialIndex: number }) {
  // Server HTML and the hydration pass both use initialIndex; the live
  // clock rolls the phase immediately after mount. See lib/useNow.ts.
  const now = useNow();
  const i = now === null ? initialIndex : phaseIndexAt(now);

  const p = LP_PHASES[i];

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
        marginTop: 22,
        padding: "14px 16px",
        borderRadius: 14,
        background: "var(--ink)",
        color: "var(--paper)",
        border: "1px solid color-mix(in oklab, var(--accent) 55%, transparent)",
      }}
    >
      <span className="row" style={{ alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span className="live-dot" />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {p.badge}
        </span>
      </span>
      <span style={{ flex: "1 1 30ch", fontSize: 13.5, lineHeight: 1.55 }}>{p.text}</span>
      {/* Urgent-contact row (owner request, Jul 2026): some visitors in a live
          counselling window won't fill a form but WILL tap call/WhatsApp. A
          missed call still lands in the admissions call log = a lead to ring
          back. Labels stay phase-generic so they never go stale. */}
      <span style={{ flexBasis: "100%", display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
        <a
          href={`tel:${DATA.contact.phone.replace(/[^\d+]/g, "")}`}
          className="btn btn-sm"
          style={{ background: "var(--accent)", color: "var(--ink)", fontWeight: 700, whiteSpace: "nowrap" }}
        >
          📞 Urgent? Call admissions
        </a>
        <a
          href={DATA.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm"
          style={{ background: "color-mix(in oklab, var(--paper) 16%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 30%, transparent)", whiteSpace: "nowrap" }}
        >
          WhatsApp karein
        </a>
      </span>
    </div>
  );
}

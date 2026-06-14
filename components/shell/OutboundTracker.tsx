"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/metaEvents";

/**
 * Delegated click tracker for outbound CTAs.
 *
 * Listens once on the document for clicks on any <a href="...">, and
 * fires first-party GA4 events when the href matches a telephone link,
 * WhatsApp link, or mailto link. Covers every current and future
 * occurrence of those CTAs across the site without per-link wiring.
 *
 * ─── Why delegated, not per-link ─────────────────────────────
 *
 * The codebase has 41 tel: links + dozens of wa.me/ + numerous
 * mailto: scattered across ~30 components. A delegated listener
 * picks them all up — including ones added later — with zero
 * call-site changes.
 *
 * ─── Why this is needed even with GA4 Enhanced Measurement ───
 *
 * The 90-day audit (May 2026) confirmed Enhanced Measurement's
 * outbound-click auto-tracker captured 10 wa.me/ taps but ZERO
 * tel: taps across 160 sessions. Mobile Safari often fires the
 * tel: handoff before GA4's interceptor reads the click, so the
 * event is lost. Explicit gtag('event', ...) calls fix the blind
 * spot. (See lib/analytics.ts header for the full rationale.)
 *
 * ─── Event names ─────────────────────────────────────────────
 *
 *   call_click       — tel: tap
 *   whatsapp_click   — wa.me/ tap (or whatsapp: protocol)
 *   mailto_click     — mailto: tap
 *
 * Mark these as conversion events in GA4 → Admin → Events to
 * surface them as key metrics on dashboards.
 *
 * ─── Mounted in app/layout.tsx ───────────────────────────────
 *
 * Renders nothing — pure side-effect component.
 */

const WA_HREF_RE = /^https?:\/\/(?:[a-z0-9-]+\.)?wa\.me\//i;

export default function OutboundTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Walk up to the nearest anchor — clicks often land on a child
      // <span>/<svg>/<img> inside the link, not the <a> itself.
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const linkText = (anchor.textContent || "").trim().slice(0, 80);

      if (href.startsWith("tel:")) {
        track("call_click", {
          phone: href.replace(/^tel:/, ""),
          link_url: href,
          link_text: linkText,
        });
        void trackMetaEvent("Contact", { custom: { channel: "call" } });
        return;
      }

      if (WA_HREF_RE.test(href) || href.startsWith("whatsapp:")) {
        track("whatsapp_click", {
          link_url: href,
          link_text: linkText,
        });
        void trackMetaEvent("Contact", { custom: { channel: "whatsapp" } });
        return;
      }

      if (href.startsWith("mailto:")) {
        track("mailto_click", {
          email: href.replace(/^mailto:/, "").split("?")[0],
          link_url: href,
          link_text: linkText,
        });
        return;
      }
    }

    // `capture: true` so we fire even if some nested handler calls
    // stopPropagation later — outbound tracking should be the last
    // thing to be skipped.
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}

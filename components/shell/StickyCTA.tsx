"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Bottom admissions bar — a persistent banner: headline + subtext + a
 * single accent CTA. The always-on "invite" so an interested visitor never
 * has to scroll-hunt for the CTA; complements the gentle engagement popup.
 * No WhatsApp here — the floating FAB already covers it.
 *
 * No dismiss / minimise (per owner, Jun 2026): it stays put as a permanent
 * invite rather than collapsing to a pill. Context-aware CTA — "Register" →
 * Early Seat Registration on the JEECUP pages, "Apply" → /apply elsewhere.
 * Mobile-only (desktop keeps "Apply" in the top nav); hidden on /apply +
 * /early-registration where the page's own form is the CTA. The WhatsApp
 * FAB sits at bottom:84px to clear it.
 */
export const StickyCTA = () => {
  const pathname = usePathname() ?? "/";

  // Hidden where the page's own form is the CTA.
  if (pathname.startsWith("/apply") || pathname.startsWith("/early-registration")) return null;

  // Always drives to the free Early Seat Registration funnel (per owner);
  // only the title adapts to context.
  const copy = {
    title: pathname.startsWith("/jeecup") ? "JEECUP Round 4 — counselling on" : "Admissions 2026-27 — Round 4",
    sub: "Classes begin 1 Aug · BIPE code 4455",
    href: "/early-registration",
    cta: "Enquire",
  };

  return (
    <div className="cta-bar" role="region" aria-label="Admissions">
      <div className="cta-bar-text">
        <div className="cta-bar-title">{copy.title}</div>
        <div className="cta-bar-sub">{copy.sub}</div>
      </div>
      <Link href={copy.href} className="cta-bar-action">
        {copy.cta}
      </Link>
    </div>
  );
};

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

  const campaign = pathname.startsWith("/jeecup");
  const copy = campaign
    ? {
        title: "JEECUP 2026 seats",
        sub: "Register free · preferred branch + a ₹1,200 scholarship",
        href: "/early-registration",
        cta: "Register",
      }
    : {
        title: "Admissions 2026-27",
        sub: "Open now — apply free in 5 minutes, callback in 24 hrs",
        href: "/apply",
        cta: "Apply",
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

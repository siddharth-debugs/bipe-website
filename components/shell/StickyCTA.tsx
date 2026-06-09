"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Bottom admissions bar — a persistent, dismissible banner: headline +
 * subtext + a single accent CTA. The always-on "invite" so an interested
 * visitor never has to scroll-hunt for the CTA; complements the gentle
 * engagement popup. No WhatsApp here — the floating FAB already covers it,
 * and a second WhatsApp affordance would just be repetition.
 *
 * - Context-aware: the JEECUP campaign pages push "Register free" → the
 *   Early Seat Registration funnel; everywhere else "Apply" → /apply.
 * - Dismiss = MINIMISE, not vanish: ✕ collapses it to a small re-openable
 *   pill (remembered in sessionStorage for the rest of the visit).
 * - Mounted site-wide (non-admin); mobile-only (desktop keeps "Apply" in
 *   the top nav); hidden on /apply + /early-registration where the page's
 *   own form is the CTA. The WhatsApp FAB sits at bottom:84px to clear it.
 */
export const StickyCTA = () => {
  const pathname = usePathname() ?? "/";
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(sessionStorage.getItem("bipe_cta_min") === "1");
    } catch {
      /* storage blocked — default to expanded */
    }
    setReady(true);
  }, []);

  const setMin = (v: boolean) => {
    setCollapsed(v);
    try {
      sessionStorage.setItem("bipe_cta_min", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  // Hidden where the page's own form is the CTA.
  if (pathname.startsWith("/apply") || pathname.startsWith("/early-registration")) return null;
  // Render only after the minimise preference is read, to avoid a flash of
  // the expanded bar for visitors who minimised it earlier this visit.
  if (!ready) return null;

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

  if (collapsed) {
    return (
      <button type="button" className="cta-bar-pill" onClick={() => setMin(false)} aria-label="Show the admissions bar">
        <span aria-hidden="true">↑</span> {copy.cta}
      </button>
    );
  }

  return (
    <div className="cta-bar" role="region" aria-label="Admissions">
      <div className="cta-bar-text">
        <div className="cta-bar-title">{copy.title}</div>
        <div className="cta-bar-sub">{copy.sub}</div>
      </div>
      <Link href={copy.href} className="cta-bar-action">
        {copy.cta}
      </Link>
      <button type="button" className="cta-bar-min" onClick={() => setMin(true)} aria-label="Dismiss the admissions bar">
        ✕
      </button>
    </div>
  );
};

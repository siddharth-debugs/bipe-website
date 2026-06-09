"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
import { DATA } from "@/lib/data";

/**
 * Persistent, collapsible bottom action bar — the always-on "invite" so an
 * interested visitor never has to scroll-hunt for a CTA. Complements the
 * occasional engagement popup (InquiryModal) and the WhatsApp FAB; the FAB
 * sits at bottom:84px on mobile precisely to clear this bar.
 *
 * - Context-aware primary CTA: "Register free" on the JEECUP campaign pages,
 *   "Apply 2026-27" everywhere else.
 * - Minimise (✕) collapses it to a small re-openable pill — it never
 *   vanishes (the whole point: dismiss should hide, not strand the user).
 *   The choice is remembered in sessionStorage for the rest of the visit.
 * - Hidden where the form itself is the CTA (/apply, /early-registration),
 *   on /admin (ConditionalChrome doesn't mount it there), and on desktop
 *   (the top nav already keeps "Apply" permanently visible) — mobile-only
 *   via the .cta-bar media query in globals.css.
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

  // Don't show where the page's own form is the CTA.
  if (pathname.startsWith("/apply") || pathname.startsWith("/early-registration")) return null;
  // Render only after we've read the minimise preference, to avoid a flash
  // of the expanded bar for visitors who minimised it earlier this visit.
  if (!ready) return null;

  const campaign = pathname.startsWith("/jeecup");
  const primary = campaign
    ? { href: "/early-registration", label: "Register free" }
    : { href: "/apply", label: "Apply 2026-27" };

  if (collapsed) {
    return (
      <button
        type="button"
        className="cta-bar-pill"
        onClick={() => setMin(false)}
        aria-label="Show admissions quick-actions"
      >
        <span aria-hidden="true">↑</span> {primary.label}
      </button>
    );
  }

  return (
    <div className="cta-bar" role="region" aria-label="Quick admissions actions">
      <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
        <WhatsAppIcon /> WhatsApp
      </a>
      <Link href={primary.href} className="btn btn-primary btn-sm">
        {primary.label} <ArrowIcon size={14} />
      </Link>
      <button type="button" className="cta-bar-min" onClick={() => setMin(true)} aria-label="Minimise quick-actions">
        ✕
      </button>
    </div>
  );
};

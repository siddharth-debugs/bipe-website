/**
 * First-party GA4 event helper.
 *
 * ─── Why this exists ─────────────────────────────────────────
 *
 * GA4's Enhanced Measurement auto-tracks outbound clicks, but the
 * 90-day audit (May 2026) showed it captured 10 wa.me/ clicks and
 * ZERO tel: clicks across 160 sessions. Implausible — telephone
 * link taps aren't being recorded reliably (likely because mobile
 * Safari fires the tel: handoff before GA4's outbound interceptor
 * gets to read the click). Explicit gtag() events close that gap.
 *
 * ─── How it's used ───────────────────────────────────────────
 *
 *   import { track } from "@/lib/analytics";
 *
 *   track("apply_submit", { branch: data.branch });
 *   track("call_click",   { phone: "919198646464" });
 *
 * Outbound CTA clicks (tel: / wa.me / mailto:) are caught
 * automatically by components/shell/OutboundTracker.tsx — there's
 * no need to wire individual links.
 *
 * Form submissions need an explicit track() call in each
 * component's success path (apply, contact, visit, inquiry).
 *
 * ─── Safety ──────────────────────────────────────────────────
 *
 * - SSR-safe: short-circuits when window is undefined.
 * - GA-absent safe: short-circuits when window.gtag isn't loaded
 *   (local dev without NEXT_PUBLIC_GA_ID set, ad-blockers, etc.).
 * - Never throws — analytics MUST NOT crash the page.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function track(eventName: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  try {
    gtag("event", eventName, params);
  } catch {
    // Analytics must never throw user-visible errors.
  }
}

// Ensure this file is treated as a module (so the `declare global`
// block above merges cleanly with @types/dom typings).
export {};

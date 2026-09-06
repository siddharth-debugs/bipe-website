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
 *   track("call_click",   { phone: "919415202879" });
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
    /** Microsoft Clarity queue/API — present only on the live host
     *  (the beacon injects it for bipe.ac.in / bipevns.org only). */
    clarity?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/**
 * ─── Microsoft Clarity custom signals ────────────────────────────
 *
 * Mirrors our GA4 events into Clarity so session replays + heatmaps
 * can be filtered the same way — e.g. "show recordings where
 * application_submit_success fired", or "filter to programme = Civil
 * Engineering". No-ops when Clarity isn't loaded (localhost / Vercel
 * preview — the beacon only injects on the live bipe.ac.in / bipevns.org hosts) and
 * never throws. Clarity API ref: clarity("set", key, value) for tags,
 * clarity("event", name) for custom events.
 */
function clarityApi(): ((...a: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  const c = window.clarity;
  return typeof c === "function" ? c : null;
}

/** Fire a Clarity custom event — becomes a filter in the portal. */
export function clarityEvent(name: string): void {
  try {
    clarityApi()?.("event", name);
  } catch {
    /* analytics must never throw */
  }
}

/** Set a Clarity custom tag (key → value) on the current session, so
 *  recordings + heatmaps can be filtered by it. */
export function clarityTag(key: string, value: string | string[]): void {
  try {
    clarityApi()?.("set", key, value);
  } catch {
    /* analytics must never throw */
  }
}

/** GA4 event name → friendlier Clarity custom-event name, for the
 *  conversions we actually filter replays by. Unmapped events fire to
 *  Clarity under their GA4 name. */
const CLARITY_EVENT_NAME: Record<string, string> = {
  apply_submit: "application_submit_success",
  enquiry_submit: "enquiry_submit_success",
  visit_submit: "visit_booked",
  contact_submit: "contact_submit_success",
};

export function track(eventName: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;

  // GA4 (unchanged) — short-circuits if gtag isn't loaded.
  const gtag = window.gtag;
  if (typeof gtag === "function") {
    try {
      gtag("event", eventName, params);
    } catch {
      // Analytics must never throw user-visible errors.
    }
  }

  // Mirror into Clarity: every tracked event becomes a Clarity custom
  // event, and if it carries a branch/programme, tag the session too —
  // so you can pull replays of, e.g., people who applied for Computer
  // Science. Both calls are independent no-ops without Clarity.
  clarityEvent(CLARITY_EVENT_NAME[eventName] ?? eventName);
  const programme = params.branch ?? params.programme;
  if (typeof programme === "string" && programme.trim()) {
    clarityTag("programme", programme);
  }
}

// Ensure this file is treated as a module (so the `declare global`
// block above merges cleanly with @types/dom typings).
export {};

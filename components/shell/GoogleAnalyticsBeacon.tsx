"use client";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Google Analytics 4 integration for BIPE.
 *
 * Why a wrapper:
 *
 *   1. app/layout.tsx is a Server Component, and the consent-mode-
 *      default <Script> tag below needs `strategy="beforeInteractive"`
 *      which Next.js routes through a client boundary cleanly when
 *      everything is inside a 'use client' wrapper.
 *
 *   2. Symmetric to AnalyticsBeacon.tsx (Vercel Analytics wrapper).
 *      Keeping both telemetry stacks in components/shell/*Beacon.tsx
 *      makes them easy to find/audit when CWV work needs to defer
 *      or remove either one.
 *
 * Two telemetry stacks · separate concerns:
 *
 *   Vercel Analytics  →  CWV + visitor counts (Real User Monitoring).
 *                        Free, light, ~35 KB deferred chunk.
 *   GA4               →  user behaviour, funnels, source/medium,
 *                        first-party event tracking. The actionable
 *                        layer.
 *
 *   First-party events shipped May 2026 (via lib/analytics.ts +
 *   components/shell/OutboundTracker.tsx):
 *
 *     call_click       — tel: tap (auto, delegated)
 *     whatsapp_click   — wa.me/ tap (auto, delegated)
 *     mailto_click     — mailto: tap (auto, delegated)
 *     apply_submit     — /apply form success
 *     contact_submit   — /contact form success
 *     visit_submit     — /visit form success
 *     enquiry_submit   — inquiry popup + homepage inline form success
 *
 *   Mark these as conversion events in GA4 → Admin → Events to
 *   surface them as key metrics on dashboards.
 *
 *   They coexist intentionally — VA tracks "is the site fast?", GA4
 *   tracks "is the funnel working?". Different questions, both worth
 *   answering.
 *
 * DPDP Act 2023 · consent mode v2 — calibrated default:
 *
 *   India's Digital Personal Data Protection Act (Sep 2023) requires
 *   explicit consent for non-essential cookies. We initialise Google
 *   Consent Mode v2 with a calibrated default that balances DPDP-
 *   awareness against the need for real analytics data:
 *
 *     ad_storage           denied   (no advertising cookies)
 *     ad_user_data         denied   (no user data shared for ads)
 *     ad_personalization   denied   (no ad personalization)
 *     analytics_storage    granted  (analytics cookies + full events)
 *
 *   Why analytics_storage is granted (revised 25 May 2026):
 *
 *     The original setup denied analytics_storage too. That caused
 *     GA4 to send "consent state pings" rather than full pageview
 *     events. Those pings reach Google but only surface as Consent
 *     Mode-modeled totals — and modeled data needs a baseline to
 *     extrapolate from, which a brand-new property doesn't have.
 *     Result: Realtime showed zero users for days/weeks, blocking
 *     validation of the setup.
 *
 *     Granting analytics_storage while denying ad_* gives BIPE the
 *     real-time tracking it needs today, while still blocking the
 *     truly sensitive layer (cross-site ad personalization, audience
 *     sharing with Google Ads). This is the posture most professional
 *     Indian institutional sites operate in — analytics work, ad-tech
 *     doesn't.
 *
 *   What's now tracked (analytics granted):
 *     - Full pageview events (real, not modeled)
 *     - Session continuity (user_id cookies, _ga cookie)
 *     - New vs returning user split
 *     - Cross-session journeys + retention
 *     - Source / medium / referrer
 *     - All enhanced-measurement events (scrolls, outbound clicks,
 *       file downloads, site search, video engagement)
 *
 *   What's still blocked (ad_* denied):
 *     - Google Ads remarketing audiences
 *     - Ad personalization / user data sharing with Google Ads
 *     - Audience segment exports for Google Ads campaigns
 *
 *   Future hardening: once BIPE has a consent banner that lets users
 *   actively opt in/out, we can default analytics_storage back to
 *   'denied' and grant on acceptance via gtag('consent','update',...).
 *   That's the full-DPDP posture; it requires UI work and shouldn't
 *   block initial analytics validation.
 *
 * Performance / INP:
 *
 *   - The consent-mode script is tiny (<1 KB inline) and runs
 *     synchronously before paint. No INP impact.
 *   - GoogleAnalytics from @next/third-parties uses strategy=
 *     "afterInteractive" internally — gtag.js loads AFTER React
 *     hydration completes, so it doesn't compete with the same
 *     main-thread window we just spent commit 8632da2 defending.
 *
 * Env var:
 *
 *   NEXT_PUBLIC_GA_ID  e.g. G-BRMGGQMXP8
 *   Set in Vercel → Settings → Environment Variables. Component
 *   renders nothing if the env var is missing — safe for local dev
 *   and preview deployments without polluting analytics.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalyticsBeacon() {
  if (!GA_ID) return null;

  return (
    <>
      {/*
        Consent Mode v2 — analytics granted, ad-tech denied (calibrated
        default). Initialised BEFORE gtag.js so the GA4 loader reads
        the consent state correctly on first event dispatch.
      */}
      <Script id="ga4-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted',
            wait_for_update: 500,
          });
        `}
      </Script>
      <GoogleAnalytics gaId={GA_ID} />
    </>
  );
}

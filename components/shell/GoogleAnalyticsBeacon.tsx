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
 *                        event tracking (apply_submit, mailto_click,
 *                        whatsapp_click). The actionable layer.
 *
 *   They coexist intentionally — VA tracks "is the site fast?", GA4
 *   tracks "is the funnel working?". Different questions, both worth
 *   answering.
 *
 * DPDP Act 2023 · consent mode v2:
 *
 *   India's Digital Personal Data Protection Act (Sep 2023) requires
 *   explicit consent before storing non-essential cookies — analytics
 *   cookies qualify. We initialise Google Consent Mode v2 with
 *   ad_storage / analytics_storage = 'denied' BEFORE GA4 loads. This
 *   means GA4 fires cookieless ping beacons by default — we still get
 *   page views, source/medium, top events; we just don't tie them to
 *   user_id cookies until consent is granted.
 *
 *   What's preserved in cookieless mode:
 *     - Page views, session counts (modelled, not 1:1)
 *     - Source / medium / referrer
 *     - Top events (form_submit, mailto_click, etc.)
 *     - Geographic data (city / region, no precise GPS)
 *     - Device category / browser
 *
 *   What's degraded:
 *     - New vs returning user split (everyone reads as new)
 *     - Cross-session user journeys
 *     - Audience-segment data for ad retargeting
 *
 *   For BIPE's first 30-90 days of GA4 (admissions tracking, content
 *   effectiveness), the cookieless mode is sufficient. A consent
 *   banner that calls gtag('consent','update',{...}) on accept can
 *   be added as a P2 follow-up if richer data becomes needed.
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
        Consent Mode v2 — default to denied for all storage categories
        BEFORE gtag.js loads. Once gtag.js executes, it reads dataLayer
        and respects this default. The wait_for_update window lets the
        site upgrade consent (via a future banner) within 500ms before
        any cookieless ping is sent — minimises double-counting.
      */}
      <Script id="ga4-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
          });
        `}
      </Script>
      <GoogleAnalytics gaId={GA_ID} />
    </>
  );
}

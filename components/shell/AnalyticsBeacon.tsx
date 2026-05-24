"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper that defers Vercel Analytics until after hydration.
 *
 * Why this exists:
 *
 *   app/layout.tsx is a Server Component, and Next.js explicitly forbids
 *   `dynamic({ ssr: false })` inside Server Components. Moving the
 *   deferred import into a client-component wrapper sidesteps that
 *   restriction while keeping the same behaviour.
 *
 * Why we defer Analytics:
 *
 *   GSC's INP report (May 2026) flagged 303ms on mobile. Vercel
 *   Analytics is a 35 KB JS chunk that runs on every page load
 *   without contributing user-visible content. Deferring its load
 *   until AFTER React hydration:
 *
 *     - Reduces main-thread contention during initial hydration
 *     - Buys ~30-50ms of INP headroom
 *     - Loses zero telemetry — Analytics auto-fires the pageview
 *       beacon as soon as it mounts (typically 200-500ms after
 *       hydration on cellular networks)
 *
 *   The `ssr: false` flag ensures:
 *     - No <script src="..."> for the Analytics bundle is injected
 *       during SSR
 *     - The chunk only downloads after the page becomes interactive
 *     - The pageview beacon fires from a quiet main thread
 */
const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((m) => m.Analytics),
  { ssr: false },
);

export default function AnalyticsBeacon() {
  return <Analytics />;
}

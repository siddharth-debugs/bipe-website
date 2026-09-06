"use client";

import { usePathname } from "next/navigation";

import { isAdminPath } from "@/lib/adminPath";

import AnalyticsBeacon from "./AnalyticsBeacon";
import GoogleAnalyticsBeacon from "./GoogleAnalyticsBeacon";
import MicrosoftClarityBeacon from "./MicrosoftClarityBeacon";
import MetaPixelBeacon from "./MetaPixelBeacon";
import FbclidCapture from "./FbclidCapture";
import OutboundTracker from "./OutboundTracker";
import ClaritySessionTags from "./ClaritySessionTags";

/**
 * Every visitor-analytics tracker on the site, mounted in one place and
 * switched off on /admin.
 *
 * Until now these six sat loose at the bottom of app/layout.tsx and ran
 * everywhere, the dashboard included. Only MicrosoftClarityBeacon checked
 * where it was (its own `!pathname.startsWith("/admin")` guard, added when
 * admin sessions turned out to be ~10% of all Clarity recordings) — the
 * other five did not, so signing in to the dashboard loaded gtag.js and
 * fbevents.js and reported a Meta PageView for every screen the operator
 * opened, /admin/dashboard/inbox included.
 *
 * Two reasons that is worth one gate rather than six guards:
 *
 *   Speed.    gtag.js, fbevents.js and the Vercel Analytics chunk are
 *             third-party downloads on the critical path of a dashboard
 *             that is already slow to open (Sep 2026 performance audit,
 *             finding F5). Not rendering the beacons means the browser
 *             never requests them.
 *
 *   Hygiene.  Admin URLs describe admissions leads, not marketing pages.
 *             Reporting them to Meta and Google is telemetry nobody asked
 *             for and nobody reads.
 *
 * Clarity keeps its own internal guard as well. That is deliberate
 * belt-and-braces, not an oversight: it also gates on the production
 * hostname, which this component does not know about.
 *
 * Anything added here inherits the /admin exclusion for free — which is
 * the point. A new tracker dropped into app/layout.tsx would not.
 */
export function PublicTelemetry() {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return null;

  return (
    <>
      <ClaritySessionTags />
      <AnalyticsBeacon />
      <GoogleAnalyticsBeacon />
      <MicrosoftClarityBeacon />
      <MetaPixelBeacon />
      <FbclidCapture />
      <OutboundTracker />
    </>
  );
}

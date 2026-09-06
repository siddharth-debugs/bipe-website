"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Meta (Facebook) Pixel integration for BIPE.
 *
 * Third telemetry stack, sibling to GoogleAnalyticsBeacon.tsx (GA4)
 * and AnalyticsBeacon.tsx (Vercel Analytics). Kept in
 * components/shell/*Beacon.tsx with the others so all client-side
 * trackers are easy to find/audit when CWV work needs to defer or
 * remove any of them.
 *
 *   Pixel ID  →  1035125302305497 (default below). Powers Meta Ads
 *                audience building + conversion attribution for the
 *                admissions campaigns. Override per-environment with
 *                NEXT_PUBLIC_META_PIXEL_ID if a different pixel is
 *                ever provisioned.
 *
 * Why a wrapper / "use client":
 *
 *   app/layout.tsx is a Server Component. The fbevents.js loader has
 *   to run in the browser, and the SPA route-change PageView tracking
 *   below needs usePathname() — both require a client boundary.
 *
 * Performance / INP:
 *
 *   strategy="afterInteractive" — fbevents.js loads AFTER React
 *   hydration, same as GA4's gtag.js. It doesn't compete for the
 *   main thread during the initial interaction window the May 2026
 *   CWV/INP work fought to protect.
 *
 * SPA PageView tracking:
 *
 *   The base snippet fires one PageView on the initial document load.
 *   App Router navigations are client-side (no full reload), so the
 *   base snippet never sees them. The usePathname() effect fires a
 *   PageView on each subsequent route change, skipping the very first
 *   run so the initial load isn't double-counted. This mirrors what
 *   @next/third-parties' <GoogleAnalytics> does automatically for GA4.
 *
 * DPDP Act 2023 / consent:
 *
 *   Matches the current site-wide posture (see GoogleAnalyticsBeacon
 *   for the full rationale): analytics-class tracking runs by default,
 *   no consent banner yet. When BIPE ships a consent banner, gate this
 *   pixel behind acceptance (fbq('consent','revoke') by default, then
 *   fbq('consent','grant') on opt-in) for the full-DPDP posture.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1035125302305497";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixelBeacon() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!PIXEL_ID) return;
    // The base snippet already fired PageView on first load — skip the
    // initial effect run so we don't count it twice. Every run after
    // that is an App Router client navigation worth its own PageView.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      {/* <noscript> fallback — JS-disabled visitors still register a
          PageView via the 1x1 tracking GIF. */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element --
            next/image is unusable inside <noscript>: it needs the React
            runtime this fallback exists to work without. A raw 1x1 GIF is
            the only thing that can fire here. */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

"use client";

import Script from "next/script";

/**
 * Microsoft Clarity — heatmaps + masked session recordings.
 *
 * Why the project ID is hardcoded (not an env var):
 *   A Clarity project ID is NOT a secret — it ships in the client
 *   tracking script to every visitor regardless. Using NEXT_PUBLIC_*
 *   for it caused the earlier "Almost there / not detected" problem:
 *   NEXT_PUBLIC_ vars are inlined at BUILD time, so a var added after a
 *   build doesn't appear until a fresh rebuild. Hardcoding removes that
 *   failure mode — the tag loads on the very next deploy, every time.
 *
 * Host + path guard:
 *   The tag fires only on the live bipevns.org domain (so localhost dev
 *   and Vercel preview deployments don't pollute the recordings) AND not
 *   on /admin/* — the admin team's dashboard sessions were ~10% of all
 *   recordings (Clarity dashboard, Jun 2026), skewing every metric and
 *   needlessly capturing internal lead data. The check runs on the
 *   initial (lazyOnload) page load, which catches the real case: the
 *   admin team logs in at /admin and stays there for the whole session.
 *
 * PRIVACY (DPDP Act 2023 + minors):
 *   BIPE applicants include Class-10 minors. Set the Clarity project's
 *   Masking mode to "Mask All" (dashboard -> Settings -> Masking) so
 *   every on-screen text node — names, phone numbers, emails on the
 *   apply/enquiry forms — is masked; only anonymous interaction (clicks,
 *   scrolls, navigation) is recorded. /privacy discloses this.
 *
 * Loads with strategy="lazyOnload" so Clarity's session recorder — which
 * instruments the whole DOM and attaches event listeners across the page
 * — fires only once the page is idle (after the load event), keeping it
 * out of the early-interaction window that INP measures. It was previously
 * afterInteractive, which runs right after hydration and inflated INP /
 * main-thread time (PSI mobile, Jun 2026). Recording starts a moment
 * later, which is immaterial for heatmaps/replays.
 */
const CLARITY_ID = "x1cg48mhiw";

export default function MicrosoftClarityBeacon() {
  return (
    <Script id="ms-clarity" strategy="lazyOnload">
      {`
        if (typeof location !== "undefined" && location.hostname.endsWith("bipevns.org") && !location.pathname.startsWith("/admin")) {
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        }
      `}
    </Script>
  );
}

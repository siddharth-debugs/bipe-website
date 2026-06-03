"use client";

import Script from "next/script";

/**
 * Microsoft Clarity — behavioural analytics for BIPE.
 *
 * The qualitative layer that GA4 / GSC / Semrush don't give: heatmaps,
 * session recordings, and frustration signals (rage clicks, dead clicks,
 * quick-backs). Free and unlimited (no session cap). Answers WHY/HOW a
 * visitor behaves on a page, where GA4 answers WHAT happened.
 *
 * Why it earns its place here: the BIPE audience is mobile-heavy
 * Class-10/12 applicants. Several UX bugs (the 1366px nav dead-zone,
 * the stuck enquiry modal, the /fees table overlap) were caught
 * reactively from screenshots — Clarity surfaces that class of problem
 * from real sessions (rage clicks where the menu should be, drop-offs
 * on the apply form) before anyone stumbles on it.
 *
 * ─── Privacy posture (DPDP Act 2023 + children's data) ──────────────
 *
 * BIPE's applicants include MINORS (Class 10 ≈ 14-16). India's DPDP Act
 * has strict children's-data provisions, so this is wired conservatively:
 *
 *   1. MASKING — set the Clarity project's Masking mode to **"Mask All"**
 *      in the Clarity dashboard (Settings → Masking). That masks every
 *      text node in recordings — names, phone numbers, emails on the
 *      apply/enquiry forms are never captured, only layout + interaction.
 *      As defence-in-depth, sensitive fields can also carry the
 *      `data-clarity-mask="true"` attribute, but "Mask All" covers it.
 *
 *   2. CONSENT POSTURE — mirrors GoogleAnalyticsBeacon's calibrated
 *      default: analytics is treated as granted (no click-banner yet),
 *      ad-tech is not used. A proper opt-in consent banner that gates
 *      BOTH GA4 and Clarity is the full-DPDP step and is deliberately a
 *      separate task (see GoogleAnalyticsBeacon "Future hardening").
 *      Until then Clarity runs with Mask-All + the privacy-policy
 *      disclosure on /privacy.
 *
 *   3. DISCLOSURE — /privacy names session recording + heatmaps and
 *      Microsoft as the processor.
 *
 * ─── Env var ────────────────────────────────────────────────────────
 *
 *   NEXT_PUBLIC_CLARITY_ID   the Clarity project ID (e.g. "abcd1234ef")
 *   Find it: clarity.microsoft.com → your project → Settings → Overview.
 *   Set in Vercel → Settings → Environment Variables. Renders nothing if
 *   absent — safe for local dev / preview without polluting recordings.
 *
 * ─── Performance ────────────────────────────────────────────────────
 *
 *   Loaded with strategy="afterInteractive" (like gtag.js) so the
 *   ~30 KB tag fetches AFTER hydration and never competes with the
 *   main-thread budget we defended in the CWV work.
 */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function MicrosoftClarityBeacon() {
  if (!CLARITY_ID) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}

"use client";

import { useEffect } from "react";

/**
 * fbclid → _fbc capture — ad-click attribution that survives ad-blockers.
 *
 * When someone clicks a Meta ad, the landing URL carries `?fbclid=…`. Meta's
 * fbevents.js normally reads it and writes the `_fbc` cookie — but a large
 * share of our mobile audience runs ad-blockers / privacy browsers that block
 * fbevents.js outright. For those users the browser Pixel never fires, and
 * without `_fbc` our server-side Lead (Conversions API) reaches Meta with no
 * click id → poor Event Match Quality → weaker attribution and a higher
 * cost-per-lead. (This is the exact "send Click ID (fbc)" tip Events Manager
 * surfaces.)
 *
 * This runs independently of fbevents.js: it reads `fbclid` straight from the
 * URL and writes a first-party `_fbc` cookie in Meta's exact format
 * (`fb.<subdomainIndex>.<creationMs>.<fbclid>`). lib/metaEvents.ts already
 * reads that cookie and forwards it through /api/meta-capi, so the server Lead
 * now carries the click id even when the Pixel was blocked.
 *
 * It adds no new page-level tracking — it only enriches conversions the visitor
 * initiates (a form submit → Lead) with an id Meta itself placed in the click
 * URL. Writes only when an `fbclid` is present (i.e. this was an ad click);
 * organic visits are untouched. A fresh `fbclid` refreshes the cookie, matching
 * the Pixel's own behaviour.
 */
export default function FbclidCapture() {
  useEffect(() => {
    try {
      const fbclid = new URLSearchParams(window.location.search).get("fbclid");
      if (!fbclid) return;
      const value = `fb.1.${Date.now()}.${fbclid}`;
      const maxAge = 90 * 24 * 60 * 60; // 90 days — Meta's click attribution window
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `_fbc=${value}; max-age=${maxAge}; path=/; SameSite=Lax${secure}`;
    } catch {
      /* non-fatal — the Pixel still sets _fbc itself when it isn't blocked */
    }
  }, []);

  return null;
}

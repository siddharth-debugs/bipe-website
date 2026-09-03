import type { MetadataRoute } from "next";

/**
 * Web App Manifest — PWA discoverability + "Add to Home Screen" support
 * on mobile. Next.js 14+ serves this from /manifest.webmanifest
 * automatically when this file exports the default function.
 *
 * Why this exists:
 *
 *   BITE comparison audit (May 2026) flagged that BITE has a
 *   manifest.webmanifest + apple-icon.png + icon.png, and BIPE has
 *   only a single bipe-logo.svg. The PWA-readiness gap shows up in
 *   Lighthouse PWA scores, in "Add to home screen" mobile prompts,
 *   and in some institutional-trust signals (browsers and OS-level
 *   integrations treat manifested sites as more credible).
 *
 * Icons referenced below are generated dynamically by:
 *   app/icon.tsx          — 32x32 favicon
 *   app/apple-icon.tsx    — 180x180 apple touch icon
 *
 * Next.js's MetadataRoute.Manifest type-checks the shape against
 * the W3C Manifest spec. theme_color matches the existing viewport
 * themeColor (#283e7a — the brand navy).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BIPE Varanasi — Banaras Institute of Polytechnic & Engineering",
    short_name: "BIPE",
    // 3 Sep 2026 — was "across 5 branches incl. Dairy". The install prompt
    // is the shortest admission pitch on the site and Dairy stopped
    // admitting from 2026-27, so the branch count here tracks what an
    // applicant can actually choose (4), not what the institute runs (5).
    description:
      "AICTE-approved polytechnic college in Varanasi. BTEUP-affiliated diploma engineering — admissions open in 4 branches for 2026-27. JEECUP code 4455. AFRC ₹30,150/year.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#283e7a",
    lang: "en-IN",
    categories: ["education", "institute"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

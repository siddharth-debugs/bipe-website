import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * HSTS already comes from Vercel by default. We add the four headers
 * Vercel does NOT set automatically:
 *
 *   X-Content-Type-Options    nosniff
 *   X-Frame-Options           SAMEORIGIN (and frame-ancestors via CSP later)
 *   Referrer-Policy           strict-origin-when-cross-origin
 *   Permissions-Policy        minimal — block camera/mic/geolocation/payment
 *
 * Content-Security-Policy is deliberately omitted for now: a strict CSP
 * needs to allow GTM / GA4 / Hotjar / Clarity dynamically based on what
 * the admin has enabled, plus inline JSON-LD scripts. We'll add it in a
 * second pass with a `style-src` + `script-src` allow-list driven by the
 * SiteSEO analytics fields.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // DRF endpoints end in `/`. Don't auto-redirect them.
  skipTrailingSlashRedirect: true,

  // Tree-shaking hints. Phase 1.5 audit P2 (May 2026) caught a 73 KB
  // unused-JS chunk (Lighthouse's "Reduce unused JavaScript") that
  // contained Zod + react-hook-form + Radix Select / Checkbox — form
  // libraries loaded on every page even though only /apply, /contact
  // and /visit have forms.
  //
  // `optimizePackageImports` tells Next/Turbopack to treat these as
  // route-specific deps for tree-shaking. Combined with dynamic()
  // imports of the form components in their pages, this should keep
  // these libs out of the global shared chunk.
  //
  // `lucide-react` is in the same list as a defensive hint — its
  // per-icon imports are tree-shake-friendly already but the
  // optimizer ensures Webpack chunks them per-route too.
  experimental: {
    optimizePackageImports: [
      "zod",
      "react-hook-form",
      "@hookform/resolvers",
      "@radix-ui/react-select",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-toast",
      "lucide-react",
    ],
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Recruiter wordmarks for the home-page marquee — Wikipedia
      // commons / en thumbnails. We recolour them to grey via filter
      // so they don't pop the brand palette.
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Cloudinary CDN for the campus lab photo gallery (synced from
      // Drive via scripts/sync-labs.mjs).
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // NOTE: leave images.formats at the Next.js default (WebP only).
    // Adding AVIF doubles the per-image transformation count and blew
    // through the Vercel Image Optimization monthly quota, returning
    // HTTP 402 from /_next/image and breaking the hero. Re-enable
    // AVIF only after upgrading the Vercel plan, or move heavy images
    // (hero, gallery) onto Cloudinary where transformations are free
    // under our current usage.
    //
    // Cap deviceSizes at 1920 (drop the default 2048 and 3840 entries).
    // Reasons: (1) audit §3 flagged srcset offering w=3840 for the
    // logo preload — at most 1920 is reasonable for our hero, larger
    // variants only matter on 4K/5K displays which are rare for the
    // applicant audience. (2) Halves the per-image transformations
    // Vercel runs at the upper end, which directly helps the same
    // quota we already burned through once.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  // ─── Zombie URL redirects ─────────────────────────────────────────
  //
  // Semrush domain_organic_unique (May 2026 snapshot) showed four
  // URLs from a previous version of the site still ranking in Google's
  // top 100 despite all returning HTTP 404 on production. They were
  // bleeding brand-search traffic (people clicking the result, hitting
  // a 404, bouncing) and holding accumulated authority on dead
  // endpoints instead of passing it to the live equivalents.
  //
  // Each entry is a permanent 301 → tells Google to drop the old URL
  // from its index and re-attribute the authority to the destination.
  // Typical SERP refresh window: 2-4 weeks.
  //
  //   /thank-u             — old form thank-you page. Was ranking #56
  //                          for the brand query. No semantic
  //                          equivalent on the new site → redirect to
  //                          the homepage to keep the residual traffic.
  //
  //   /bipe-media          — old media/press section. Ranking #22 for
  //                          the brand query. Current site has /events
  //                          which is the closest semantic match (also
  //                          surfaces press coverage via the PressMentions
  //                          component on /about).
  //
  //   /polytechnic-courses — old courses-landing URL. Ranking #37 for
  //                          "banaras institute of technology". The
  //                          current /courses page is the direct
  //                          replacement.
  //
  //   /faculties           — old faculty-list URL. Was ranking #40 for
  //                          a faculty member's name ("arpit kumar
  //                          kashyap"), which the current /faculty
  //                          page covers.
  //
  // No wildcards used — only the four URLs we have evidence are
  // indexed. Speculative redirects (e.g. /placement → /placements)
  // would be guess-work without Semrush corroboration.
  async redirects() {
    return [
      { source: "/thank-u",             destination: "/",        permanent: true },
      { source: "/bipe-media",          destination: "/events",  permanent: true },
      { source: "/polytechnic-courses", destination: "/courses", permanent: true },
      { source: "/faculties",           destination: "/faculty", permanent: true },
    ];
  },

  // Note: the /api/admin/* proxy lives in app/api/admin/[...path]/route.ts
  // (route handler) instead of a `rewrites()` entry. Wildcard rewrites
  // were stripping trailing slashes off the path before forwarding,
  // which made DRF endpoints respond with 301s. The route handler
  // preserves the URL exactly as the dashboard sends it.
};

export default nextConfig;

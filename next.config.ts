import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * Phase 2 SEO audit (May 2026) flagged BIPE as having weaker security
 * headers than BITE — specifically missing CSP, missing HSTS preload,
 * missing includeSubDomains. This commit closes those gaps.
 *
 *   Strict-Transport-Security    Override Vercel's default to add
 *                                 includeSubDomains + preload directives.
 *                                 Eligible for hstspreload.org submission
 *                                 after deploy.
 *
 *   X-Content-Type-Options       nosniff
 *   X-Frame-Options              SAMEORIGIN
 *   Referrer-Policy              strict-origin-when-cross-origin
 *   Permissions-Policy           Block camera/mic/geolocation/payment/cohort
 *   Content-Security-Policy      Moderate allow-list — see CSP below for
 *                                 rationale + 'unsafe-inline' compromise.
 */

// Build a single-line CSP from a multi-line directive map. Keeps the
// source readable; output remains a strict-format header value.
const CSP_DIRECTIVES: Record<string, string[]> = {
  // Default: only same-origin. Specific resource types override below.
  "default-src": ["'self'"],

  // script-src: 'unsafe-inline' is the load-bearing compromise.
  // Next.js's SSR pipeline inlines JSON-LD <script type="application/
  // ld+json"> blocks (every schema commit in this session produces
  // one). Removing 'unsafe-inline' would break all rich-result
  // eligibility. The right long-term fix is per-render nonces, but
  // Next.js's static export pipeline (which we use heavily) doesn't
  // play well with nonces yet. Revisit when Next 17 lands the nonce
  // helpers on Metadata API.
  //
  // 'unsafe-eval' is required by Vercel's analytics + speed-insights
  // bundles. Already in BITE's CSP.
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://va.vercel-scripts.com",
    "https://*.vercel-insights.com",
    // GA4 — gtag.js loader. Required for the GoogleAnalyticsBeacon
    // component (Consent Mode v2 + GA4 measurement) added 25 May 2026.
    "https://www.googletagmanager.com",
    // Microsoft Clarity — tag loader (www.clarity.ms/tag/<id>) and the
    // sub-resources it pulls. Added with the Clarity beacon (Jun 2026);
    // without these the CSP silently blocks Clarity from loading.
    "https://www.clarity.ms",
    "https://*.clarity.ms",
  ],

  // style-src: 'unsafe-inline' required for Next.js's inline-critical
  // CSS pattern (the chunks Next.js auto-inlines in <head> at SSR).
  "style-src": ["'self'", "'unsafe-inline'"],

  // img-src: list every image origin in use across the site.
  // Mirrored from next.config.ts's images.remotePatterns + the
  // self-hosted /public/ assets. data: + blob: needed for SVG inline
  // and image preview generation.
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://res.cloudinary.com",
    "https://images.unsplash.com",
    "https://upload.wikimedia.org",
    // GA4 pixel beacons (transparent 1x1 GIFs for events that fall
    // back from sendBeacon to img request).
    "https://www.google-analytics.com",
    // Microsoft Clarity image beacons.
    "https://*.clarity.ms",
  ],

  // font-src: data: needed because some icon fonts inline as data URIs.
  "font-src": ["'self'", "data:"],

  // connect-src: outgoing fetch/XHR destinations. Vercel analytics
  // beacons + Cloudinary (for the admin uploader).
  "connect-src": [
    "'self'",
    "https://va.vercel-scripts.com",
    "https://*.vercel-insights.com",
    "https://api.cloudinary.com",
    "https://res.cloudinary.com",
    // GA4 event ingest endpoints. /collect is the primary beacon
    // endpoint; the analytics.google.com host is used for some
    // server-side / proxied configurations and consent-mode signals.
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://*.analytics.google.com",
    "https://*.google-analytics.com",
    // Microsoft Clarity — session/recording data ingest (c.clarity.ms
    // etc.) + the Bing collector Clarity uses for some signals.
    "https://*.clarity.ms",
    "https://c.bing.com",
  ],

  // frame-ancestors: forbid being iframed by anyone but self.
  // Equivalent to X-Frame-Options: SAMEORIGIN but in CSP form,
  // which modern browsers prefer.
  "frame-ancestors": ["'self'"],

  // base-uri / form-action: prevent base-tag and form-target injection.
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

const CSP_HEADER = Object.entries(CSP_DIRECTIVES)
  .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
  .join("; ");

const SECURITY_HEADERS = [
  // HSTS — override Vercel default to include preload + subdomain
  // coverage. After deploy: submit to https://hstspreload.org/ to be
  // added to the browser-built-in preload list (gives users HTTPS
  // enforcement on the very first connection, before any HTTP
  // round-trip).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: CSP_HEADER },
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
      // ─── Semrush May 2026 snapshot (4 URLs) ─────────────────────
      { source: "/thank-u",             destination: "/",        permanent: true },
      { source: "/bipe-media",          destination: "/events",  permanent: true },
      { source: "/polytechnic-courses", destination: "/courses", permanent: true },
      { source: "/faculties",           destination: "/faculty", permanent: true },

      // ─── GSC "Not found (404)" report 2026-05-22 (9 new URLs) ───
      //
      // Same playbook as the Semrush batch — every URL below has a
      // confirmed live destination on the current site. Each entry
      // tells Google to drop the dead URL from its index and re-
      // attribute the accumulated authority to the live equivalent.
      // Typical SERP refresh window: 2-4 weeks.
      //
      //   /facilities               — old "facilities/labs" landing.
      //                               /campus/phoolpur is the direct
      //                               replacement (lab gallery + photos).
      //
      //   /year                     — opaque legacy URL. No semantic
      //                               equivalent. Send to / to recover
      //                               residual traffic to the brand
      //                               homepage rather than 404.
      //
      //   /static/img/Prospectus-BIPE.pdf
      //                             — old PDF asset. The documents hub
      //                               at /documents is the current
      //                               source-of-truth for downloadable
      //                               docs (prospectus, mandatory
      //                               disclosure, etc.).
      //
      //   /affiliation-accrediation — typo "accrediation" is the
      //                               giveaway this is from the old
      //                               site. Direct rename to
      //                               /about/affiliations.
      //
      //   /alumnis                  — pluralization typo. /alumni is
      //                               the live canonical.
      //
      //   /bipe-history             — old standalone history page.
      //                               History content is now under
      //                               /about (founding, journey, trust).
      //
      //   /bipe-events              — old "bipe-events" URL. /events
      //                               is the live equivalent (now
      //                               grouped by category — Academic,
      //                               Sports, Cultural, Placement).
      //
      //   /save-index               — cryptic legacy CMS path. Most
      //                               likely a leftover from the old
      //                               site's index/menu structure.
      //                               Send to / to recover any residual
      //                               brand traffic.
      //
      //   /save-career              — old career-landing page. The
      //                               career narrative now lives at
      //                               /placements (placement record +
      //                               named alumni + recruiter list).
      { source: "/facilities",                    destination: "/campus/phoolpur",    permanent: true },
      { source: "/year",                          destination: "/",                   permanent: true },
      { source: "/static/img/Prospectus-BIPE.pdf", destination: "/documents",          permanent: true },
      { source: "/affiliation-accrediation",      destination: "/about/affiliations", permanent: true },
      { source: "/alumnis",                       destination: "/alumni",             permanent: true },
      { source: "/bipe-history",                  destination: "/about",              permanent: true },
      { source: "/bipe-events",                   destination: "/events",             permanent: true },
      { source: "/save-index",                    destination: "/",                   permanent: true },
      { source: "/save-career",                   destination: "/placements",         permanent: true },
      // /career — surfaced by GSC validation 5/30/26 (1 of 1 failed in
      // "Not found (404)" batch). External backlinks still point here
      // from the pre-2024 Wix site. Same destination as /save-career
      // since the career narrative now lives on /placements.
      { source: "/career",                        destination: "/placements",         permanent: true },

      // ─── GSC "Crawled - currently not indexed" + "Blocked" follow-up 2026-05-22 ─
      //
      //   /save-admission                       — third "save-*" legacy URL
      //                                           in the same pattern as
      //                                           /save-index, /save-career.
      //                                           Old CMS admission-landing
      //                                           page. /admission is the
      //                                           live equivalent.
      //
      //   /static/img/Mandatory-DIsclosure_AICTE.pdf
      //                                         — was disallowed in robots.txt
      //                                           (now removed in app/robots.ts).
      //                                           The HTML equivalent at
      //                                           /mandatory-disclosure is the
      //                                           live AICTE Annexure-18 page.
      //                                           Redirect catches anyone
      //                                           hitting the old PDF URL.
      { source: "/save-admission",                                destination: "/admission",            permanent: true },
      { source: "/static/img/Mandatory-DIsclosure_AICTE.pdf",     destination: "/mandatory-disclosure", permanent: true },

      // ─── GSC Performance report 2026-05-24 (zombie URL with CTR) ─
      //
      //   /contact-us  — surfaced in GSC at 257 impressions, 0.78% CTR
      //                  over the 28-day window. URL is NOT in the current
      //                  sitemap (the live equivalent is /contact). Sending
      //                  a 301 collapses the duplicate listing and re-
      //                  attributes the residual brand traffic to the
      //                  canonical /contact page.
      { source: "/contact-us",                                    destination: "/contact",              permanent: true },
    ];
  },

  // Note: the /api/admin/* proxy lives in app/api/admin/[...path]/route.ts
  // (route handler) instead of a `rewrites()` entry. Wildcard rewrites
  // were stripping trailing slashes off the path before forwarding,
  // which made DRF endpoints respond with 301s. The route handler
  // preserves the URL exactly as the dashboard sends it.
};

export default nextConfig;

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

  // Note: the /api/admin/* proxy lives in app/api/admin/[...path]/route.ts
  // (route handler) instead of a `rewrites()` entry. Wildcard rewrites
  // were stripping trailing slashes off the path before forwarding,
  // which made DRF endpoints respond with 301s. The route handler
  // preserves the URL exactly as the dashboard sends it.
};

export default nextConfig;

import type { NextConfig } from "next";

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
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Note: the /api/admin/* proxy lives in app/api/admin/[...path]/route.ts
  // (route handler) instead of a `rewrites()` entry. Wildcard rewrites
  // were stripping trailing slashes off the path before forwarding,
  // which made DRF endpoints respond with 301s. The route handler
  // preserves the URL exactly as the dashboard sends it.
};

export default nextConfig;

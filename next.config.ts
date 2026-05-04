import type { NextConfig } from "next";

/**
 * Backend URL used by the admin proxy below. Set on Vercel via
 *   BIPE_BACKEND_URL = http://<ec2-host>/api/v1
 * Locally falls back to the dev Django on 127.0.0.1:8000.
 *
 * Trailing /api/v1 is part of the URL — the rewrite source strips
 * /api/admin and substitutes /api/v1.
 */
const BACKEND_BASE =
  process.env.BIPE_BACKEND_URL?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api/v1";

const nextConfig: NextConfig = {
  // Django URLs end in `/` (DRF default). Don't 308-redirect them — let
  // the rewrite forward the trailing-slash URL straight to the backend.
  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Proxy admin API calls through Vercel so the browser only ever sees
  // the HTTPS Vercel origin. Vercel does the server-to-server fetch to
  // the (HTTP) backend on EC2 — no mixed-content block, no CORS preflight.
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: `${BACKEND_BASE}/:path*`,
      },
    ];
  },
};

export default nextConfig;

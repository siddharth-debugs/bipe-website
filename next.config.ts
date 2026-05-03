import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Required to serve our BIPE logo SVG through next/image.
    // The CSP keeps the SVG sandboxed so an arbitrary uploaded SVG can't
    // execute scripts — safe because we only ship a static asset we control.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

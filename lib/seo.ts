/**
 * Static SEO helper. All metadata is sourced from `lib/routes.ts` — no
 * backend, no CMS. The SEO admin was removed and we configure SEO at
 * build time.
 */

import type { Metadata } from "next";
import { ROUTES, SITE_URL, type RouteKey } from "@/lib/routes";

export async function metadataFor(slug: RouteKey): Promise<Metadata> {
  const r = ROUTES[slug];
  const canonical = `${SITE_URL.replace(/\/$/, "")}${r.path}`;
  const ogImage = {
    url: `${SITE_URL}/og-default.png`,
    width: 1200,
    height: 630,
    alt: r.title,
  };

  return {
    title: r.title,
    description: r.description,
    alternates: {
      canonical: r.path,
      languages: {
        "en-IN": r.path,
        "hi-IN": `${r.path}${r.path.includes("?") ? "&" : "?"}lang=hi`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: r.title,
      description: r.description,
      url: canonical,
      siteName: "BIPE",
      type: "website",
      locale: "en_IN",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: r.title,
      description: r.description,
      images: [ogImage.url],
    },
  };
}

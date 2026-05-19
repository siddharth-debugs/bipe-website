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
    // Emits <meta name="keywords">. Google ignores this for ranking,
    // but Yandex / Baidu / some long-tail engines still parse it. We
    // populate it on /home, /admission, /jeecup (and only those) to
    // surface Hindi-script equivalents of high-volume English queries
    // without cluttering the visible SERP description.
    ...(r.keywords && r.keywords.length ? { keywords: r.keywords } : {}),
    alternates: {
      canonical: r.path,
      // Only en-IN is declared. The site has a client-side EN/हिंदी
      // toggle (lib/lang.tsx) that swaps a handful of nav strings via
      // localStorage, but the SSR HTML — which is what Google crawls —
      // is always English. Declaring hi-IN would be hreflang-lying:
      // the audit's E-E-A-T section flagged it as a real penalty risk.
      // Re-add hi-IN only when a genuine /hi/* SSR path exists.
      languages: { "en-IN": r.path },
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

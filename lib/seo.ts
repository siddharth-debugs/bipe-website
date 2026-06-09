/**
 * Static SEO helper. All metadata is sourced from `lib/routes.ts` — no
 * backend, no CMS. The SEO admin was removed and we configure SEO at
 * build time.
 */

import type { Metadata } from "next";
import { ROUTES, SITE_URL, type RouteKey } from "@/lib/routes";

/**
 * Build a BreadcrumbList JSON-LD object for a page.
 *
 * Per Google's docs (https://developers.google.com/search/docs/appearance/structured-data/breadcrumb),
 * every item — including the current page (the last one) — should
 * carry a URL. Position numbering is 1-indexed.
 *
 * Usage:
 *
 *   const breadcrumbs = breadcrumbJsonLd([
 *     { name: "Home", path: "/" },
 *     { name: "Admission", path: "/admission" },
 *     { name: "JEECUP", path: "/jeecup" },
 *   ]);
 *
 *   // …
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
 *
 * Breadcrumb rich results are eligible to surface in Google SERPs as
 * a navigable trail under the title — useful for deep pages where
 * the user's path through the site is non-obvious (e.g.
 * /jeecup-counselling sits under /jeecup which sits under /admission).
 */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  const base = SITE_URL.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

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
      // en-IN + x-default. The site has a client-side EN/हिंदी toggle
      // (lib/lang.tsx) that swaps a handful of nav strings via
      // localStorage, but the SSR HTML — which is what Google crawls —
      // is always English. Declaring hi-IN here would be hreflang-lying:
      // the audit's E-E-A-T section flagged it as a real penalty risk.
      // Re-add hi-IN only when a genuine /hi/* SSR path exists.
      //
      // x-default added May 2026 (Phase 2 audit response). Tells Google
      // "this English page is also the fallback for any unmapped
      // language" — completes the hreflang set without claiming we
      // have alternate-language URLs.
      languages: {
        "en-IN": r.path,
        "x-default": r.path,
      },
    },
    // Routes flagged `noindex` (e.g. the /early-registration conversion LP)
    // render noindex,follow so they don't compete in organic search; a
    // noindexed URL also can't be chosen as the canonical for other pages.
    robots: { index: !r.noindex, follow: true },
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

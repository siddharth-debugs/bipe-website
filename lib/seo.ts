/**
 * Server-side SEO bundle fetcher + Next.js `Metadata` builder.
 *
 * Used in two places:
 *   1. `app/layout.tsx` calls `getSeoBundle("/")` to pull GA/GTM/verification
 *      meta + the Organization schema for the root <head>.
 *   2. Each page exports an async `generateMetadata` that calls
 *      `metadataFor(slug)` — this merges the static `lib/routes` defaults with
 *      whatever the backend has stored for that path.
 *
 * The fetch is server-side and short-cached (5 minutes via `next.revalidate`).
 * If the backend is unreachable we silently fall back to the static defaults
 * so the site never breaks because of a CMS hiccup.
 */

import type { Metadata } from "next";
import { ROUTES, SITE_URL, type RouteKey } from "@/lib/routes";

const BACKEND_BASE =
  process.env.BIPE_BACKEND_URL?.trim().replace(/\/+$/, "") ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api/v1";

export interface SeoOG {
  title: string;
  description: string;
  image: string;
  type: string;
  locale: string;
  site_name: string;
  url: string;
}

export interface SeoTwitter {
  card: string;
  title: string;
  description: string;
  image: string;
  site: string;
}

export interface SeoAnalytics {
  ga4_measurement_id: string;
  gtm_container_id: string;
  google_ads_id: string;
  facebook_pixel_id: string;
  hotjar_id: string;
  microsoft_clarity_id: string;
}

export interface SeoVerification {
  google: string;
  bing: string;
  yandex: string;
  facebook: string;
  pinterest: string;
}

export interface SeoBundle {
  path: string;
  title: string;
  description: string;
  keywords: string;
  canonical_url: string;
  robots: string;
  og: SeoOG;
  twitter: SeoTwitter;
  hreflang: Record<string, string>;
  schemas: Record<string, unknown>[];
  analytics: SeoAnalytics;
  verification: SeoVerification;
  extra_head_html: string;
  site: { name: string; url: string; locale: string; title_template: string };
}

/** Fetch the merged SEO bundle for a given path. Never throws. */
export async function getSeoBundle(path: string): Promise<SeoBundle | null> {
  try {
    const url = `${BACKEND_BASE}/seo/bundle/?path=${encodeURIComponent(path)}`;
    const res = await fetch(url, {
      // ISR-style cache; tweak revalidate to taste.
      next: { revalidate: 300, tags: [`seo:${path}`] },
    });
    if (!res.ok) return null;
    return (await res.json()) as SeoBundle;
  } catch {
    return null;
  }
}

function nonEmpty(...xs: (string | null | undefined)[]): string {
  for (const x of xs) if (x && x.trim()) return x;
  return "";
}

/**
 * Build a Next.js `Metadata` object for a route, layering:
 *   1. Backend bundle for the route's path  (highest priority)
 *   2. Static ROUTES entry from lib/routes
 *   3. Reasonable fallbacks
 */
export async function metadataFor(slug: RouteKey): Promise<Metadata> {
  const r = ROUTES[slug];
  const bundle = await getSeoBundle(r.path);

  const title = nonEmpty(bundle?.title, r.title);
  const description = nonEmpty(bundle?.description, r.description);
  const canonical =
    nonEmpty(bundle?.canonical_url, "") || `${SITE_URL.replace(/\/$/, "")}${r.path}`;

  const og = bundle?.og;
  const tw = bundle?.twitter;

  const meta: Metadata = {
    title,
    description,
    keywords: bundle?.keywords ? bundle.keywords.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    alternates: {
      canonical,
      languages: bundle?.hreflang && Object.keys(bundle.hreflang).length ? bundle.hreflang : undefined,
    },
    robots: bundle?.robots || undefined,
    openGraph: {
      title: nonEmpty(og?.title, title),
      description: nonEmpty(og?.description, description),
      url: canonical,
      siteName: og?.site_name || "BIPE",
      type: (og?.type as "website" | "article") || "website",
      locale: og?.locale || "en_IN",
      images: og?.image ? [{ url: og.image }] : undefined,
    },
    twitter: {
      card: (tw?.card as "summary" | "summary_large_image" | "app" | "player") || "summary_large_image",
      title: nonEmpty(tw?.title, title),
      description: nonEmpty(tw?.description, description),
      images: tw?.image ? [tw.image] : og?.image ? [og.image] : undefined,
      site: tw?.site || undefined,
    },
  };
  return meta;
}

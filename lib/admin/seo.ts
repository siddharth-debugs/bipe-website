/**
 * Typed client for the SEO admin API.
 *
 * Endpoints (backend: backend/seo/urls.py):
 *   GET    /seo/site/                      — SiteSEO singleton
 *   PATCH  /seo/site/                      — update site-wide defaults
 *   GET    /seo/pages/                     — list PageSEO rows
 *   POST   /seo/pages/                     — create
 *   GET    /seo/pages/:id/                 — read
 *   PATCH  /seo/pages/:id/                 — update
 *   DELETE /seo/pages/:id/                 — delete
 *   GET    /seo/pages/by-path/?path=…      — read by path
 *   GET    /seo/bundle/?path=…             — PUBLIC merged bundle (used by frontend <head>)
 */

import { api } from "@/lib/admin/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteSEO {
  id?: number;
  site_name: string;
  site_url: string;
  default_locale: string;

  default_title: string;
  title_template: string;
  default_description: string;
  default_keywords: string;
  default_og_image: string;
  default_robots: string;
  twitter_handle: string;
  twitter_card: string;

  ga4_measurement_id: string;
  gtm_container_id: string;
  google_ads_id: string;
  facebook_pixel_id: string;
  hotjar_id: string;
  microsoft_clarity_id: string;

  google_site_verification: string;
  bing_site_verification: string;
  yandex_verification: string;
  facebook_domain_verification: string;
  pinterest_verification: string;

  organization_schema: Record<string, unknown>;
  extra_schemas: Record<string, unknown>[];

  extra_head_html: string;
  updated_at?: string;
}

export interface PageSEO {
  id?: number;
  path: string;
  label: string;
  enabled: boolean;

  title: string;
  description: string;
  keywords: string;
  canonical_url: string;
  robots: string;

  og_title: string;
  og_description: string;
  og_image: string;
  og_type: string;
  og_locale: string;

  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;

  schemas: Record<string, unknown>[];
  hreflang: Record<string, string>;

  sitemap_priority: number | string;
  sitemap_changefreq: string;

  created_at?: string;
  updated_at?: string;
}

export type PageSEOListItem = Pick<
  PageSEO,
  "id" | "path" | "label" | "title" | "enabled" | "updated_at"
>;

// ─────────────────────────────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────────────────────────────

export function getSite(): Promise<SiteSEO> {
  return api<SiteSEO>("/seo/site/");
}

export function patchSite(patch: Partial<SiteSEO>): Promise<SiteSEO> {
  return api<SiteSEO>("/seo/site/", { method: "PATCH", body: patch });
}

export function listPages(): Promise<PageSEO[]> {
  return api<PageSEO[] | { results: PageSEO[] }>("/seo/pages/").then((r) =>
    Array.isArray(r) ? r : r.results,
  );
}

export function getPage(id: number | string): Promise<PageSEO> {
  return api<PageSEO>(`/seo/pages/${id}/`);
}

export function createPage(p: Partial<PageSEO>): Promise<PageSEO> {
  return api<PageSEO>("/seo/pages/", { method: "POST", body: p });
}

export function updatePage(
  id: number | string,
  p: Partial<PageSEO>,
): Promise<PageSEO> {
  return api<PageSEO>(`/seo/pages/${id}/`, { method: "PATCH", body: p });
}

export function deletePage(id: number | string): Promise<void> {
  return api<void>(`/seo/pages/${id}/`, { method: "DELETE" });
}

// Helper: pretty-print JSON for textarea editing.
export function prettyJSON(value: unknown): string {
  try {
    return JSON.stringify(value ?? null, null, 2);
  } catch {
    return "";
  }
}

// Helper: parse JSON from a textarea, returning [value, error].
export function parseJSON<T = unknown>(
  raw: string,
  fallback: T,
): [T, string | null] {
  if (!raw.trim()) return [fallback, null];
  try {
    return [JSON.parse(raw) as T, null];
  } catch (e) {
    return [fallback, e instanceof Error ? e.message : "Invalid JSON"];
  }
}

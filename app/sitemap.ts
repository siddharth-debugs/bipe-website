import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/routes";

const HIGH_PRIORITY = new Set([
  "/",
  "/admission",
  "/courses",
  "/apply",
  "/fees",
  "/jeecup",
  "/placements",
  "/mandatory-disclosure",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(ROUTES).map((r) => ({
    // Canonical for the homepage is SITE_URL with no trailing slash — match it
    // here so the sitemap and rendered <link rel="canonical"> agree.
    url: r.path === "/" ? SITE_URL : `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.path === "/" ? ("daily" as const) : ("weekly" as const),
    priority: r.path === "/" ? 1 : HIGH_PRIORITY.has(r.path) ? 0.9 : 0.7,
  }));
}

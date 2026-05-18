import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/routes";
import { DATA } from "@/lib/data";

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
  const lastModified = new Date();
  const routeEntries = Object.values(ROUTES).map((r) => ({
    // Canonical for the homepage is SITE_URL with no trailing slash — match it
    // here so the sitemap and rendered <link rel="canonical"> agree.
    url: r.path === "/" ? SITE_URL : `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.path === "/" ? ("daily" as const) : ("weekly" as const),
    priority: r.path === "/" ? 1 : HIGH_PRIORITY.has(r.path) ? 0.9 : 0.7,
  }));

  // Per-branch landing pages under /courses/[slug] — high priority since
  // they target the rarest BTEUP keyword clusters (e.g. dairy engineering UP).
  const branchEntries = DATA.branches.map((b) => ({
    url: `${SITE_URL}/courses/${b.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...routeEntries, ...branchEntries];
}

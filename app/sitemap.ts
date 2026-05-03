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
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.path === "/" ? ("daily" as const) : ("weekly" as const),
    priority: r.path === "/" ? 1 : HIGH_PRIORITY.has(r.path) ? 0.9 : 0.7,
  }));
}

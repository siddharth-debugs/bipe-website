import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(ROUTES).map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r.path === "/" ? 1 : 0.7,
  }));
}

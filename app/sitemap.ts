import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { BLOG_POSTS } from "@/lib/blogPosts";

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

  // Geo-hub: /campus/phoolpur targets "polytechnic in Phoolpur",
  // "how to reach BIPE", "free shuttle Varanasi Cantt BIPE".
  const geoEntries = [
    {
      url: `${SITE_URL}/campus/phoolpur`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Mid-funnel blog posts — each is a separate keyword cluster
  // (audit §4.2). Lower changefreq + priority since they're
  // long-form pieces, not transactional pages.
  const blogEntries = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedISO),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routeEntries, ...branchEntries, ...geoEntries, ...blogEntries];
}

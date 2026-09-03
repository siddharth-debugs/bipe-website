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
  const routeEntries = Object.values(ROUTES)
    // Skip noindex routes (e.g. /early-registration) — don't submit a URL
    // we're telling Google not to index.
    .filter((r) => !r.noindex)
    .map((r) => ({
    // Canonical for the homepage is SITE_URL with no trailing slash — match it
    // here so the sitemap and rendered <link rel="canonical"> agree.
    url: r.path === "/" ? SITE_URL : `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.path === "/" ? ("daily" as const) : ("weekly" as const),
    priority: r.path === "/" ? 1 : HIGH_PRIORITY.has(r.path) ? 0.9 : 0.7,
  }));

  // Per-branch landing pages under /courses/[slug] — high priority since
  // they target long-tail BTEUP keyword clusters ("civil engineering
  // diploma Varanasi" and the like).
  //
  // 3 Sep 2026 · this maps DATA.branches, NOT ADMITTING_BRANCHES, and it
  // must keep doing so. /courses/dairy-engineering stays in the sitemap:
  // the branch is closed to new admissions but still running, its page is
  // live and ranking, and the 2025-26 cohort needs it until 2028. Pulling
  // the URL would deindex a 200 page mid-course. The closure notice
  // belongs on the page — a sitemap has nowhere to say it.
  const branchEntries = DATA.branches.map((b) => ({
    url: `${SITE_URL}/courses/${b.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Geo-hub: /campus/phoolpur targets "polytechnic in Phoolpur",
  // "how to reach BIPE", "Varanasi Cantt to BIPE Phoolpur".
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

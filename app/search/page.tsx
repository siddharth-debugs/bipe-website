import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";
import { SITE_URL } from "@/lib/routes";

/**
 * /search — client-side search across page titles, descriptions and
 * blog posts.
 *
 * Why this route exists:
 *
 *   1. Schema.org SearchAction in app/layout.tsx points at
 *      /search?q={query}. Without a real /search route, declaring
 *      SearchAction would be hreflang-lying (promising Google a
 *      capability we don't have). With it, BIPE is eligible for the
 *      "sitelinks searchbox" rich-result variant under branded SERP
 *      entries.
 *
 *   2. There's no server backend doing the actual search — it's
 *      client-side filtering over BLOG_POSTS + ROUTES, similar to a
 *      static-site search. Good enough for a site this small (~70
 *      routes + 10 blog posts).
 *
 * SEO:
 *
 *   robots: noindex,follow — we don't want search-result URLs in
 *   Google's index (they'd duplicate page content and look thin).
 *   Follow stays on so any link from a search result still passes
 *   PageRank to the destination.
 */
export const metadata: Metadata = {
  title: "Search · BIPE",
  description:
    "Search BIPE Varanasi — branches, admission pages, blog posts, fees, hostel, JEECUP, placements. Type to filter across the site.",
  alternates: {
    canonical: "/search",
    languages: { "en-IN": "/search" },
  },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Search · BIPE",
    description: "Site-wide search for BIPE Varanasi.",
    url: `${SITE_URL}/search`,
    siteName: "BIPE",
    type: "website",
    locale: "en_IN",
  },
};

export default function SearchPage() {
  return (
    <div className="page-enter">
      <Suspense
        fallback={
          <div
            className="container"
            style={{ padding: "80px 0", textAlign: "center", color: "var(--ink-2)" }}
          >
            Loading search…
          </div>
        }
      >
        <SearchClient />
      </Suspense>
    </div>
  );
}

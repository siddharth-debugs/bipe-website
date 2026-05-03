import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/routes";

// Phase-1 audit: a robots.txt is mandatory and must point to the sitemap.
// Block sensitive admin / static-attachment paths (the old Django site
// served a bank-mandate PDF from /static/img/ — never re-expose).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/static/admin/",
          "/static/img/Mandatory-DIsclosure_AICTE.pdf", // legacy bank-form file from old Django site
          "/private/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

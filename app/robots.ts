import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/routes";

/**
 * robots.txt — explicit allow-list for every search + AI crawler we
 * want indexing BIPE.
 *
 * For AI search assistants (Perplexity, ChatGPT browsing, Claude,
 * Google AI Overviews via Google-Extended) — explicit ``Allow`` is
 * higher-confidence than implicit "no rule = allow". Some crawlers
 * treat silence as ambiguous and back off.
 */
export default function robots(): MetadataRoute.Robots {
  const aiAndSearchBots = [
    "Googlebot",
    "Google-Extended",     // Google AI Overviews / Bard / Gemini
    "Bingbot",
    "Slurp",                // Yahoo
    "DuckDuckBot",
    "GPTBot",               // OpenAI training
    "OAI-SearchBot",        // ChatGPT browsing
    "ChatGPT-User",         // ChatGPT user-initiated fetches
    "ClaudeBot",            // Anthropic
    "anthropic-ai",         // Anthropic training fetcher
    "PerplexityBot",
    "Perplexity-User",
    "Applebot",
    "Applebot-Extended",
    "Bytespider",           // ByteDance
    "Amazonbot",
    "FacebookBot",
    "facebookexternalhit",
    "Twitterbot",
    "LinkedInBot",
  ];

  const sharedDisallow = [
    "/api/",
    "/admin/",                                       // dashboard — auth-gated already
    "/static/admin/",
    "/private/",
    // Removed May 2026: /static/img/Mandatory-DIsclosure_AICTE.pdf
    // disallow. The file no longer exists on disk (verified — it was a
    // legacy artefact from the old Django site, never carried over to
    // the Next.js rewrite). Blocking a phantom URL was sending Google
    // a "Blocked by robots.txt" indexing-coverage signal in GSC for
    // a URL that should just be redirected away. The redirect now
    // lives in next.config.ts (PDF → /mandatory-disclosure), which
    // is the legitimate canonical for the AICTE disclosure document
    // (an institution legally required to publish openly per AICTE
    // Annexure-18). Net effect: GSC's "Blocked" row drops to 0;
    // any residual links to the old PDF land on the correct HTML
    // page.
    //
    // ─── DO NOT add /*/opengraph-image or similar Next.js auto-
    //     generated endpoints to this list ────────────────────────
    //
    // BITE (bitevns.ac.in, the sibling institute's site) shipped
    // exactly this pattern in their robots.txt and accumulated:
    //   - 128 "Blocked by robots.txt" entries in GSC (one per
    //     route's auto-generated /<route>/opengraph-image URL)
    //   - 36 "Indexed though blocked by robots.txt" entries
    //     (URL-only SERP results from external links — worst
    //     possible SERP outcome)
    //
    // Why robots.txt is the wrong tool for OG image / form-page
    // endpoints:
    //
    //   robots.txt blocks CRAWLING. If external sites link to a
    //   URL, Google indexes it as a URL-only entry even when
    //   blocked. The correct mechanism is X-Robots-Tag: noindex
    //   HTTP header — that lets Google crawl AND not index.
    //
    // If a future BIPE feature ever needs to hide a path from the
    // index (a /alumni/register form, per-page OG endpoints, a
    // /search page result, etc.), add an X-Robots-Tag header in
    // next.config.ts instead — NOT a robots.txt Disallow. See
    // BITE_SEO_FIXES.md (repo root) for the full pattern + diagnostic.
    //
    // BIPE today has no per-page opengraph-image endpoints (OG URLs
    // come from static Cloudinary URLs in lib/seo.ts), so this is
    // a preventive note — don't reintroduce the bug pattern when
    // adding future features.
  ];

  return {
    rules: [
      // Default catch-all
      {
        userAgent: "*",
        allow: "/",
        disallow: sharedDisallow,
      },
      // Explicit allow per major crawler. Same disallow set; the
      // explicit entry is the trust signal that AI assistants look for.
      ...aiAndSearchBots.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: sharedDisallow,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

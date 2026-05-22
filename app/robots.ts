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

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
    "/static/img/Mandatory-DIsclosure_AICTE.pdf",    // legacy bank-form leak from old Django site
    "/private/",
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

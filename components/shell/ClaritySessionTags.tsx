"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/lang";
import { clarityTag } from "@/lib/analytics";

/**
 * Session-level Microsoft Clarity tags, set once per visit so replays +
 * heatmaps can be segmented by audience:
 *
 *   - language  "en" | "hi"  (re-tags if the visitor toggles language)
 *   - source    utm_source → else referrer hostname → else "direct"
 *   - utm_medium / utm_campaign  when present on the URL
 *
 *   - channel   "ai" + ai_engine ("chatgpt" | "gemini" | …) when the
 *               visit came from a generative engine — Clarity (Jun 2026)
 *               showed AI-referred sessions are the most engaged on the
 *               site, so they're worth segmenting as a channel.
 *
 * Lets you pull, e.g., replays of Hindi-medium visitors, or sessions
 * from a specific WhatsApp/poster campaign. No PII is tagged (referrer
 * is reduced to its hostname; query strings are dropped). No-op without
 * Clarity (localhost / preview) and never throws.
 */
// Generative-engine referrers — matched against utm_source + referrer.
const AI_ENGINES: { test: RegExp; name: string }[] = [
  { test: /chatgpt|openai/, name: "chatgpt" },
  { test: /gemini|bard/, name: "gemini" },
  { test: /perplexity/, name: "perplexity" },
  { test: /copilot/, name: "copilot" },
  { test: /\bclaude\b|anthropic/, name: "claude" },
];

export default function ClaritySessionTags() {
  const { lang } = useLang();

  // Language — re-tag whenever it changes.
  useEffect(() => {
    clarityTag("language", lang);
  }, [lang]);

  // Source — resolved once on first mount from URL params + referrer.
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const utmSource = p.get("utm_source");
      const utmMedium = p.get("utm_medium");
      const utmCampaign = p.get("utm_campaign");

      let source: string | null = utmSource;
      if (!source && document.referrer) {
        try {
          const host = new URL(document.referrer).hostname.replace(/^www\./, "");
          // Internal navigation isn't a "source".
          source = host.endsWith("bipevns.org") ? null : host;
        } catch {
          /* malformed referrer — ignore */
        }
      }
      clarityTag("source", source || "direct");
      // Flag generative-engine referrals as a groupable channel so all AI
      // traffic (ChatGPT + Gemini + …) can be filtered together, on top of
      // the raw per-engine source.
      const sig = `${utmSource || ""} ${document.referrer || ""}`.toLowerCase();
      const ai = AI_ENGINES.find((e) => e.test.test(sig));
      if (ai) {
        clarityTag("channel", "ai");
        clarityTag("ai_engine", ai.name);
      }
      if (utmMedium) clarityTag("utm_medium", utmMedium);
      if (utmCampaign) clarityTag("utm_campaign", utmCampaign);
    } catch {
      /* analytics must never throw */
    }
    // Run once on mount — the entry URL/referrer defines the session source.
  }, []);

  return null;
}

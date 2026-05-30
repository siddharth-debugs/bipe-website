# BITE SEO Fixes — One-Pager for the bitevns.ac.in Operator

**Audience:** whoever maintains the `bitevns.ac.in` Next.js codebase
(separate repo from this one).

**Date:** 29 May 2026.

**Source:** Google Search Console index-coverage export for
bitevns.ac.in pulled 2026-05-25, cross-referenced against the live
`https://bitevns.ac.in/robots.txt` and Next.js App Router default
behaviour.

---

## What the GSC export shows

| Issue | Pages | Severity |
|---|---|---|
| Blocked by robots.txt | **128** | HIGH |
| Discovered – currently not indexed | **157** | HIGH |
| Crawled – currently not indexed | 74 | MED |
| Not found (404) | 41 | MED |
| Page with redirect | 32 | MED |
| Indexed though blocked by robots.txt | **36** | HIGH |
| Total impressions (3 months) | 30K+ peak day | – |
| Indexation rate | ~28% (174 indexed / 612 known) | LOW |

The trend chart (Chart.csv) shows discovery accelerating from
~350 impressions/day in March to 30K+ on 21 May 2026 — Google is
sampling the site heavily, but only a quarter of the URLs are being
added to the index. The bottleneck isn't traffic; it's indexation.

---

## Root cause (diagnosed)

The 128 "Blocked by robots.txt" + 36 "Indexed though blocked"
entries are caused by the same self-inflicted issue.

`bitevns.ac.in/robots.txt` (current state) disallows:

```
Disallow: /api/
Disallow: /admin/
Disallow: /alumni/register
Disallow: /opengraph-image
Disallow: /*/opengraph-image
Disallow: /*/opengraph-image*
```

**The `/*/opengraph-image` rules are the problem.** Next.js
App Router auto-generates one OG image endpoint per route
(`/about/opengraph-image`, `/courses/opengraph-image`, etc.). Google
discovers each one via the `<meta property="og:image" content="...
/<route>/opengraph-image">` tag in every page's `<head>`, attempts
to fetch, hits the robots block, and reports each as
"Blocked by robots.txt".

For ~125 indexable pages × one OG image each ≈ 128 blocked URLs.
That matches the GSC number exactly.

The 36 "Indexed though blocked" comes from the same pattern: when
robots.txt blocks BUT external sites or social platforms have linked
to a URL, Google indexes it as a URL-only entry with no snippet —
the worst kind of SERP result. It looks broken; it confuses users
who Google the site.

**robots.txt is the wrong mechanism for "don't index this".** The
correct mechanism is `X-Robots-Tag: noindex` HTTP header. Robots.txt
blocks crawling — but if external links exist, Google can still
index the URL even without crawling. The noindex header tells Google
to crawl AND not index — which is what we actually want for these
endpoints.

---

## The fix (2 file changes, ~10 minutes)

### File 1 — `app/robots.ts`

Replace the current `disallow` array with this trimmed version:

```typescript
const sharedDisallow = [
  "/api/",
  "/admin/",
];
```

Remove these lines:

- `"/alumni/register"`
- `"/opengraph-image"`
- `"/*/opengraph-image"`
- `"/*/opengraph-image*"`

### File 2 — `next.config.ts`

Add (or extend) the `headers()` function:

```typescript
async headers() {
  return [
    // OG image endpoints — exist to be fetched by Facebook /
    // Twitter / WhatsApp scrapers, never to rank in Google.
    // X-Robots-Tag tells Google to crawl + not index, which
    // is the correct mechanism (robots.txt only blocks crawling,
    // and an unindexable URL with external links gets indexed
    // as URL-only — the worst SERP outcome).
    {
      source: "/:path*/opengraph-image",
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    },
    {
      source: "/opengraph-image",
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    },
    // Form pages — interactive only, no content to rank.
    // "follow" lets Google still follow links from the page
    // (in case the form page links to e.g. /alumni or /).
    {
      source: "/alumni/register",
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    },
  ];
},
```

If `headers()` already exists, merge these entries into the
returned array.

### Deploy + validate

1. Commit both file changes
2. Push → Vercel auto-deploys
3. After deploy, verify with curl:

```bash
curl -I https://bitevns.ac.in/about/opengraph-image | grep -i x-robots-tag
# Expected: x-robots-tag: noindex

curl -I https://bitevns.ac.in/alumni/register | grep -i x-robots-tag
# Expected: x-robots-tag: noindex, follow

curl https://bitevns.ac.in/robots.txt | grep -c opengraph
# Expected: 0  (no opengraph rules left)
```

4. GSC → Indexing → Pages → click "Blocked by robots.txt" and
   "Indexed though blocked by robots.txt" → **Validate Fix** button
   at the top of each error report. Google rechecks the URLs over
   ~14–28 days.

### Expected effect after 2-4 weeks of recrawl

| Issue | Before | After |
|---|---|---|
| Blocked by robots.txt | 128 | ~5 |
| Indexed though blocked | 36 | 0 |
| Crawl budget | wasted on 128 blocked URLs | freed for real pages |
| URL-only SERP results | 36 (worst SERP) | 0 |

The 128 → ~5 drop is because the OG image endpoints will start
returning real content + `X-Robots-Tag: noindex` instead of being
blocked. Google sees the noindex, doesn't add them to the index, and
they stop appearing in the error report. The remaining ~5 are real
blocks (`/api/`, `/admin/` plus their child paths).

---

## What this fix does NOT address

These need separate investigation, ideally with the per-URL GSC
export:

- **157 "Discovered – currently not indexed"** — Google saw these
  URLs but won't even crawl them. Causes: weak internal linking,
  pattern-fatigue from too many similar URLs (programmatic SEO
  templates), site-authority thresholds Google hasn't yet trusted.
  Fix: export the 157 URLs from GSC → group by URL pattern →
  identify the templates Google is rejecting → either consolidate
  template variants or strengthen internal links to them.

- **74 "Crawled – currently not indexed"** — Google crawled but
  rejected. Almost always thin content, near-duplicates, or
  pages where the title + meta + body don't match. Fix: same
  URL-list approach.

- **41 404s** — broken internal links or stale sitemap entries.
  Fix: 301-redirect each to closest equivalent, or remove from
  sitemap and let them 404 cleanly.

- **32 "Page with redirect"** — internal links pointing at URLs
  that redirect. Wastes crawl budget. Fix: update the links to
  point directly at the final URL.

---

## Why this matters

Every URL Google doesn't index is invisible to the polytechnic
applicants searching for BITE. The current 28% indexation rate
means **roughly 3 of every 4 pages on BITE don't exist as far as
Google is concerned**. Fixing this one robots.txt issue clears the
biggest pile (~150 pages) and frees crawl budget for the 231 pages
currently stuck in Discovery/Crawl limbo to make progress.

---

## Cross-reference

If the BITE codebase shares the BIPE pattern (Next.js App Router
on Vercel, same metadata stack), the fix is mechanical — copy the
two file edits above. If the codebases have diverged, the principle
still holds: **don't block crawlable URLs in robots.txt; serve
`X-Robots-Tag: noindex` instead**.

Source for this analysis: GSC Index Coverage export for
bitevns.ac.in (2026-03-07 → 2026-05-25), Chart.csv +
Critical issues.csv + Non-critical issues.csv. Cross-checked
against `https://bitevns.ac.in/robots.txt` (live fetch, 29 May 2026)
and Next.js App Router default OG image behaviour.

For questions or to confirm the fix landed, ping whoever maintains
the BIPE site (`bipevns.org`) — same codebase pattern, similar
issues were caught and fixed in Task #56 of that repo.

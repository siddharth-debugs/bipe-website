"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { ROUTES, type RouteKey } from "@/lib/routes";
import { ArrowIcon } from "@/components/shell/Icons";

/**
 * Search UI — split out as a client component because useSearchParams
 * requires Suspense in Next 16. The parent server page (page.tsx)
 * provides the Suspense boundary.
 *
 * Matching strategy: case-insensitive substring on title + description +
 * category. Cheap, predictable, and adequate for a 70-route + 10-post
 * site. No fuzzy matching — that's diminishing returns at this scale.
 *
 * Results split into two groups: pages first (admission funnel
 * tends to be page-shaped), then blog posts. Each group sorted by
 * the original index order in its source data — that's a deliberate
 * non-choice: don't try to score relevance, just list everything
 * that matched in stable order.
 */
export function SearchClient() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  // Keep local input in sync if the URL ?q= changes (e.g. someone
  // pastes a new search URL or hits browser back/forward).
  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const trimmed = q.trim();

  const results = useMemo(() => {
    if (trimmed.length < 2) return { pages: [], posts: [] };
    const lower = trimmed.toLowerCase();
    const hits = (s: string) => s.toLowerCase().includes(lower);

    const pages = (Object.entries(ROUTES) as Array<[RouteKey, (typeof ROUTES)[RouteKey]]>)
      .filter(([, r]) => hits(r.title) || hits(r.description))
      .map(([key, r]) => ({ key, path: r.path, title: r.title, description: r.description }));

    const posts = BLOG_POSTS.filter(
      (p) => hits(p.title) || hits(p.excerpt) || hits(p.category),
    ).map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
    }));

    return { pages, posts };
  }, [trimmed]);

  const total = results.pages.length + results.posts.length;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 880 }}>
        <div className="eyebrow">Search</div>
        <h1 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
          What are you{" "}
          <span
            className="serif"
            style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
          >
            looking for?
          </span>
        </h1>

        {/* Input row */}
        <div style={{ marginTop: 28, position: "relative" }}>
          {/* 3 Sep 2026 · "dairy engineering" swapped out of the example
              queries below. The index is untouched — "dairy" still matches
              the /courses description and both Dairy blog posts, so the
              branch stays findable. What changed is that the site no longer
              *suggests* it to an applicant who hadn't asked for it, sitting
              among three live admission topics. */}
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try 'fees', 'jeecup counselling', 'placements', 'hostel'…"
            autoFocus
            aria-label="Search BIPE"
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: 16,
              borderRadius: 14,
              border: "1px solid var(--line)",
              background: "var(--paper)",
              color: "var(--ink-1)",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>

        {/* Result summary */}
        <div
          style={{
            marginTop: 18,
            paddingBottom: 14,
            borderBottom: "1px solid var(--line)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          {trimmed.length < 2 ? (
            <>Type at least 2 characters to search</>
          ) : total === 0 ? (
            <>No results for &ldquo;{trimmed}&rdquo;</>
          ) : (
            <>
              {total} {total === 1 ? "result" : "results"} for &ldquo;{trimmed}&rdquo;
            </>
          )}
        </div>

        {/* Pages results */}
        {results.pages.length > 0 && (
          <section style={{ marginTop: 30 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ink-1)",
                marginBottom: 14,
              }}
            >
              Pages ({results.pages.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.pages.map((r) => (
                <Link
                  key={r.path}
                  href={r.path}
                  className="card"
                  style={{
                    padding: 18,
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-1)", margin: 0 }}>
                      {r.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        color: "var(--brand)",
                      }}
                    >
                      {r.path}
                    </span>
                  </div>
                  <p
                    style={{
                      marginTop: 6,
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: "var(--ink-2)",
                    }}
                  >
                    {r.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Blog results */}
        {results.posts.length > 0 && (
          <section style={{ marginTop: 30 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ink-1)",
                marginBottom: 14,
              }}
            >
              Blog posts ({results.posts.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.posts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card"
                  style={{
                    padding: 18,
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span className="pill pill-accent" style={{ fontSize: 11 }}>
                      {p.category}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-1)", margin: 0 }}>
                      {p.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      marginTop: 8,
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: "var(--ink-2)",
                    }}
                  >
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty state suggestions */}
        {trimmed.length >= 2 && total === 0 && (
          <div
            style={{
              marginTop: 30,
              padding: 22,
              background: "var(--paper-2)",
              borderRadius: 14,
              color: "var(--ink-2)",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "var(--ink-1)" }}>Try one of these:</strong>{" "}
            <Link href="/admission">Admission</Link>
            {" · "}
            <Link href="/fees">Fees</Link>
            {" · "}
            <Link href="/jeecup-counselling">JEECUP counselling</Link>
            {" · "}
            <Link href="/placements">Placements</Link>
            {" · "}
            <Link href="/courses">All branches</Link>
            {" · "}
            <Link href="/hostel">Hostel</Link>
            {" · "}
            <Link href="/blog">Blog</Link>
            {" · "}
            <Link href="/contact">
              Contact <ArrowIcon size={12} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

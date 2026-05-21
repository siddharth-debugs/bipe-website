import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogPosts";
import { ArrowIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("blog"); }

/**
 * Detect whether a post is primarily Hindi-language.
 *
 * Three signals (any one is sufficient):
 *
 *   1. Category contains "Hindi"  → ("Guide · Hindi", "Career · Hindi")
 *   2. Slug includes "kya-hai"    → legacy slug pattern for our first
 *                                    Hindi post (polytechnic-kya-hai-...)
 *   3. Slug includes "hindi"      → explicit "-hindi" suffix pattern
 *                                    used on newer Hindi posts
 *
 * Bilingual posts (English with Hindi sections — like "career-options-
 * after-12th") are NOT marked as Hindi here. They're primarily English
 * content with vernacular phrases sprinkled in; the user clicking a
 * "हिन्दी में पढ़ें" link expects a fully Hindi-language reading
 * experience, not a code-switched one.
 */
function isHindiPost(p: BlogPost): boolean {
  return (
    p.category.includes("Hindi") ||
    p.slug.includes("kya-hai") ||
    p.slug.includes("hindi")
  );
}

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  // Two derived lists from BLOG_POSTS:
  //   HINDI_POSTS    — the dedicated Hindi-language posts, surfaced
  //                    in the "हिन्दी में पढ़ें" section at the top.
  //   The full list  — still rendered chronologically below; Hindi
  //                    posts carry a "हिन्दी" pill in their card.
  const HINDI_POSTS = BLOG_POSTS.filter(isHindiPost);

  // Blog schema enriches the index with a CollectionPage that lists
  // every post as a BlogPosting. Each post links back to its
  // /blog/[slug] page which already carries Article JSON-LD — Google
  // ties them together for blog rich results. Eligible for the
  // "blog posts" carousel in branded SERPs.
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "BIPE Blog",
    description:
      "Notes from BIPE — practical writing for diploma students and parents in Eastern UP. Admission pathways, career options, and life on campus.",
    url: `${SITE_URL}/blog`,
    inLanguage: ["en-IN", "hi-IN"],
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "Banaras Institute of Polytechnic & Engineering",
    },
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/blog/${p.slug}#article`,
      headline: p.title,
      description: p.excerpt,
      datePublished: p.publishedISO,
      url: `${SITE_URL}/blog/${p.slug}`,
      articleSection: p.category,
      // Fixed May 2026: previously this missed the polytechnic-salary-
      // 2026-hindi post (it only checked for "kya-hai" / "kaise-kare").
      // Now uses the canonical isHindiPost() helper.
      inLanguage: isHindiPost(p) ? "hi-IN" : "en-IN",
    })),
  };

  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <PageHeader
        eyebrow="Blog"
        title="Notes from BIPE."
        lead="Practical writing for diploma students and parents in Eastern UP — admission pathways, career options, and life on campus."
      />

      {/* ─── Hindi posts section ──────────────────────────────────
          A dedicated rail above the main chronological list, for
          Hindi-medium families who'd rather read in Devanagari than
          scan English titles for one with "Hindi" in it. Only
          renders if HINDI_POSTS is non-empty (defensive — gracefully
          disappears if all Hindi posts are removed).

          Anchor id="hindi" so the homepage Hindi pill or any other
          surface can deep-link straight here.
      */}
      {HINDI_POSTS.length > 0 && (
        <section
          id="hindi"
          className="section"
          style={{ background: "var(--paper-2)", paddingTop: 32, paddingBottom: 36 }}
        >
          <div className="container" style={{ maxWidth: 880 }}>
            <div className="row" style={{ alignItems: "end", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>
                  हिन्दी में पढ़ें · Read in Hindi
                </div>
                <h2 className="bipe-h3" lang="hi" style={{ marginTop: 10, fontSize: 22, maxWidth: "28ch" }}>
                  {HINDI_POSTS.length} पोस्ट हिन्दी में
                </h2>
              </div>
              <p
                lang="hi"
                style={{ fontSize: 13, color: "var(--ink-3)", maxWidth: "40ch", textAlign: "right", lineHeight: 1.6 }}
              >
                Hindi-medium परिवारों के लिए — पॉलिटेक्निक admission, career और सैलरी पर हिन्दी में लिखी guides।
              </p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
              {HINDI_POSTS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  lang="hi"
                  className="card"
                  style={{
                    padding: 20,
                    display: "block",
                    textDecoration: "none",
                    color: "var(--ink)",
                    background: "var(--white)",
                    transition: "border-color .25s var(--ease), transform .25s var(--ease)",
                  }}
                >
                  <div className="row" style={{ gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                    <span
                      className="pill"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        background: "color-mix(in oklab, var(--brand) 14%, transparent)",
                        color: "var(--brand)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      हिन्दी
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                      {p.date} · {p.readTime}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35, color: "var(--ink)" }}>
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
            {BLOG_POSTS.map((p) => {
              const hindi = isHindiPost(p);
              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  {...(hindi ? { lang: "hi" } : {})}
                  className="card"
                  style={{
                    padding: 28,
                    display: "block",
                    textDecoration: "none",
                    color: "var(--ink)",
                    transition: "border-color .25s var(--ease), transform .25s var(--ease)",
                  }}
                >
                  <div className="row" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="pill pill-accent" style={{ fontSize: 11 }}>{p.category}</span>
                    {hindi && (
                      <span
                        className="pill"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          background: "color-mix(in oklab, var(--brand) 14%, transparent)",
                          color: "var(--brand)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        हिन्दी
                      </span>
                    )}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
                      {p.date}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
                      · {p.readTime}
                    </span>
                  </div>
                  <h2 className="bipe-h3" style={{ marginTop: 14, fontSize: 24 }}>
                    {p.title}
                  </h2>
                  <p style={{ color: "var(--ink-2)", fontSize: 15, marginTop: 12, lineHeight: 1.65 }}>
                    {p.excerpt}
                  </p>
                  <div
                    style={{
                      marginTop: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--brand)",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Read post <ArrowIcon size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

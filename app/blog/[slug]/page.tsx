import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug, postWordCount, postCoverImage, type BlogSection } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/routes";
import { ArrowIcon } from "@/components/shell/Icons";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: path,
      // en-IN only — see comment in lib/seo.ts. The site has no SSR
      // Hindi variant; declaring hi-IN here would be hreflang-lying.
      languages: { "en-IN": path },
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}${path}`,
      siteName: "BIPE",
      type: "article",
      locale: "en_IN",
      publishedTime: post.publishedISO,
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [`${SITE_URL}/og-default.png`],
    },
  };
}

function renderSection(s: BlogSection, i: number) {
  switch (s.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="bipe-h2"
          style={{ marginTop: 48, marginBottom: 14, maxWidth: "30ch", fontSize: 28 }}
        >
          {s.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} style={{ marginTop: 32, marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
          {s.text}
        </h3>
      );
    case "p":
      return (
        <p
          key={i}
          style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ink-2)", marginTop: 14 }}
          dangerouslySetInnerHTML={{ __html: s.html }}
        />
      );
    case "ul":
    case "ol": {
      const Tag = s.type as "ul" | "ol";
      return (
        <Tag
          key={i}
          style={{
            marginTop: 16,
            paddingLeft: 22,
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          {s.items.map((it, j) => (
            <li key={j} style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </Tag>
      );
    }
    case "callout":
      return (
        <aside
          key={i}
          style={{
            marginTop: 24,
            marginBottom: 8,
            padding: "22px 26px",
            borderRadius: 14,
            background: "color-mix(in oklab, var(--brand) 6%, var(--white))",
            borderLeft: "3px solid var(--brand)",
          }}
        >
          {s.title && (
            <div
              className="eyebrow"
              style={{ color: "var(--brand)", marginBottom: 8 }}
            >
              {s.title}
            </div>
          )}
          <div
            style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--ink)" }}
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
        </aside>
      );
    case "image":
      return (
        <figure
          key={i}
          style={{ margin: "28px 0" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.alt}
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 14,
              border: "1px solid var(--line)",
              display: "block",
            }}
          />
          {s.caption && (
            <figcaption
              style={{
                marginTop: 10,
                fontSize: 13.5,
                color: "var(--ink-3)",
                textAlign: "center",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              {s.caption}
            </figcaption>
          )}
        </figure>
      );
    case "table":
      return (
        <div
          key={i}
          style={{
            marginTop: 24,
            border: "1px solid var(--line)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--brand)", color: "var(--paper)" }}>
                {s.headers.map((h, k) => (
                  <th
                    key={k}
                    style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: 12,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row, r) => (
                <tr
                  key={r}
                  style={{
                    background:
                      r % 2 === 0
                        ? "var(--white)"
                        : "color-mix(in oklab, var(--brand) 3%, var(--white))",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      style={{
                        padding: "12px 14px",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                        color: c === 0 ? "var(--ink)" : "var(--ink-2)",
                        fontWeight: c === 0 ? 600 : 400,
                      }}
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {s.caption && (
            <div
              style={{
                padding: "10px 14px",
                fontSize: 12,
                color: "var(--ink-3)",
                borderTop: "1px solid var(--line)",
              }}
            >
              {s.caption}
            </div>
          )}
        </div>
      );
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const canonical = `${SITE_URL}/blog/${post.slug}`;

  // Article schema enrichment 2026-05-20. Adds four fields beyond
  // the v1 baseline:
  //
  //   wordCount   — measured from the post body via postWordCount().
  //                 Substantive-content signal for Google.
  //   inLanguage  — was "en-IN" for every post regardless of content
  //                 language. Hindi posts (kya-hai / kaise-kare slug
  //                 patterns) now correctly emit hi-IN. Lying about
  //                 page language is one of the things Google's
  //                 E-E-A-T audit explicitly penalises.
  //   image       — first inline image section in the body if
  //                 present, falls back to og-default.png otherwise.
  //                 Body-image is more topically accurate than the
  //                 site-wide social-share default.
  //   keywords    — category + slug-derived terms, comma-separated.
  //                 Optional in spec but useful as a topical-cluster
  //                 signal.
  const cover = postCoverImage(post);
  const isHindiPost = /(kya-hai|kaise-kare|hindi-|^hi-)/.test(post.slug);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: post.title,
    description: post.metaDescription,
    inLanguage: isHindiPost ? "hi-IN" : "en-IN",
    datePublished: post.publishedISO,
    dateModified: post.publishedISO,
    wordCount: postWordCount(post),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "Banaras Institute of Polytechnic & Engineering",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "Banaras Institute of Polytechnic & Engineering",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/bipe-logo.svg` },
    },
    image: cover
      ? {
          "@type": "ImageObject",
          url: cover.src.startsWith("http") ? cover.src : `${SITE_URL}${cover.src}`,
          caption: cover.alt,
        }
      : `${SITE_URL}/og-default.png`,
    articleSection: post.category,
    keywords: [
      post.category,
      ...post.slug.split("-").filter((w) => w.length > 3),
    ].join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  // Other posts (excluding current) for the "read next" tail
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 24 }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <nav
            aria-label="Breadcrumb"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
              marginBottom: 24,
            }}
          >
            <Link href="/" style={{ color: "inherit" }}>Home</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <Link href="/blog" style={{ color: "inherit" }}>Blog</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--brand)" }}>{post.category}</span>
          </nav>
          <div className="row" style={{ gap: 12, alignItems: "center", marginBottom: 14 }}>
            <span className="pill pill-accent" style={{ fontSize: 11 }}>{post.category}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
              {post.date}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
              · {post.readTime}
            </span>
          </div>
          <h1 className="bipe-h1" style={{ fontSize: 38, lineHeight: 1.15, maxWidth: "22ch" }}>
            {post.title}
          </h1>
          <p
            className="lead"
            style={{ marginTop: 22, maxWidth: "62ch", fontSize: 18, lineHeight: 1.65 }}
          >
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* ─── Body ─────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container" style={{ maxWidth: 780 }}>
          {post.sections.map((s, i) => renderSection(s, i))}
        </div>
      </section>

      {/* ─── Read next ────────────────────────────────────────────── */}
      {otherPosts.length > 0 && (
        <section className="section">
          <div className="container" style={{ maxWidth: 780 }}>
            <div className="eyebrow" style={{ color: "var(--brand)" }}>Read next</div>
            <h2 className="bipe-h2" style={{ marginTop: 12, fontSize: 26 }}>
              More from the BIPE blog.
            </h2>
            <div className="grid" style={{ marginTop: 24, gap: 14 }}>
              {otherPosts.map((op) => (
                <Link
                  key={op.slug}
                  href={`/blog/${op.slug}`}
                  style={{
                    display: "block",
                    padding: 22,
                    borderRadius: 14,
                    border: "1px solid var(--line)",
                    background: "var(--white)",
                    color: "var(--ink)",
                    textDecoration: "none",
                  }}
                >
                  <div className="row" style={{ gap: 10, alignItems: "center" }}>
                    <span className="pill pill-accent" style={{ fontSize: 11 }}>{op.category}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                      {op.readTime}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 17, marginTop: 10 }}>{op.title}</div>
                  <div style={{ marginTop: 6, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
                    {op.excerpt.slice(0, 140)}…
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Closing CTA ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div
            className="card"
            style={{
              padding: 36,
              textAlign: "center",
              background: "color-mix(in oklab, var(--brand) 8%, var(--white))",
            }}
          >
            <h2
              className="bipe-h2"
              style={{ maxWidth: "24ch", margin: "0 auto", fontSize: 26 }}
            >
              Questions about the diploma path?
            </h2>
            <p
              style={{
                marginTop: 14,
                color: "var(--ink-2)",
                maxWidth: "48ch",
                margin: "14px auto 0",
                lineHeight: 1.7,
              }}
            >
              BIPE&apos;s admissions team takes EN / हिंदी questions on WhatsApp every day. Or book a
              campus visit — ~35 minutes from Varanasi Cantt by auto or app-cab.
            </p>
            <div
              className="row"
              style={{ marginTop: 24, gap: 12, justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link href="/apply" className="btn btn-primary">
                Apply for 2026-27 <ArrowIcon />
              </Link>
              <Link href="/visit" className="btn btn-ghost">
                Visit the campus <ArrowIcon />
              </Link>
              <Link href="/courses" className="btn btn-ghost">
                View all 5 polytechnic branches <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

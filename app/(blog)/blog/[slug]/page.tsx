import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug, postWordCount, postCoverImage, type BlogSection } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/routes";
import { ArrowIcon } from "@/components/shell/Icons";
import { DATA } from "@/lib/data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  // notFound(), not `return {}` — see the same fix in
  // app/courses/[branch]/page.tsx. An empty metadata object let unknown
  // slugs serve HTTP 200 with the homepage title and `index, follow`.
  if (!post) notFound();
  const path = `/blog/${post.slug}`;

  // hreflang: a post with no translation sibling declares only its OWN
  // language (post.lang). This previously hardcoded "en-IN", which
  // mislabelled standalone Hindi/Hinglish posts as English — a real
  // signal-contradiction (a hi-IN post claiming hreflang en-IN). Posts
  // that DO have a genuine translation set `hreflangAlternates` — emit
  // the full set + an x-default pointing at the English version.
  let languages: Record<string, string> = { [post.lang ?? "en-IN"]: path };
  if (post.hreflangAlternates?.length) {
    languages = Object.fromEntries(
      post.hreflangAlternates.map((a) => [a.hreflang, `/blog/${a.slug}`]),
    );
    const en = post.hreflangAlternates.find((a) => a.hreflang.startsWith("en"));
    languages["x-default"] = en ? `/blog/${en.slug}` : path;
  }
  const ogLocale = (post.lang ?? "en-IN").replace("-", "_");

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}${path}`,
      siteName: "BIPE",
      type: "article",
      locale: ogLocale,
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

// ── In-content blog CTA ──────────────────────────────────────────────
// Blog posts are 53% of entries but 75% of sessions are single-page
// (Clarity, Jun 2026): the content ranks and pulls big Google traffic,
// then dead-ends. These helpers inject a conversion card mid-article to
// turn that traffic into enquiries. Server-rendered <a>/<Link>, no client
// JS; the wa.me click is caught by the global outbound listener.
const BLOG_WA_DIGITS = DATA.contact.whatsappPhone.replace(/\D/g, "");
const blogWaUrl = (text: string) =>
  `https://wa.me/${BLOG_WA_DIGITS}?text=${encodeURIComponent(text)}`;
// Hindi-first opener, matching the site's WhatsApp default.
const DEFAULT_BLOG_WA_TEXT = "नमस्ते BIPE — 2027-28 सत्र (JEECUP 2027) की जानकारी चाहिए";

// Inject a conversion CTA just before the 2nd h2 — early enough to clear
// the ~40% scroll line Clarity showed readers stop at, on a clean section
// boundary. `hi` picks Hindi copy. Suppressed if the post already places
// its own cta block.
function withInlineCta(sections: BlogSection[], hi: boolean): BlogSection[] {
  if (sections.some((s) => s.type === "cta")) return sections;
  const h2s = sections.flatMap((s, idx) => (s.type === "h2" ? [idx] : []));
  const at = h2s.length >= 2 ? h2s[1] : Math.min(3, sections.length);
  const cta: BlogSection = hi
    ? {
        type: "cta",
        title: "पॉलिटेक्निक डिप्लोमा का सोच रहे हैं? 2027-28 के लिए BIPE से अभी बात करें।",
        body: "AICTE-approved · BTEUP code 4455 · Phoolpur, Varanasi में 4 diploma branches। 2026-27 के admission बंद हो चुके हैं — अगले सत्र (2027-28) के लिए admission team से हिंदी में बात करें, कोई pressure नहीं।",
        applyLabel: "2027-28 के लिए enquiry करें",
        waLabel: "WhatsApp पर बात करें",
      }
    : {
        type: "cta",
        title: "Planning your polytechnic diploma? Talk to BIPE about 2027-28.",
        body: "AICTE-approved · BTEUP code 4455 · four diploma branches in Phoolpur, Varanasi. Admissions for 2026-27 have closed — talk to us in Hindi or English about the next session, no pressure.",
      };
  return [...sections.slice(0, at), cta, ...sections.slice(at)];
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
    case "cta": {
      const waText = s.whatsappText || DEFAULT_BLOG_WA_TEXT;
      return (
        <div
          key={i}
          style={{
            margin: "32px 0",
            padding: "26px 28px",
            borderRadius: 18,
            background: "var(--brand)",
            color: "var(--paper)",
            boxShadow: "0 20px 44px -26px color-mix(in oklab, var(--brand) 75%, transparent)",
          }}
        >
          <div className="eyebrow" style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", marginBottom: 10 }}>
            2026-27 closed · 2027-28 enquiries
          </div>
          <div style={{ fontFamily: "var(--font-display, var(--font-sans))", fontWeight: 600, fontSize: 22, lineHeight: 1.22, maxWidth: "26ch" }}>
            {s.title}
          </div>
          {s.body && (
            <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.65, color: "color-mix(in oklab, var(--paper) 86%, transparent)", maxWidth: "54ch" }}>
              {s.body}
            </p>
          )}
          <div className="row" style={{ marginTop: 18, gap: 12, flexWrap: "wrap" }}>
            <Link href="/apply" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", border: "none", fontWeight: 600 }}>
              {s.applyLabel || "Enquire for 2027-28"} <ArrowIcon size={16} />
            </Link>
            <a href={blogWaUrl(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-wa">
              {s.waLabel || "WhatsApp admissions"}
            </a>
          </div>
        </div>
      );
    }
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
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: post.title,
    description: post.metaDescription,
    inLanguage: post.lang ?? "en-IN",
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
    // lang on the article subtree: the site chrome (nav/footer) stays
    // en-IN via the root <html>, but the post body carries its own
    // language so Hindi/Hinglish posts aren't read as English content.
    <article className="page-enter" lang={post.lang ?? "en-IN"}>
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
          {withInlineCta(
            post.sections,
            (post.lang ?? "").toLowerCase().startsWith("hi") || /[ऀ-ॿ]/.test(post.title),
          ).map((s, i) => renderSection(s, i))}
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
              Admission for 2026-27 is closed — JEECUP counselling ended in August 2026 and no seats
              remain this session. For the 2027-28 session via JEECUP 2027, BIPE&apos;s admissions team
              takes EN / हिंदी questions on WhatsApp every day. Or book a campus visit — ~35 minutes
              from Varanasi Cantt by auto or app-cab.
            </p>
            <div
              className="row"
              style={{ marginTop: 24, gap: 12, justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link href="/apply" className="btn btn-primary">
                Enquire for 2027-28 <ArrowIcon />
              </Link>
              <Link href="/visit" className="btn btn-ghost">
                Visit the campus <ArrowIcon />
              </Link>
              <Link href="/courses" className="btn btn-ghost">
                View all 4 polytechnic branches <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

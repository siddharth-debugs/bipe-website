import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { ArrowIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("blog"); }

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

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
      inLanguage:
        p.slug.includes("kya-hai") || p.slug.includes("kaise-kare") ? "hi-IN" : "en-IN",
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
      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
            {BLOG_POSTS.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

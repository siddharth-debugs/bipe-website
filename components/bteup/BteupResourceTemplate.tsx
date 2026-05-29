import Link from "next/link";
import React from "react";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import type { BteupResource } from "@/lib/bteup-resources";
import { otherBteupResources } from "@/lib/bteup-resources";
import BteupChecklist from "@/components/bteup/BteupChecklist";

/**
 * Shared template for every /bteup-* procedural-resource route.
 *
 * Pair of JeecupResourceTemplate.tsx — same visual rhythm, brand
 * tokens, and structural sections, but specialised for the Board
 * of Technical Education, Uttar Pradesh (BTEUP) hub: cross-links
 * point to other BTEUP resources, the back-link goes to BIPE's
 * /about/affiliations page (where the BTEUP relationship is
 * explained in detail), and the WhatsApp CTA is BTEUP-flavoured.
 *
 * Sections:
 *   1.  Hero (eyebrow + headline w/ italic serif accent + lead + CTAs)
 *   2.  Quick-stats grid (3-4 cards)
 *   2.5 Optional branch-links block (cards linking to per-branch content,
 *       e.g. /courses/[branch] syllabus pages from the BTEUP syllabus hub)
 *   3.  Process steps (5-8 numbered cards · serif italic numbers)
 *   4.  Optional checklist block — interactive, localStorage-backed
 *       (via BteupChecklist client component)
 *   5.  Optional contacts block (label/value pairs, with hrefs)
 *   6.  FAQ section (FAQPage JSON-LD baked in)
 *   7.  Other BTEUP resources cross-link grid
 *   8.  CTA block (apply / WhatsApp / affiliations)
 */
export default function BteupResourceTemplate({
  data,
}: {
  data: BteupResource;
}) {
  const others = otherBteupResources(data.slug);

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "BTEUP affiliations", path: "/about/affiliations" },
    { name: data.shortTitle, path: `/${data.slug}` },
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  /**
   * HowTo schema · added Phase 5 (May 2026).
   * See JeecupResourceTemplate.tsx for the full rationale — same
   * pattern, applied to BTEUP resource pages. Generated from
   * data.steps which every BteupResource carries.
   */
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.shortTitle,
    description: data.lead,
    step: data.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };

  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />

      {/* ====================================================================== */}
      {/* 1. HERO                                                                 */}
      {/* ====================================================================== */}
      <section
        className="section bipe-pad"
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: 72,
          paddingBottom: 56,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -180,
            top: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 26%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -160,
            bottom: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--accent) 28%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">{data.eyebrow}</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "26ch" }}>
            {data.headline}{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              {data.headlineAccent}
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "64ch" }}>
            {data.lead}
          </p>
          <div
            className="row"
            style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}
          >
            <Link href="/apply" className="btn btn-primary btn-lg">
              Start application <ArrowIcon size={16} />
            </Link>
            <Link href="/about/affiliations" className="btn btn-ghost btn-lg">
              About BIPE&rsquo;s BTEUP affiliation
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. QUICK STATS                                                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">At a glance · 2026 cycle</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            The{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              key numbers
            </span>{" "}
            you need.
          </h2>
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {data.quickStats.map((s) => (
              <article
                key={s.label}
                className="card"
                style={{ padding: 22, background: "var(--paper)" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--brand)",
                  }}
                >
                  {s.label}
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--ink-1)",
                    marginTop: 8,
                    lineHeight: 1.25,
                  }}
                >
                  {s.value}
                </div>
                {s.sub ? (
                  <div
                    style={{
                      marginTop: 8,
                      color: "var(--ink-3)",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {s.sub}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2.5 BRANCH LINKS (optional) — surfaces per-branch syllabus pages       */}
      {/* ====================================================================== */}
      {data.branchLinks ? (
        <section className="section">
          <div className="container">
            <div className="eyebrow">{data.branchLinks.eyebrow}</div>
            <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "28ch" }}>
              {data.branchLinks.heading}
            </h2>
            {data.branchLinks.intro ? (
              <p
                className="lead"
                style={{
                  marginTop: 18,
                  maxWidth: "70ch",
                  color: "var(--ink-2)",
                }}
              >
                {data.branchLinks.intro}
              </p>
            ) : null}
            <div
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 14,
              }}
            >
              {data.branchLinks.branches.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
                  className="card"
                  style={{
                    display: "block",
                    padding: "20px 22px",
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid var(--line)",
                    borderRadius: 14,
                    background: "var(--paper)",
                    transition:
                      "border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                    }}
                  >
                    BTEUP {b.code}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 17,
                      fontWeight: 600,
                      color: "var(--ink)",
                      lineHeight: 1.3,
                    }}
                  >
                    {b.label}
                  </div>
                  {b.summary ? (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 13.5,
                        color: "var(--ink-2)",
                        lineHeight: 1.55,
                      }}
                    >
                      {b.summary}
                    </div>
                  ) : null}
                  <div
                    aria-hidden="true"
                    style={{
                      marginTop: 14,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--brand)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    View 6-semester syllabus
                    <ArrowIcon />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ====================================================================== */}
      {/* 3. PROCESS STEPS                                                        */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">The step-by-step process</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            From start to finish —{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              in order.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "64ch" }}>
            Follow these steps in sequence. Skipping ahead is the most common
            cause of registration errors and missed deadlines.
          </p>
          <div style={{ marginTop: 36, display: "grid", gap: 22 }}>
            {data.steps.map((s) => (
              <article
                key={s.n}
                className="card"
                style={{
                  padding: 28,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 24,
                  alignItems: "start",
                }}
              >
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 44,
                    color: "var(--brand)",
                    lineHeight: 0.9,
                    minWidth: 52,
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="bipe-h3" style={{ fontSize: 20, lineHeight: 1.3 }}>
                    {s.title}
                  </h3>
                  <p
                    style={{
                      marginTop: 12,
                      color: "var(--ink-2)",
                      fontSize: 15,
                      lineHeight: 1.7,
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. CHECKLIST (optional)                                                 */}
      {/* ====================================================================== */}
      {data.checklist ? (
        <section className="section" style={{ background: "var(--paper-2)" }}>
          <div className="container">
            <div className="eyebrow">{data.checklist.eyebrow}</div>
            <h2
              className="bipe-h1"
              style={{ marginTop: 14, maxWidth: "30ch" }}
            >
              {data.checklist.heading.split(" ").slice(0, -2).join(" ")}{" "}
              <span
                className="serif"
                style={{
                  color: "var(--brand)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {data.checklist.heading.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            {data.checklist.intro ? (
              <p
                style={{
                  marginTop: 18,
                  color: "var(--ink-2)",
                  maxWidth: "70ch",
                  lineHeight: 1.7,
                }}
              >
                {data.checklist.intro}
              </p>
            ) : null}
            <BteupChecklist slug={data.slug} items={data.checklist.items} />
          </div>
        </section>
      ) : null}

      {/* ====================================================================== */}
      {/* 5. CONTACTS (optional)                                                  */}
      {/* ====================================================================== */}
      {data.contacts ? (
        <section className="section">
          <div className="container">
            <div className="eyebrow">{data.contacts.eyebrow}</div>
            <h2
              className="bipe-h1"
              style={{ marginTop: 14, maxWidth: "30ch" }}
            >
              {data.contacts.heading.split(" ").slice(0, -1).join(" ")}{" "}
              <span
                className="serif"
                style={{
                  color: "var(--brand)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {data.contacts.heading.split(" ").slice(-1).join(" ")}
              </span>
            </h2>
            <div
              style={{
                marginTop: 28,
                display: "grid",
                gap: 12,
                maxWidth: "78ch",
              }}
            >
              {data.contacts.items.map((item) => (
                <article
                  key={item.label}
                  className="card"
                  style={{
                    padding: "20px 24px",
                    background: "var(--paper)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--brand)",
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      style={{
                        color: "var(--ink-1)",
                        fontSize: 15,
                        lineHeight: 1.6,
                        textDecoration: "none",
                        borderBottom: "1px dashed var(--brand)",
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span
                      style={{
                        color: "var(--ink-2)",
                        fontSize: 15,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.value}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ====================================================================== */}
      {/* 6. FAQ                                                                  */}
      {/* ====================================================================== */}
      <section
        className="section"
        style={{ background: data.contacts ? "var(--paper-2)" : "var(--paper)" }}
      >
        <div className="container">
          <div className="eyebrow">Frequently asked</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "28ch" }}>
            What students ask{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              about this step.
            </span>
          </h2>
          <div
            style={{ marginTop: 28, display: "grid", gap: 14, maxWidth: "78ch" }}
          >
            {data.faqs.map((f, i) => (
              <article
                key={i}
                className="card"
                style={{ padding: "22px 26px", background: "var(--paper)" }}
              >
                <h3
                  className="bipe-h3"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.35,
                    color: "var(--ink-1)",
                  }}
                >
                  {f.q}
                </h3>
                <p
                  style={{
                    marginTop: 10,
                    color: "var(--ink-2)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {f.a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. OTHER BTEUP RESOURCES                                                */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Other BTEUP resources</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            The rest of the{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              regulatory journey.
            </span>
          </h2>
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {others.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.slug}`}
                className="card"
                style={{
                  padding: 22,
                  background: "var(--paper)",
                  textDecoration: "none",
                  display: "block",
                  transition: "transform 120ms ease",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--brand)",
                  }}
                >
                  BTEUP
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--ink-1)",
                    marginTop: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {r.shortTitle}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    color: "var(--ink-2)",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  Read the guide →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 8. CTA                                                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 28,
              border: "1px solid var(--line)",
              background: "var(--white)",
              padding: "48px 48px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -160,
                top: -120,
                width: 360,
                height: 360,
                borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 22%, transparent)",
                filter: "blur(110px)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -120,
                bottom: -120,
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "color-mix(in oklab, var(--accent) 32%, transparent)",
                filter: "blur(110px)",
                pointerEvents: "none",
              }}
            />
            <div
              className="bipe-split"
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: 48,
                alignItems: "center",
              }}
            >
              <div>
                <div className="eyebrow">{data.ctaTitle}</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                  Talk to{" "}
                  <span
                    className="serif"
                    style={{
                      color: "var(--brand)",
                      fontStyle: "italic",
                      fontWeight: 400,
                    }}
                  >
                    BIPE&rsquo;s academic office.
                  </span>
                </h2>
                <p
                  style={{
                    marginTop: 16,
                    color: "var(--ink-2)",
                    fontSize: 16,
                    lineHeight: 1.6,
                    maxWidth: "46ch",
                  }}
                >
                  {data.ctaBody}
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <Link
                  href="/apply"
                  className="btn btn-primary btn-lg"
                  style={{ justifyContent: "space-between" }}
                >
                  Start application <ArrowIcon size={16} />
                </Link>
                <a
                  href={`https://wa.me/919415202879?text=Hi%20BIPE%20%E2%80%94%20I%20have%20a%20BTEUP%20question%20about%20${encodeURIComponent(
                    data.shortTitle
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    background: "var(--accent)",
                    color: "var(--ink)",
                    justifyContent: "space-between",
                  }}
                >
                  WhatsApp academic office <WhatsAppIcon />
                </a>
                <Link
                  href="/about/affiliations"
                  className="btn btn-ghost btn-lg"
                  style={{ justifyContent: "space-between" }}
                >
                  BTEUP affiliation details <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

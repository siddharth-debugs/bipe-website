import Link from "next/link";
import React from "react";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import type { Catchment } from "@/lib/catchments";
import { otherCatchments } from "@/lib/catchments";

/**
 * Shared template for every /polytechnic-in-[town] route.
 *
 * Each catchment page imports this component, passes its own Catchment
 * data object (from lib/catchments.ts) and renders ~1,500-2,000 words
 * of structured content + FAQPage JSON-LD + BreadcrumbList JSON-LD +
 * internal links to the other five catchment pages.
 *
 * Visual / structural pattern is intentionally consistent with the
 * /why-bipe and /private-vs-government-polytechnic pages — same hero
 * blur tokens, same eyebrow + serif accent, same card style. Reader
 * who lands on multiple BIPE pages recognises the brand voice.
 */
export default function CatchmentTemplate({ data }: { data: Catchment }) {
  const others = otherCatchments(data.slug);

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    {
      name: `Polytechnic in ${data.town}`,
      path: `/polytechnic-in-${data.slug}`,
    },
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
          <div className="eyebrow">
            {data.town} catchment · {data.townHindi} · 2026-27
          </div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "26ch" }}>
            Polytechnic for {data.town} students —{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              BIPE Varanasi, {data.distanceKm} km away.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            BIPE&rsquo;s six-acre Phoolpur campus serves families across Eastern UP and Bihar,
            including {data.town} ({data.townHindi}) and its surrounding tehsils. Five BTE UP-
            affiliated diploma branches under JEECUP institute code 4455. On-campus boys&rsquo;
            hostel. AFRC-approved tuition of ₹30,150 per academic year.
          </p>
          <div
            className="row"
            style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}
          >
            <Link href="/visit" className="btn btn-primary btn-lg">
              Book a campus visit <ArrowIcon size={16} />
            </Link>
            <Link href="/apply" className="btn btn-ghost btn-lg">
              Start application
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. QUICK FACTS · the journey                                             */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">{data.town} → BIPE Phoolpur · journey at a glance</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            How far,{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              how long, how often.
            </span>
          </h2>
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              { label: "Distance", value: `${data.distanceKm} km`, sub: "by road from Phoolpur" },
              { label: "By road", value: data.roadTime, sub: data.highways.split(",")[0] },
              { label: "By train", value: data.railTime, sub: data.nearestStation },
              { label: "From Cantt", value: "~14 km · 35-45 min", sub: "BIPE shuttle on Sat" },
            ].map((s) => (
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
                <div style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 13, lineHeight: 1.5 }}>
                  {s.sub}
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              marginTop: 28,
              padding: "20px 26px",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              maxWidth: "78ch",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--brand)",
                marginBottom: 8,
              }}
            >
              Local context · {data.town}
            </div>
            <p
              style={{
                margin: 0,
                color: "var(--ink-2)",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              {data.econProfile}
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. WHY BIPE FOR THIS TOWN                                                */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Why families from {data.town} choose BIPE</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            What the diploma{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              actually buys you
            </span>{" "}
            from here.
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "64ch" }}>
            Every Eastern UP town has slightly different economic gravity. Below — four reasons BIPE
            is a fit for {data.town} families specifically, with the honest local context.
          </p>
          <div style={{ marginTop: 36, display: "grid", gap: 22 }}>
            {data.whyBipeReasons.map((r, i) => (
              <article
                key={r.headline}
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
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="bipe-h3" style={{ fontSize: 20, lineHeight: 1.3 }}>
                    {r.headline}
                  </h3>
                  <p
                    style={{
                      marginTop: 12,
                      color: "var(--ink-2)",
                      fontSize: 15,
                      lineHeight: 1.7,
                    }}
                  >
                    {r.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Branch-angle block + local context paragraph */}
          <div
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 18,
            }}
          >
            <article
              className="card"
              style={{
                padding: 24,
                background: "color-mix(in oklab, var(--brand) 5%, var(--paper))",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--brand)",
                  marginBottom: 8,
                }}
              >
                Branch fit · {data.town}
              </div>
              <p
                style={{
                  margin: 0,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {data.branchAngle}
              </p>
              <div style={{ marginTop: 14 }}>
                <Link href="/courses" className="btn btn-ghost" style={{ fontSize: 13 }}>
                  Explore all 5 branches <ArrowIcon size={13} />
                </Link>
              </div>
            </article>
            <article className="card" style={{ padding: 24, background: "var(--paper)" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: 8,
                }}
              >
                Local landscape
              </div>
              <p
                style={{
                  margin: 0,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {data.localContext}
              </p>
              <div style={{ marginTop: 14 }}>
                <Link
                  href="/private-vs-government-polytechnic"
                  className="btn btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  Compare with government polytechnic <ArrowIcon size={13} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. HOW TO REACH                                                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">From {data.town} to Phoolpur</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            The actual{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              door-to-door route.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "70ch", lineHeight: 1.7 }}>
            {data.transitNarrative}
          </p>
          <p style={{ marginTop: 18, color: "var(--ink-3)", maxWidth: "70ch", lineHeight: 1.6, fontSize: 14, fontStyle: "italic" }}>
            {data.alumniNote}
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4b. GOVERNMENT POLYTECHNIC OPTION IN THIS TOWN                          */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">
            Government polytechnic option · {data.town}
          </div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            What about{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              government polytechnic in {data.town}?
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "70ch", lineHeight: 1.7 }}>
            Most {data.town} families consider the government polytechnic
            option first — the fee gap is real, and so is the
            credibility of the government route. Here&rsquo;s the honest
            picture for {data.town}.
          </p>
          <div
            style={{
              marginTop: 28,
              padding: "24px 28px",
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--paper)",
              maxWidth: "78ch",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: 6,
              }}
            >
              The local government option
            </div>
            <h3
              className="bipe-h3"
              style={{ fontSize: 18, lineHeight: 1.3, color: "var(--ink-1)" }}
            >
              {data.governmentOption.primary}
            </h3>
            <p
              style={{
                marginTop: 12,
                color: "var(--ink-2)",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {data.governmentOption.description}
            </p>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
              maxWidth: "78ch",
            }}
          >
            <article
              className="card"
              style={{
                padding: 22,
                background: "var(--paper-2)",
                borderTop: "3px solid var(--ink-3)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: 8,
                }}
              >
                Choose government when
              </div>
              <p
                style={{
                  margin: 0,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {data.governmentOption.whenGovernment}
              </p>
            </article>
            <article
              className="card"
              style={{
                padding: 22,
                background: "color-mix(in oklab, var(--brand) 6%, var(--paper))",
                borderTop: "3px solid var(--brand)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--brand)",
                  marginBottom: 8,
                }}
              >
                Choose BIPE when
              </div>
              <p
                style={{
                  margin: 0,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {data.governmentOption.whenBipe}
              </p>
            </article>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link
              href="/government-polytechnic-in-eastern-up"
              className="btn btn-ghost"
              style={{ fontSize: 14 }}
            >
              See every government polytechnic in Eastern UP{" "}
              <ArrowIcon size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. FAQ                                                                  */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Questions from {data.town} families</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "28ch" }}>
            What parents ask{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              before applying.
            </span>
          </h2>
          <div style={{ marginTop: 28, display: "grid", gap: 14, maxWidth: "78ch" }}>
            {data.faqs.map((f, i) => (
              <article
                key={i}
                className="card"
                style={{ padding: "22px 26px", background: "var(--paper)" }}
              >
                <h3
                  className="bipe-h3"
                  style={{ fontSize: 17, lineHeight: 1.35, color: "var(--ink-1)" }}
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
      {/* 6. OTHER CATCHMENT CITIES                                                */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Other Eastern UP catchment cities</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            BIPE serves{" "}
            <span
              className="serif"
              style={{
                color: "var(--brand)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              twelve Eastern UP districts.
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
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/polytechnic-in-${c.slug}`}
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
                  {c.distanceKm} km · {c.roadTime.replace(/^~/, "")}
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--ink-1)",
                    marginTop: 6,
                  }}
                >
                  {c.town}{" "}
                  <span style={{ fontSize: 14, color: "var(--ink-3)", fontStyle: "italic" }}>
                    ({c.townHindi})
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    color: "var(--ink-2)",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  Polytechnic in {c.town} → <span style={{ color: "var(--brand)" }}>see why BIPE fits →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. CTA                                                                  */}
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
                background: "color-mix(in oklab, var(--accent) 32%, transparent)",
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
                <div className="eyebrow">From {data.town}? Come see the campus.</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                  Walk the labs.{" "}
                  <span
                    className="serif"
                    style={{
                      color: "var(--brand)",
                      fontStyle: "italic",
                      fontWeight: 400,
                    }}
                  >
                    Meet the cohort.
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
                  ~35 minutes from Varanasi Cantt by auto or app-cab. Sit in on a class, walk
                  through the workshops, eat at the mess. No enrolment pressure — we want your
                  decision to be informed.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <Link
                  href="/visit"
                  className="btn btn-primary btn-lg"
                  style={{ justifyContent: "space-between" }}
                >
                  Book a campus visit <ArrowIcon size={16} />
                </Link>
                <a
                  href={`https://wa.me/919005882866?text=Hi%20BIPE%20%E2%80%94%20I%20am%20from%20${encodeURIComponent(data.town)}%2C%20interested%20in%202026-27%20admissions.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    background: "var(--accent)",
                    color: "var(--ink)",
                    justifyContent: "space-between",
                  }}
                >
                  WhatsApp admissions <WhatsAppIcon />
                </a>
                <Link
                  href="/apply"
                  className="btn btn-ghost btn-lg"
                  style={{ justifyContent: "space-between" }}
                >
                  Start application <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

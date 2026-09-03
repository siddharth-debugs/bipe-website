import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DATA, PUBLIC_BRANCHES } from "@/lib/data";
import { getBranchesMapped } from "@/lib/content";
import { BRANCH_DETAIL } from "@/lib/branchContent";
import { SITE_URL } from "@/lib/routes";
import { Img } from "@/components/ui/Img";
import { CrossfadeSlider } from "@/components/ui/CrossfadeSlider";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import ClarityTag from "@/components/shell/ClarityTag";

type Params = { branch: string };

export async function generateStaticParams(): Promise<Params[]> {
  // PUBLIC_BRANCHES, not DATA.branches — this list decides which
  // /courses/<slug> routes exist at all. Anything outside it falls through
  // to notFound() below.
  return PUBLIC_BRANCHES.map((b) => ({ branch: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { branch } = await params;
  const branches = await getBranchesMapped();
  const b = branches.find((x) => x.slug === branch);
  // notFound(), not `return {}`. These routes render dynamically (the root
  // layout awaits headers() for x-pathname), so metadata resolves before
  // the page body — an empty object here silently inherited the layout's
  // HOMEPAGE title, canonical and `index, follow`, and the shell flushed
  // HTTP 200. Result: unknown slugs were indexable soft-404s. 3 Sep 2026.
  if (!b) notFound();
  const path = `/courses/${b.slug}`;
  // May 2026 keyword research: "diploma in civil engineering" 9,900/mo,
  // "diploma in computer science" 9,900/mo, "diploma in mechanical
  // engineering" 3,600/mo, "diploma in electrical engineering" 2,400/mo.
  // Title pattern rewritten to lead with the exact phrase searchers
  // type — "Diploma in <Branch>" — instead of "<Branch> Diploma".
  const title = `Diploma in ${b.name} · BTEUP ${b.code} | BIPE Varanasi`;
  // Phase 2 SEO audit (May 2026): branch meta descriptions were ~210
  // chars and getting truncated at Google's ~155-160 char cap. Rewrote
  // to stay under 145 chars across every branch, keeping the high-
  // value tokens (branch, BTEUP code, JEECUP 4455, AFRC fee, seats,
  // AICTE approval) and dropping the b.desc tail that was being cut.
  const description = `Diploma in ${b.name} (BTEUP ${b.code}) · BIPE Varanasi · JEECUP 4455 · AFRC ₹${b.fee}/yr · ${b.seats} seats · AICTE-approved.`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      // en-IN + x-default — see lib/seo.ts for full rationale. The
      // site has no SSR Hindi variant; declaring hi-IN here would be
      // hreflang-lying. x-default tells Google "this English page is
      // also the fallback for any unmapped language".
      languages: {
        "en-IN": path,
        "x-default": path,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "BIPE",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
  };
}

export default async function BranchPage(
  { params }: { params: Promise<Params> },
) {
  const { branch } = await params;
  const branches = await getBranchesMapped();
  const b = branches.find((x) => x.slug === branch);
  if (!b) notFound();
  const detail = BRANCH_DETAIL[branch];
  if (!detail) notFound();

  const path = `/courses/${b.slug}`;
  const canonical = `${SITE_URL}${path}`;

  // Course schema — enriched May 2026 with the fields Google made
  // *required* for Course rich snippets (late 2024 guidance update):
  //
  //   hasCourseInstance   — at minimum one CourseInstance with mode
  //                         + location + duration. Without it, Google
  //                         validates the schema but won't trigger
  //                         rich results in SERPs.
  //
  //   coursePrerequisites — text describing entry requirements. Helps
  //                         eligibility-clarity rich-result variants.
  //
  // educationalLevel set to "Diploma" so Google's Knowledge Graph
  // can disambiguate from undergraduate / postgraduate course entries.
  // The offers block now also includes availability + url so the
  // SERP-level pricing label is unambiguous.
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${canonical}#course`,
    name: `Diploma in ${b.name}`,
    description: detail.intro,
    courseCode: b.code,
    inLanguage: ["en-IN"],
    educationalLevel: "Diploma",
    educationalCredentialAwarded: "Diploma in Engineering (3-year, BTEUP)",
    coursePrerequisites:
      "Class 10 pass with Mathematics and Science (minimum 35% aggregate). " +
        "Admission via JEECUP Group A — choose BIPE institute code 4455 and BTEUP " +
        `branch code ${b.code} during counselling.`,
    occupationalCredentialAwarded: detail.careers[0],
    provider: {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}#org`,
      name: "Banaras Institute of Polytechnic & Engineering",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      category: "Tuition",
      price: b.fee.replace(/,/g, ""),
      priceCurrency: "INR",
      // Session 2026-27 admission is closed — JEECUP 2026 counselling
      // ended — so the tuition offer is not open. OutOfStock rather than
      // SoldOut: the cycle closed, which is not the claim that every seat
      // filled. Mirrors app/layout.tsx. Flip back when 2027-28 opens.
      availability: "https://schema.org/OutOfStock",
      url: `${canonical}#apply`,
    },
    // hasCourseInstance is the rich-result trigger. One instance per
    // branch — BIPE runs a single full-time on-campus cohort starting
    // each July/August. Duration P3Y = ISO 8601 for 3 years. We
    // deliberately don't put a hard startDate/endDate because the
    // page is evergreen — the cohort is "the current academic year"
    // perpetually. courseSchedule + repeatFrequency convey the
    // recurring pattern instead.
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Onsite",
        location: {
          "@type": "Place",
          name: "BIPE Phoolpur Campus, Varanasi",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Gajokhar, Phoolpur",
            addressLocality: "Varanasi",
            addressRegion: "Uttar Pradesh",
            postalCode: "221206",
            addressCountry: "IN",
          },
        },
        courseSchedule: {
          "@type": "Schedule",
          duration: "P3Y",
          repeatFrequency: "Yearly",
          repeatCount: 3,
        },
        instructor: {
          "@type": "Organization",
          name: "BIPE Faculty",
          url: `${SITE_URL}/faculty`,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Academics", item: `${SITE_URL}/courses` },
      { "@type": "ListItem", position: 3, name: b.name, item: canonical },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: detail.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Branch-aware WhatsApp deep link — opens the chat pre-filled with the
  // branch the visitor is reading, so the admissions counsellor has
  // context from the first message instead of a blank "नमस्ते". Clarity
  // (Jun 2026) showed chat is the hot next step from these pages.
  // Hindi-framed to match the site's WhatsApp default (see lib/data.ts —
  // English implicitly signals "not for you" to the Hindi-medium audience);
  // the English branch name is how the programmes are named everywhere.
  // Same WABA handset as DATA.contact.whatsapp (917310077788).
  const branchWaUrl = `https://wa.me/${DATA.contact.whatsappPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `नमस्ते BIPE — ${b.name} diploma (सत्र 2027-28) की जानकारी चाहिए`,
  )}`;

  return (
    <article className="page-enter">
      {/* Tag the Clarity session with this programme so replays/heatmaps
          can be filtered by branch. */}
      <ClarityTag value={b.name} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 80, paddingBottom: 32 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-2)", marginBottom: 24 }}>
            <Link href="/" style={{ color: "inherit" }}>Home</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <Link href="/courses" style={{ color: "inherit" }}>Academics</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--brand)" }}>{b.name}</span>
          </nav>

          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Academics · BTEUP {b.code}</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  {b.name}
                </span>{" "}
                diploma in Varanasi.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "56ch" }}>
                {detail.intro}
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary">Enquire for 2027-28 <ArrowIcon /></Link>
                <Link href="/jeecup" className="btn btn-ghost">JEECUP 4455 guidance <ArrowIcon /></Link>
                <a href={branchWaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  <WhatsAppIcon /> Ask on WhatsApp
                </a>
              </div>
              {/* Deeper-reading callout — only renders when the branch
                  data declares a long-form post. Added 2026-06-01 to
                  give topically-aligned blog posts a strong internal
                  link from the matching branch page; helps GSC move
                  "Crawled — currently not indexed" posts into the
                  index. See lib/branchContent.ts → deeperReading. */}
              {detail.deeperReading && (
                <Link
                  href={`/blog/${detail.deeperReading.slug}`}
                  style={{
                    display: "block",
                    marginTop: 22,
                    padding: "16px 20px",
                    borderRadius: 14,
                    border: "1px solid color-mix(in oklab, var(--brand) 22%, var(--line))",
                    background: "color-mix(in oklab, var(--brand) 4%, var(--white))",
                    textDecoration: "none",
                    color: "var(--ink)",
                    maxWidth: "56ch",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--brand)",
                      marginBottom: 6,
                    }}
                  >
                    Deep dive · Blog
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>
                    {detail.deeperReading.label} <ArrowIcon size={13} />
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ink-2)" }}>
                    {detail.deeperReading.summary}
                  </div>
                </Link>
              )}
            </div>

            <div>
              <CrossfadeSlider images={detail.labs.length ? b.slides : b.slides} aspectRatio="4/3" radius={18} priorityFirst />
            </div>
          </div>

          {/* Stat strip */}
          <div className="card" style={{ marginTop: 48, padding: 28, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { num: b.code, l: `BTEUP code · ${b.name.split(" ")[0]}` },
              { num: `${b.seats}`, l: "Seats · annual intake" },
              { num: `₹${b.fee}`, l: "Tuition · AFRC, per year" },
              { num: "4455", l: "JEECUP institute · BIPE" },
            ].map((s) => (
              <div key={s.l}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--brand)", lineHeight: 0.95 }}>
                  {s.num}
                </div>
                <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Curriculum ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Curriculum · BTE UP {b.code}</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            What you&apos;ll learn. <span className="serif">Six semesters.</span>
          </h2>
          <p className="lead" style={{ marginTop: 18, maxWidth: "62ch" }}>
            BTE UP polytechnic curriculum for code {b.code} — the six-semester sequence
            below covers theory, lab work and mandatory training. Semester 6 includes a
            6-month industrial training and a final project assessed by external examiners.
          </p>

          {/* Disclaimer + deep link to BTE UP for verifiable current syllabus */}
          <div
            style={{
              marginTop: 22,
              padding: "14px 18px",
              background: "color-mix(in oklab, var(--brand) 5%, var(--white))",
              border: "1px solid color-mix(in oklab, var(--brand) 18%, var(--line))",
              borderRadius: 12,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--brand)",
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                Indicative · verify against gazette
              </div>
              <p style={{ color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
                Subject names below follow the standard BTE UP polytechnic curriculum.
                For the exact subject list, codes and marks distribution applicable to
                your admission year, refer to the official BTE UP gazette.
              </p>
            </div>
            <a
              href={`https://bteup.ac.in/`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ flexShrink: 0 }}
            >
              Open bteup.ac.in <ArrowIcon size={12} />
            </a>
          </div>

          {/* Semester cards — 3-col desktop, 2-col tablet, 1-col mobile */}
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {detail.semesters.map((s) => (
              <div
                key={s.semester}
                className="card"
                style={{
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div
                      className="serif"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 28,
                        color: "var(--brand)",
                        lineHeight: 1,
                      }}
                    >
                      Semester {s.semester}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--ink-3)",
                      }}
                    >
                      {s.theme}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "var(--accent-deep)",
                      background: "color-mix(in oklab, var(--accent) 14%, transparent)",
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {s.subjects.length} subjects
                  </span>
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {s.subjects.map((subj, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "var(--ink-1)",
                        paddingLeft: 16,
                        position: "relative",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 8,
                          width: 5,
                          height: 5,
                          borderRadius: 999,
                          background: "var(--accent)",
                        }}
                      />
                      {subj}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Labs & Facilities ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Labs & Facilities</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            Where the diploma <span className="serif">is taught.</span>
          </h2>
          <div className="grid" style={{ marginTop: 32, gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {detail.labs.map((l) => (
              <div key={l.name} className="card" style={{ padding: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{l.name}</div>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{l.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/campus" className="btn btn-ghost">See all campus facilities <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      {/* ─── Careers & Recruiters ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <div className="eyebrow">Careers</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                What alumni <span className="serif">do next.</span>
              </h2>
              <ul style={{ marginTop: 24, listStyle: "none", padding: 0 }}>
                {detail.careers.map((c, i) => (
                  <li key={i} style={{ padding: "14px 0", borderTop: i === 0 ? "1px solid var(--line)" : "none", borderBottom: "1px solid var(--line)", fontSize: 15, lineHeight: 1.6 }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow">Recruiters</div>
              <h3 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch", fontSize: 36 }}>
                Where they <span className="serif">work.</span>
              </h3>
              <div className="row" style={{ marginTop: 24, flexWrap: "wrap", gap: 10 }}>
                {detail.recruiters.map((r) => (
                  <span key={r} className="pill" style={{ background: "var(--white)", border: "1px solid var(--line)" }}>{r}</span>
                ))}
              </div>
              <div style={{ marginTop: 28 }}>
                <Link href="/placements" className="btn btn-ghost">All recruiters & placement record <ArrowIcon /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Eligibility, Fees, Apply ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, background: "color-mix(in oklab, var(--brand) 8%, var(--white))" }}>
            <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
              <div>
                <div className="eyebrow">Eligibility &amp; Admission</div>
                <h2 className="bipe-h1" style={{ marginTop: 12, fontSize: 36, maxWidth: "16ch" }}>
                  Class 10 pass. <span className="serif">JEECUP 4455.</span>
                </h2>
                <p style={{ marginTop: 16, color: "var(--ink-2)", lineHeight: 1.7 }}>
                  Eligibility for the {b.name} diploma is a Class 10 pass with Mathematics and Science. Admission is through JEECUP Group A — choose institute code 4455 and the {b.name} branch during counselling (BTEUP curriculum code {b.code}). AICTE permanent ID 1-488233171.
                </p>
                <div className="row" style={{ marginTop: 22, gap: 10, flexWrap: "wrap" }}>
                  <Link href="/admission" className="btn btn-ghost">Admission process <ArrowIcon /></Link>
                  <Link href="/documents" className="btn btn-ghost">Documents checklist <ArrowIcon /></Link>
                </div>
              </div>
              <div>
                <div className="eyebrow">Fees & Scholarships</div>
                <h2 className="bipe-h1" style={{ marginTop: 12, fontSize: 36, maxWidth: "16ch" }}>
                  ₹{b.fee}/year. <span className="serif">AFRC-set.</span>
                </h2>
                <p style={{ marginTop: 16, color: "var(--ink-2)", lineHeight: 1.7 }}>
                  Tuition is ₹{b.fee} per year — the same AFRC-approved figure for every branch at BIPE. UP Government post-matric scholarships cover full or partial tuition for SC, ST, OBC, EWS and Minority students. Hostel and mess fees are separate.
                </p>
                <div className="row" style={{ marginTop: 22, gap: 10, flexWrap: "wrap" }}>
                  <Link href="/fees" className="btn btn-ghost">Full fee breakdown <ArrowIcon /></Link>
                  <Link href="/scholarships" className="btn btn-ghost">Scholarships <ArrowIcon /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">FAQ · {b.name}</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            Asked <span className="serif">& answered.</span>
          </h2>
          <div style={{ marginTop: 32, maxWidth: 800 }}>
            {detail.faqs.map((f) => (
              <details key={f.q} style={{ borderTop: "1px solid var(--line)", padding: "20px 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 16, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {f.q}
                  <span style={{ marginLeft: 12, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand)" }}>+</span>
                </summary>
                <p style={{ marginTop: 12, color: "var(--ink-2)", lineHeight: 1.7 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Closing CTA ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, textAlign: "center", background: "var(--brand)", color: "#fff" }}>
            <h2 className="bipe-h1" style={{ color: "#fff", maxWidth: "20ch", margin: "0 auto" }}>
              Three years. <span className="serif">One diploma. A career.</span>
            </h2>
            <p style={{ marginTop: 18, opacity: 0.85, maxWidth: "48ch", margin: "18px auto 0", lineHeight: 1.7 }}>
              {`JEECUP 2026 counselling has ended and the ${b.name} cohort is in class. Register your interest in session 2027-28 — five minutes, and a personal guidance call within 24 hours.`}
            </p>
            <div className="row" style={{ marginTop: 28, gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/apply" className="btn btn-primary" style={{ background: "#fff", color: "var(--brand)" }}>Enquire about {b.name} <ArrowIcon /></Link>
              <a href={branchWaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
              <Link href="/visit" className="btn btn-ghost" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>Visit the campus <ArrowIcon /></Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

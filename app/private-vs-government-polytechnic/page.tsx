import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("privateVsGovernment");
}

/**
 * /private-vs-government-polytechnic — the real comparison surface.
 *
 * Companion to the repositioned /why-bipe (which is now a category-
 * leader brand page). Where /why-bipe argues "BIPE is the chosen
 * private polytechnic", THIS page addresses the actual decision
 * families are making at the funnel bottom:
 *
 *   "Government Polytechnic Varanasi (~₹12,000-22,000/year) or
 *    BIPE (AFRC ₹30,150/year)?"
 *
 * That's the real competitive set for BIPE — not other private
 * polytechnics. Government polytechnics carry ~50-80% lower tuition
 * and the "sarkari = real" prestige myth, both of which are bigger
 * conversion blockers than anything Kashi/SHEAT/VNITM can do.
 *
 * Editorial stance (per user direction 25 May 2026):
 *   - Fee anchor: sourced range with footnote (not a single figure)
 *   - Comparator: Government Polytechnic Varanasi specifically
 *   - Tone: soft on GP weaknesses, BIPE strengths-first
 *
 * Helpful-Content moves baked in:
 *   - Acknowledges GP wins on cost (doesn't dodge the fee gap)
 *   - States honestly what's IDENTICAL between government and
 *     private (defuses the prestige myth — same BTEUP diploma,
 *     same SSC JE eligibility, same lateral entry to B.Tech)
 *   - "When government is the right choice" section is a trust
 *     move that earns the rest of the page credibility
 *   - Every BIPE claim links to a source-of-truth page on the site
 */

interface IdenticalRow {
  topic: string;
  detail: string;
}

const IDENTICAL: IdenticalRow[] = [
  {
    topic: "The diploma certificate itself",
    detail:
      "Both BIPE and Government Polytechnic Varanasi are affiliated to Board of Technical Education, Uttar Pradesh (BTE UP). The diploma issued at the end of three years is the same BTEUP-stamped certificate — same paper, same authority, same legal weight.",
  },
  {
    topic: "Entrance exam",
    detail:
      "Both institutes admit students through JEECUP (UPJEE Polytechnic), conducted annually by the Joint Entrance Examination Council, Uttar Pradesh. BIPE's institute code is 4455. Counselling rounds are common across all UP polytechnics.",
  },
  {
    topic: "Syllabus & semester structure",
    detail:
      "Both follow the BTE UP-prescribed syllabus for each branch (Civil, Electrical, Mechanical Production, Computer Science & Engineering, Dairy). Six semesters over three years. Same paper codes, same minimum-pass marks, same external practicals.",
  },
  {
    topic: "Government job eligibility",
    detail:
      "SSC JE, RRB JE (Indian Railways), UPPCL JE, UP PWD, Army Technical Entry, Navy SSR — none of these exams ask whether your diploma is from a government or private polytechnic. Eligibility is the BTEUP diploma, full stop. Pay scale on selection is identical.",
  },
  {
    topic: "Lateral entry to B.Tech",
    detail:
      "20% of AKTU second-year B.Tech seats are reserved for diploma holders via UPCET Lateral Entry — open to graduates of every BTEUP-affiliated polytechnic, government or private. The pathway is determined by your UPCET score, not by which polytechnic stamped your diploma.",
  },
  {
    topic: "AICTE approval",
    detail:
      "Both institutes carry AICTE approval (Government Polytechnic Varanasi is a state-government institute; BIPE holds AICTE Permanent Approval ID 1-488233171). Both file AISHE returns annually. Both publish AICTE Annexure-18 mandatory disclosure.",
  },
];

interface DifferenceRow {
  topic: string;
  bipe: string;
  context: string;
  verifyLabel: string;
  verifyPath: string;
}

const DIFFERENCES: DifferenceRow[] = [
  {
    topic: "Cohort size & mentor accessibility",
    bipe:
      "Smaller per-branch cohorts. Faculty mentors are named, contactable, and meet students individually. The parent hotline rings the warden or principal directly — not a switchboard.",
    context:
      "Government polytechnics across UP typically run larger per-branch cohorts because of higher applicant volume at lower fee. Mentor allocation policy varies by institute.",
    verifyLabel: "See the faculty list",
    verifyPath: "/faculty",
  },
  {
    topic: "Branch portfolio · Dairy Engineering moat",
    bipe:
      "Five branches including Dairy Engineering — one of only four BTE UP-affiliated Dairy diploma programmes in all of Uttar Pradesh. Pilot dairy plant on campus; Amul / Mother Dairy / NDDB recruiter pipeline that comes with it.",
    context:
      "Government Polytechnic Varanasi offers the standard four engineering branches. Dairy Engineering is not commonly available in UP government polytechnics outside the dedicated state agricultural-engineering institutes.",
    verifyLabel: "Explore the five branches",
    verifyPath: "/courses",
  },
  {
    topic: "On-campus hostel · for outstation families",
    bipe:
      "Boys' hostel on the Phoolpur campus — furnished rooms, on-campus mess, 24×7 security, resident warden. For families more than two hours from Varanasi, hostel access is the difference between a doable diploma and an impossible one.",
    context:
      "Government Polytechnic Varanasi's hostel arrangements vary year to year — confirm directly with the institute before counselling. Government Girls Polytechnic Varanasi has its own girls' hostel.",
    verifyLabel: "See hostel & facilities",
    verifyPath: "/hostel",
  },
  {
    topic: "Placement infrastructure",
    bipe:
      "1,331 verified placements over 16 years across Mahindra, Tata Steel, BEL, Indian Railways, Amul, Mother Dairy, UPPCL, Ola Electric, Ather and forty other recruiters. Year-wise named alumni list with named recruiters is public on the site.",
    context:
      "Placement cells at government polytechnics in UP operate effectively for many students — particularly via central-government JE exams — but typically rely on the student-led application route rather than on-campus drive intensity. Detailed published placement records vary by institute.",
    verifyLabel: "See named alumni list",
    verifyPath: "/alumni",
  },
  {
    topic: "Lab equipment refresh cycle",
    bipe:
      "Private institutes can update lab equipment independent of state procurement cycles. BIPE's mechanical workshop, dairy pilot plant, 120-computer CSE lab, electrical lab and civil survey yard are kept current to industry-standard practice.",
    context:
      "Government institute equipment refresh is governed by state procurement timelines — which can be slower but is fully funded when it happens. Both models have trade-offs.",
    verifyLabel: "See campus & facilities",
    verifyPath: "/campus",
  },
  {
    topic: "Application support & responsiveness",
    bipe:
      "WhatsApp counsellor on +91-9415202879 (EN / हिंदी). Application call within 24 hours. Travel guidance from Varanasi Cantt for campus visits during admission season. Transparent fee receipts.",
    context:
      "Government polytechnic admissions are run through the JEECUP counselling system and state portals — formal but less hand-held. Families comfortable navigating government online systems may find this entirely sufficient.",
    verifyLabel: "Visit the campus",
    verifyPath: "/visit",
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question:
      "Is a government polytechnic diploma worth more than a private polytechnic diploma?",
    answer:
      "No. Both BIPE and Government Polytechnic Varanasi are affiliated to BTE UP — the diploma certificate is the same. Government employers (SSC, RRB, UPPCL, Army Technical Entry) do not distinguish between government and private polytechnics for JE-cadre exam eligibility. The certificate has identical legal weight.",
  },
  {
    question:
      "How much cheaper is Government Polytechnic Varanasi compared to BIPE?",
    answer:
      "Government polytechnics in UP typically charge between ₹12,000 and ₹22,000 per year in total fees, depending on the specific institute, branch and student category. BIPE's AFRC-approved tuition is ₹30,150 per year. Verify the current Government Polytechnic Varanasi fee structure directly on their institute notice or the BTE UP fee notification before deciding.",
  },
  {
    question:
      "If I take a government polytechnic seat, will I still be eligible for B.Tech lateral entry?",
    answer:
      "Yes. AKTU's 20% second-year B.Tech lateral-entry quota for diploma holders is available to graduates of every BTEUP-affiliated polytechnic — government or private. Your UPCET Lateral Entry exam score determines your B.Tech college, not which polytechnic issued your diploma.",
  },
  {
    question:
      "When should I choose Government Polytechnic Varanasi over BIPE?",
    answer:
      "When the fee gap of ~₹15,000-25,000 per year is the binding constraint on whether the diploma is affordable at all, and your JEECUP rank is strong enough to guarantee a government polytechnic seat, and your family is in or near Varanasi (so hostel access isn't required). In that scenario the government seat is the right choice. We say this openly because the diploma itself is the same — the right question is which delivery model fits your family's situation.",
  },
  {
    question:
      "When should I choose BIPE over a government polytechnic?",
    answer:
      "When the additional ~₹20,000-25,000 per year can be stretched, AND you want one or more of: a dedicated on-campus placement cell with a documented record of 1,331 placements; on-campus boys' hostel because you're coming from outside Varanasi; smaller cohort sizes with named faculty mentors; or the rare Dairy Engineering branch with the Amul / Mother Dairy / NDDB recruiter pipeline.",
  },
  {
    question:
      "Does BIPE offer scholarships to reduce the fee gap?",
    answer:
      "Yes. The full UP Government Post-Matric scholarship covers tuition for eligible SC / ST / OBC / Minority / EWS students, applied via the Samaj Kalyan portal. We assist with the application at admission time. For many families, this brings net out-of-pocket fees close to the government polytechnic figure.",
  },
];

export default function Page() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    {
      name: "Private vs Government Polytechnic",
      path: "/private-vs-government-polytechnic",
    },
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
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
        style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}
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
          <div className="eyebrow">Honest comparison · 2026 · Varanasi</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "26ch" }}>
            Government Polytechnic Varanasi or BIPE?{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              The honest math.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            For most families and Bihar, this is the real polytechnic
            admission decision — a government seat at roughly half to one-fifth the fee,
            or a BIPE seat with a documented placement infrastructure. Below: what&rsquo;s
            identical between the two, what&rsquo;s different, and when each is the right
            choice. We say this openly because the diploma is the same — the question is
            which delivery model fits your situation.
          </p>
          <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
            <Link href="/visit" className="btn btn-primary btn-lg">
              Book a campus visit <ArrowIcon size={16} />
            </Link>
            <Link href="/fees" className="btn btn-ghost btn-lg">
              See BIPE fee structure
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. THE FEE REALITY                                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">The fee gap · acknowledged</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            Government wins on cost.{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              That&rsquo;s the truth.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            Most pages on private-institute websites either dodge the fee question or
            bury it in fine print. We&rsquo;ll start with it instead.
          </p>

          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 18,
            }}
          >
            <article
              className="card"
              style={{
                padding: 28,
                background: "var(--paper)",
                borderLeft: "4px solid var(--ink-3)",
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
                Government Polytechnic Varanasi
              </div>
              <div
                className="serif"
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: "var(--ink-1)",
                  lineHeight: 1.15,
                }}
              >
                ~₹12,000–22,000<span style={{ fontSize: 16, color: "var(--ink-3)" }}> /year</span>
              </div>
              <p
                style={{
                  marginTop: 10,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Typical range across UP government polytechnics including tuition + exam
                + lab + library fees. Varies by institute, branch and student category.{" "}
                <strong>Verify the current GP Varanasi figure directly</strong> before
                deciding — fees update each academic year on the BTE UP fee notification.
              </p>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: "var(--ink-3)",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                }}
              >
                Source: typical UP state government polytechnic fee structures published
                on BTE UP and institute notice boards. BIPE does not set or audit these
                figures — please confirm with Government Polytechnic Varanasi directly.
              </p>
            </article>

            <article
              className="card"
              style={{
                padding: 28,
                background: "color-mix(in oklab, var(--brand) 6%, var(--paper))",
                borderLeft: "4px solid var(--brand)",
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
                BIPE · AFRC-approved
              </div>
              <div
                className="serif"
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: "var(--ink-1)",
                  lineHeight: 1.15,
                }}
              >
                ₹30,150<span style={{ fontSize: 16, color: "var(--ink-3)" }}> /year</span>
              </div>
              <p
                style={{
                  marginTop: 10,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                AFRC-approved tuition. No capitation, no donation, no &lsquo;development
                fund&rsquo;. Hostel and mess billed separately and disclosed line by line.
                Receipts for every payment. Full UP Post-Matric scholarship eligible for
                SC / ST / OBC / Minority / EWS — net out-of-pocket can come close to
                government figure for eligible students.
              </p>
              <p style={{ marginTop: 14 }}>
                <Link href="/fees" className="btn btn-ghost" style={{ fontSize: 13 }}>
                  See full fee structure <ArrowIcon size={13} />
                </Link>
              </p>
            </article>
          </div>

          <div
            style={{
              marginTop: 28,
              padding: "22px 28px",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              maxWidth: "70ch",
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
              The gap, 3-year total
            </div>
            <p style={{ margin: 0, color: "var(--ink-1)", fontSize: 15, lineHeight: 1.65 }}>
              Over a full 3-year diploma, the fee difference works out to roughly{" "}
              <strong>₹24,000–₹55,000 in additional tuition</strong> at BIPE versus a
              government polytechnic — meaningful for any family, defining for some. The
              rest of this page lays out what that delta pays for, and when it&rsquo;s
              worth it (and when it isn&rsquo;t).
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. WHAT'S IDENTICAL                                                     */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Defusing the prestige myth</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            Six things that are{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              identical
            </span>{" "}
            either way.
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "64ch" }}>
            There is a common belief that a government polytechnic diploma &ldquo;counts
            for more&rdquo; than a private one. For these six things, that is not the
            case — the underlying authority, eligibility and pathway are exactly the same.
          </p>
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 18,
            }}
            className="bipe-grid-2"
          >
            {IDENTICAL.map((row, i) => (
              <article
                key={row.topic}
                className="card"
                style={{
                  padding: 24,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 18,
                  alignItems: "start",
                }}
              >
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 30,
                    color: "var(--brand)",
                    lineHeight: 0.95,
                    minWidth: 38,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3
                    className="bipe-h3"
                    style={{ fontSize: 17, lineHeight: 1.3, marginTop: 2 }}
                  >
                    {row.topic}
                  </h3>
                  <p
                    style={{
                      marginTop: 10,
                      color: "var(--ink-2)",
                      fontSize: 14,
                      lineHeight: 1.65,
                    }}
                  >
                    {row.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. WHAT'S DIFFERENT                                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Where the fee delta goes</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            Six things that{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              are different
            </span>{" "}
            — and what each is worth.
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "64ch" }}>
            These are the operational differences between BIPE and a typical UP
            government polytechnic. Each row states BIPE&rsquo;s specific position, the
            honest local context, and links to where you can verify BIPE&rsquo;s side
            yourself. We can&rsquo;t verify the government side for you — that part
            requires a direct enquiry at Government Polytechnic Varanasi.
          </p>
          <div style={{ marginTop: 36, display: "grid", gap: 22 }}>
            {DIFFERENCES.map((row, i) => (
              <article
                key={row.topic}
                className="card"
                style={{
                  padding: 28,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 24,
                  alignItems: "start",
                  background: "var(--paper)",
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
                  <h3 className="bipe-h3" style={{ fontSize: 22, lineHeight: 1.25 }}>
                    {row.topic}
                  </h3>
                  <div
                    style={{
                      marginTop: 14,
                      padding: "14px 18px",
                      background: "color-mix(in oklab, var(--brand) 5%, transparent)",
                      borderLeft: "3px solid var(--brand)",
                      borderRadius: "0 8px 8px 0",
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
                      BIPE
                    </div>
                    <p
                      style={{
                        color: "var(--ink-1)",
                        fontSize: 15,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {row.bipe}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: 14,
                      padding: "14px 18px",
                      background: "var(--paper-2)",
                      borderRadius: 8,
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
                      Government polytechnic context
                    </div>
                    <p
                      style={{
                        color: "var(--ink-2)",
                        fontSize: 14,
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {row.context}
                    </p>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Link
                      href={row.verifyPath}
                      className="btn btn-ghost"
                      style={{ fontSize: 14 }}
                    >
                      {row.verifyLabel} <ArrowIcon size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. WHEN GOVERNMENT IS RIGHT                                              */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">The honest framework</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            When each choice{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              is the right one.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "64ch" }}>
            There&rsquo;s no universal answer — and any institute that tells you there is
            should be a warning sign. Two honest scenarios, side by side:
          </p>
          <div
            className="bipe-grid-2"
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            <article
              className="card"
              style={{
                padding: 28,
                background: "var(--paper-2)",
                borderTop: "4px solid var(--ink-3)",
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
                Take the government seat when
              </div>
              <h3 className="bipe-h3" style={{ fontSize: 20, lineHeight: 1.3 }}>
                Cost is the binding constraint.
              </h3>
              <ul
                style={{
                  marginTop: 14,
                  paddingLeft: 20,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                <li>
                  The ₹15,000–25,000/year delta would force a real financial trade-off in
                  your family.
                </li>
                <li>
                  Your JEECUP rank is strong enough to secure a government polytechnic
                  seat with confidence.
                </li>
                <li>
                  You live in or near Varanasi, so on-campus hostel isn&rsquo;t a
                  requirement.
                </li>
                <li>
                  You&rsquo;re comfortable with placement via self-driven applications +
                  central-government JE exams, rather than on-campus drive intensity.
                </li>
                <li>
                  The branch you want is offered at Government Polytechnic Varanasi (Civil,
                  Electrical, Mechanical or CSE — not Dairy).
                </li>
              </ul>
              <p
                style={{
                  marginTop: 18,
                  fontSize: 13,
                  fontStyle: "italic",
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                }}
              >
                The diploma you earn at the end is the same BTEUP certificate. For this
                profile, the government route is genuinely the better choice.
              </p>
            </article>

            <article
              className="card"
              style={{
                padding: 28,
                background: "color-mix(in oklab, var(--brand) 6%, var(--paper))",
                borderTop: "4px solid var(--brand)",
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
              <h3 className="bipe-h3" style={{ fontSize: 20, lineHeight: 1.3 }}>
                Placement infrastructure and hostel are decisive.
              </h3>
              <ul
                style={{
                  marginTop: 14,
                  paddingLeft: 20,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                <li>
                  The additional ₹20,000–25,000/year is stretchable, especially with the
                  UP Post-Matric scholarship for eligible categories.
                </li>
                <li>
                  Coming from outside Varanasi — on-campus hostel
                  access is non-negotiable.
                </li>
                <li>
                  You want a documented placement record with 1,331 named alumni at
                  named recruiters, not a self-driven job search.
                </li>
                <li>
                  Small cohorts and named faculty mentors matter for how your child
                  learns.
                </li>
                <li>
                  You specifically want Dairy Engineering — one of only four BTE UP-
                  affiliated Dairy programmes in all of UP.
                </li>
              </ul>
              <p
                style={{
                  marginTop: 18,
                  fontSize: 13,
                  fontStyle: "italic",
                  color: "var(--brand)",
                  lineHeight: 1.6,
                }}
              >
                For this profile, the fee delta pays for the infrastructure that turns a
                diploma into a job within three years.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. FAQ                                                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Common questions · 2026</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            What families ask{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              before deciding.
            </span>
          </h2>
          <div style={{ marginTop: 28, display: "grid", gap: 14, maxWidth: "76ch" }}>
            {FAQS.map((f, i) => (
              <article
                key={i}
                className="card"
                style={{ padding: "22px 26px", background: "var(--paper)" }}
              >
                <h3
                  className="bipe-h3"
                  style={{ fontSize: 17, lineHeight: 1.35, color: "var(--ink-1)" }}
                >
                  {f.question}
                </h3>
                <p
                  style={{
                    marginTop: 10,
                    color: "var(--ink-2)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {f.answer}
                </p>
              </article>
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
                <div className="eyebrow">Still comparing?</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                  Visit BIPE in person.{" "}
                  <span
                    className="serif"
                    style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                  >
                    Then decide.
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
                  Easy access from Varanasi Cantt — ~35 minutes by auto / app-cab.
                  See the workshops, talk to current students, eat at the mess. No
                  enrolment pressure — comparison decisions are too important for
                  one-sided information.
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
                  href="https://wa.me/919415202879?text=Hi%20BIPE%20%E2%80%94%20I%20am%20deciding%20between%20a%20government%20polytechnic%20and%20BIPE.%20Can%20you%20help%20me%20compare%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    background: "var(--accent)",
                    color: "var(--ink)",
                    justifyContent: "space-between",
                  }}
                >
                  WhatsApp counsellor <WhatsAppIcon />
                </a>
                <Link
                  href="/scholarships"
                  className="btn btn-ghost btn-lg"
                  style={{ justifyContent: "space-between" }}
                >
                  See scholarship options <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

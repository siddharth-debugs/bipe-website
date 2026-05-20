import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("whyBipe");
}

/**
 * /why-bipe — comparison-intent capture page.
 *
 * Phase 1.5 keyword analysis (May 2026) identified the "best /
 * top / private polytechnic college in Varanasi" cluster as
 * comparison-intent — high conversion, low competition, no Varanasi
 * polytechnic currently owns a dedicated comparison surface. This
 * page targets that gap.
 *
 * Tone: honest, specific, no astroturfing. Each row of the
 * comparison block names competitors directly (Kashi Institute,
 * SHEAT, VNITM, Government Girls Polytechnic) and acknowledges
 * what they do well alongside what BIPE does differently.
 */

interface ComparisonAnchor {
  topic: string;
  bipe: string;
  competitorContext: string;
}

const ANCHORS: ComparisonAnchor[] = [
  {
    topic: "Affiliation & approval",
    bipe:
      "BTE UP Affiliated · AICTE Permanent ID 1-488233171 · EoA 2026-27 dated 16 Mar 2026 · AISHE registered. Verifiable on the AICTE dashboard.",
    competitorContext:
      "All five private polytechnics in Varanasi are AICTE-approved and BTE UP affiliated. This is the baseline; verify on each institute's /approvals page.",
  },
  {
    topic: "Tuition fee transparency",
    bipe:
      "AFRC-approved ₹30,150 / academic year. Published on /fees, no capitation, no hidden charges. Hostel and mess are billed separately and disclosed.",
    competitorContext:
      "Many private polytechnics quote a base fee but add capitation, donation, or 'development fund' charges at admission. Always ask for the AFRC-approved fee structure before paying.",
  },
  {
    topic: "Five branches offered",
    bipe:
      "Civil, Computer Science & Engineering, Electrical, Mechanical (Production), and the rare Dairy Engineering — one of only four BTE UP-affiliated Dairy diploma programmes in all of Uttar Pradesh.",
    competitorContext:
      "Kashi Institute of Technology overlaps on Civil / CSE / Mech / Electrical and also runs D.Pharm. SHEAT and VNITM cover the same four engineering branches. Dairy Engineering is BIPE's structural differentiator.",
  },
  {
    topic: "On-campus hostel",
    bipe:
      "Boys' hostel on the Phoolpur campus — furnished rooms, on-campus mess, 24×7 security, resident warden. Parent hotline rings the warden's desk directly.",
    competitorContext:
      "SHEAT and Kashi Institute also offer hostel options. Government Girls Polytechnic Varanasi has girls' hostel (BIPE does not). For out-of-Varanasi families, ask each institute to confirm room availability before counselling.",
  },
  {
    topic: "Placement record",
    bipe:
      "1,000+ verified alumni placements across Mahindra, Tata Steel, BEL, Indian Railways, Tata Motors, Amul, Mother Dairy, UPPCL, Ola Electric, Ather and others. Year-wise alumni list with names and recruiters is on /alumni.",
    competitorContext:
      "Verify any institute's placement claims by asking for: (1) named alumni list, (2) recruiter logos with year attribution, (3) on-campus drive history. /placements links to BIPE's full record.",
  },
  {
    topic: "Lateral entry to B.Tech",
    bipe:
      "16 BIPE alumni from 2019-2025 batches have moved to B.Tech via AKTU and other UP state universities — full table on /blog/diploma-to-btech-lateral-entry-up-aktu.",
    competitorContext:
      "Lateral entry to B.Tech is open to graduates of every BTE UP-affiliated polytechnic. The pathway is determined by AKTU/state CET, not by your diploma institute.",
  },
  {
    topic: "Campus & catchment",
    bipe:
      "Six acres at Phoolpur, ~14 km from Varanasi Cantt station. Free shuttle for visits. 550+ students from twelve Eastern UP districts plus Bihar.",
    competitorContext:
      "Kashi Institute is on Lahartara road, VNITM is at Pandeypur, SHEAT is on Sarnath bypass. Each has its own catchment. Phoolpur is more rural — quieter campus, longer commute from city.",
  },
  {
    topic: "Founding & ownership",
    bipe:
      "Founded 2010 by the Purwanchal Educational Trust. 16 years on record, AISHE submitted annually, mandatory disclosure published per AICTE Annexure-18.",
    competitorContext:
      "Founding year, ownership and disclosure are public for every approved institute. Insist on seeing the AICTE EoA letter (current year) and the mandatory disclosure before payment.",
  },
];

const QUESTIONS_TO_ASK: string[] = [
  "Show me the AICTE EoA letter for the current academic year (not the original approval).",
  "What is the AFRC-approved tuition fee — and confirm in writing there is no capitation / donation / development fund.",
  "Is the hostel on-campus or off-site? If off-site, what is the commute, and is transport included?",
  "Show me a named alumni placement list for the last 3 years with recruiter and year.",
  "Which BTEUP branch codes does this institute offer, and are any of them new (low cohort number)?",
  "What is the mentor:student ratio, and how is it tracked?",
  "Will my child have a faculty mentor with their contact, or is mentoring informal?",
];

export default function Page() {
  return (
    <div className="page-enter">
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
          <div className="eyebrow">Comparison · honest positioning · 2026</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            Why BIPE — and where{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              other Varanasi polytechnics
            </span>{" "}
            might fit you better.
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "60ch" }}>
            Varanasi has at least five private polytechnic colleges plus the government girls&rsquo;
            institute. This page lays out — honestly — what BIPE does differently across eight
            decision dimensions, names the competitors you should compare against, and finishes
            with the seven questions every family should ask each institute before paying a fee.
          </p>
          <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
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
      {/* 2. WHO YOU'RE COMPARING AGAINST                                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">The local landscape</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "24ch" }}>
            Who you&rsquo;re actually choosing{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              between.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            We&rsquo;ll name names because pretending the others don&rsquo;t exist insults your
            intelligence. Five private polytechnics in or near Varanasi serve overlapping
            catchments. Each does some things well; each has trade-offs. Below — the substantive
            differences.
          </p>
          <div
            className="bipe-grid-3"
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 18,
            }}
          >
            {[
              {
                name: "Kashi Institute of Technology",
                domain: "kashiit.ac.in",
                location: "Lahartara, Varanasi",
                note:
                  "Largest private polytechnic in Varanasi by brand-recall. Offers Civil, CSE, Mech, Electrical, and D.Pharm. Strong urban location, premium fee.",
              },
              {
                name: "VNITM (Varanasi Narayan Institute)",
                domain: "vnitm.co",
                location: "Pandeypur, Varanasi",
                note:
                  "Private polytechnic with full branch overlap. Smaller cohort, urban campus.",
              },
              {
                name: "SHEAT College of Polytechnic",
                domain: "sheatcollege.com",
                location: "Sarnath bypass, Varanasi",
                note:
                  "Multi-programme campus with polytechnic + other streams. Strong career-guidance content marketing.",
              },
              {
                name: "Government Girls Polytechnic Varanasi",
                domain: "ggpvaranasi.in",
                location: "Varanasi",
                note:
                  "State-funded, girls-only. Lower fees, government recruiter pipeline, but no admission for boys.",
              },
              {
                name: "Microtek Group of Institutions",
                domain: "microtek.ac.in",
                location: "Varanasi",
                note:
                  "Multi-programme private group covering management, IT, and polytechnic streams.",
              },
              {
                name: "BIPE — Banaras Institute of Polytechnic & Engineering",
                domain: "bipevns.org",
                location: "Phoolpur, Varanasi",
                note:
                  "Six-acre rural campus, AFRC tuition ₹30,150 / year, on-campus boys' hostel, Dairy Engineering moat, 1,000+ verified placements. This page is BIPE&rsquo;s pitch.",
              },
            ].map((c) => (
              <article
                key={c.domain}
                className="card"
                style={{ padding: 22 }}
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
                  {c.domain}
                </div>
                <h3 className="bipe-h3" style={{ fontSize: 18, marginTop: 8, lineHeight: 1.3 }}>
                  {c.name}
                </h3>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "var(--ink-3)",
                  }}
                >
                  {c.location}
                </div>
                <p
                  style={{
                    marginTop: 12,
                    color: "var(--ink-2)",
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {c.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. EIGHT DECISION DIMENSIONS                                            */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Eight things that matter</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            The dimensions{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              we&rsquo;d compare on.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            For each dimension below — BIPE&rsquo;s specific position, and the honest local context
            (what other Varanasi polytechnics offer, where to verify, what to watch out for).
          </p>
          <div style={{ marginTop: 36, display: "grid", gap: 22 }}>
            {ANCHORS.map((a, i) => (
              <article
                key={a.topic}
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
                  <h3 className="bipe-h3" style={{ fontSize: 22, lineHeight: 1.25 }}>
                    {a.topic}
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
                      BIPE&rsquo;s position
                    </div>
                    <p
                      style={{
                        color: "var(--ink-1)",
                        fontSize: 15,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {a.bipe}
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
                      The local context
                    </div>
                    <p
                      style={{
                        color: "var(--ink-2)",
                        fontSize: 14,
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {a.competitorContext}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. QUESTIONS TO ASK EVERY INSTITUTE                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Before you pay any fee</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            Seven questions to ask{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              every institute you visit.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            Including BIPE. We are not afraid of these. If an institute hedges on any of the
            seven, treat that as data — not because the institute is necessarily bad, but
            because clarity at the asking stage matters more than charm.
          </p>
          <ol
            style={{
              marginTop: 28,
              paddingLeft: 0,
              listStyle: "none",
              counterReset: "qa",
              display: "grid",
              gap: 14,
              maxWidth: "60ch",
            }}
          >
            {QUESTIONS_TO_ASK.map((q, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 18,
                  padding: "16px 20px",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  alignItems: "start",
                }}
              >
                <span
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontSize: 26,
                    color: "var(--brand)",
                    fontWeight: 400,
                    lineHeight: 0.95,
                    minWidth: 36,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "var(--ink-1)", fontSize: 15, lineHeight: 1.6 }}>{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. CTA                                                                  */}
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
                <div className="eyebrow">Ready to compare in person?</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                  Walk the labs.{" "}
                  <span
                    className="serif"
                    style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                  >
                    Meet the current cohort.
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
                  We run a free shuttle from Varanasi Cantt every Saturday during admission
                  season. Walk through the workshops, sit in on a class, eat at the mess. No
                  enrolment pressure — we want your decision to be informed.
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
                  href="https://wa.me/919198646464?text=Hi%20BIPE%20%E2%80%94%20I%20am%20comparing%20Varanasi%20polytechnic%20options."
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

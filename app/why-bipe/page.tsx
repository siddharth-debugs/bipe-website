import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("whyBipe");
}

/**
 * /why-bipe — category-leader brand page.
 *
 * REPOSITIONED 25 May 2026.
 *
 * The first version of this page (launched 20 May 2026) named several
 * private Varanasi polytechnics directly and framed BIPE as one option
 * among peers. That framing was strategically wrong for two reasons:
 *
 *   (1) BIPE has led private polytechnic admissions in Varanasi for
 *       6+ consecutive years. Category leaders don't legitimise
 *       smaller players by naming them — they define the standard
 *       and let others compare themselves.
 *
 *   (2) The actual competitive set for an applicant family is NOT
 *       other private polytechnics — it's government and aided
 *       polytechnics (huge fee gap, "sarkari" prestige myth). That
 *       comparison lives on its own page (/private-vs-government-
 *       polytechnic) where the framing is honest and the keyword
 *       cluster is materially larger.
 *
 * This page therefore answers: "Why has BIPE been the chosen private
 * polytechnic in Eastern UP for 16 years?" — purely through evidence,
 * not comparison. Every pillar links to a source-of-truth page on
 * this site (or a public registry) so every claim is auditable.
 *
 * Tone: confident, plain-spoken, evidence-first. We do not dunk on
 * anyone — we simply stop mentioning them.
 */

interface Pillar {
  topic: string;
  position: string;
  verifyLabel: string;
  verifyPath: string;
}

const PILLARS: Pillar[] = [
  {
    topic: "Affiliation & approval",
    position:
      "BTE UP Affiliated · AICTE Permanent ID 1-488233171 · EoA 2026-27 dated 16 Mar 2026 · AISHE registered. The documentary trail is published — nothing on this page is unverifiable.",
    verifyLabel: "See affiliations & approvals",
    verifyPath: "/about/affiliations",
  },
  {
    topic: "Tuition fee transparency",
    position:
      "AFRC-approved ₹30,150 per academic year. No capitation, no donation, no 'development fund'. Hostel and mess are billed separately and disclosed line by line, in writing, before you pay.",
    verifyLabel: "See fee structure",
    verifyPath: "/fees",
  },
  {
    topic: "Five branches — including the Dairy moat",
    position:
      "Civil, Computer Science & Engineering, Electrical, Mechanical (Production), and the rare Dairy Engineering — one of only four BTE UP-affiliated Dairy diploma programmes in all of Uttar Pradesh. A working-dairy lab and the Amul / Mother Dairy / NDDB recruiter pipeline that comes with it.",
    verifyLabel: "Explore the five branches",
    verifyPath: "/courses",
  },
  {
    topic: "On-campus hostel for Eastern UP & Bihar families",
    position:
      "Boys' hostel on the Phoolpur campus — furnished rooms, on-campus mess, 24×7 security, resident warden. The parent hotline rings the warden's desk directly. For families more than two hours from Varanasi, this is the difference between a doable diploma and an impossible one.",
    verifyLabel: "See hostel & facilities",
    verifyPath: "/hostel",
  },
  {
    topic: "Placement record on the public record",
    position:
      "1,331 verified alumni placements across Mahindra, Tata Steel, BEL, Indian Railways, Tata Motors, Amul, Mother Dairy, UPPCL, Ola Electric, Ather and forty others. Year-wise named alumni list with named recruiters — not logos, not testimonials, the actual list.",
    verifyLabel: "See the named alumni list",
    verifyPath: "/alumni",
  },
  {
    topic: "Lateral entry to B.Tech",
    position:
      "16 BIPE alumni from 2019-2025 batches have moved to B.Tech via AKTU and other UP state universities — full named table, current colleges, current branches. The diploma is a launchpad, not a ceiling.",
    verifyLabel: "Read the lateral-entry guide",
    verifyPath: "/blog/diploma-to-btech-lateral-entry-up-aktu",
  },
  {
    topic: "Six-acre Phoolpur campus",
    position:
      "Six acres at Phoolpur, ~14 km from Varanasi Cantt station. Free shuttle for visits during admission season. 550+ students from twelve Eastern UP districts plus Bihar — a real residential community, not a day-scholar building on a busy road.",
    verifyLabel: "Plan a campus visit",
    verifyPath: "/visit",
  },
  {
    topic: "16 years on record · Purwanchal Educational Trust",
    position:
      "Founded 2010 by Purwanchal Educational Trust. AISHE submitted annually. AICTE Annexure-18 mandatory disclosure published every academic year. 2,200+ alumni network · 1,331 verified placements. The founding documents and current-year disclosure are public — every claim above is auditable, today, by you.",
    verifyLabel: "Read the mandatory disclosure",
    verifyPath: "/mandatory-disclosure",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Why BIPE", path: "/why-bipe" },
            ]),
          ),
        }}
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
          <div className="eyebrow">BIPE · the positioning · 2026</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "24ch" }}>
            16 years.{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              1,331 placements.
            </span>{" "}
            The private polytechnic Eastern UP keeps choosing.
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "60ch" }}>
            Banaras Institute of Polytechnic &amp; Engineering has been the chosen private
            polytechnic for families across Eastern UP and Bihar since 2010. Eight pillars
            below — every claim verifiable on the public record, every link going to the
            source document on this site or the relevant registry.
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
      {/* 2. EIGHT PILLARS                                                        */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Eight pillars · all auditable</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            What we&rsquo;ve built —{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              and how to verify it.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            Polytechnic admissions are too important for vague language. Each pillar below
            states BIPE&rsquo;s specific position and links to the source document. If you
            can&rsquo;t verify it, we shouldn&rsquo;t be claiming it.
          </p>
          <div style={{ marginTop: 36, display: "grid", gap: 22 }}>
            {PILLARS.map((p, i) => (
              <article
                key={p.topic}
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
                    {p.topic}
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
                      {p.position}
                    </p>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Link
                      href={p.verifyPath}
                      className="btn btn-ghost"
                      style={{ fontSize: 14 }}
                    >
                      {p.verifyLabel} <ArrowIcon size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. QUESTIONS EVERY FAMILY SHOULD ASK                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Smart-buyer guide</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            Seven questions to ask{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              before paying any polytechnic admission fee.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            Including BIPE. If you ask us these and we hedge, treat that as data. Clarity at
            the asking stage matters more than charm — every answer we owe you is in writing
            somewhere on this site, and these seven questions are the index to find it.
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
      {/* 4. CTA                                                                  */}
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
                <div className="eyebrow">Ready to see it in person?</div>
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
                  Free shuttle from Varanasi Cantt every Saturday during admission season.
                  Walk through the workshops, sit in on a class, eat at the mess. No
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
                  href="https://wa.me/919198646464?text=Hi%20BIPE%20%E2%80%94%20I%20want%20to%20know%20more%20about%20the%20Phoolpur%20campus%20and%202026%20admissions."
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

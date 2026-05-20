import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("jeecupCounselling");
}

/**
 * /jeecup-counselling — dedicated page for the highest-volume keyword
 * in the BIPE universe per the May 2026 Semrush keyword research:
 *   "jeecup counselling"   18,100 monthly searches
 *
 * The existing /jeecup page is structured around BIPE's 6-step
 * guidance funnel and reads as a hub. This page is laser-focused on
 * the counselling stage specifically — the 5 rounds, choice filling,
 * documents, seat allotment, reporting — so it can rank cleanly for
 * the head term without diluting /jeecup.
 *
 * Cross-links flow:
 *   /jeecup-counselling  → application step? See /jeecup
 *                       → rank-vs-cutoff?    See /blog/jeecup-rank-vs-bipe-4455-cutoffs
 *                       → form filling?      See /blog/how-to-fill-jeecup-2026
 *                       → choice filling?    Section below
 */

const ROUNDS: { n: string; title: string; window: string; body: string }[] = [
  {
    n: "Round 1",
    title: "First-merit allotment",
    window: "Approximately May–June",
    body:
      "Counselling opens about 10 days after JEECUP results. Top-rank holders get seat in their first choice; lower ranks fill cascading. Seat is provisional until you upload documents and pay the seat-acceptance fee within the round window (usually 3–5 days).",
  },
  {
    n: "Round 2",
    title: "Upgrade + fresh allotment",
    window: "Approximately June",
    body:
      "Seats that Round-1 candidates declined or didn't confirm reopen. You can either freeze your Round-1 seat or float for an upgrade (a better branch / institute) in Round 2. If you float and don't get upgraded, you keep the Round-1 seat — no loss.",
  },
  {
    n: "Round 3",
    title: "Second upgrade window",
    window: "Approximately June–July",
    body:
      "Same logic as Round 2 — float for another upgrade if you still want one. Most BIPE choice holders settle in Round 2 or 3.",
  },
  {
    n: "Round 4",
    title: "Final main-round allotment",
    window: "Approximately July",
    body:
      "Last regular round. After this, the only path to a seat is the spot round at the institute level — far less control over which branch you end up in.",
  },
  {
    n: "Spot Round",
    title: "Institute-level seat filling",
    window: "Approximately July–August",
    body:
      "Vacant seats after Round 4 are filled by the institutes themselves under JEECUP supervision. You apply directly to the institute (BIPE), not through the central portal. Rank still matters but the rules are looser.",
  },
];

const CHOICE_TIPS: string[] = [
  "Put your most-preferred branch at BIPE 4455 as your VERY FIRST choice — not your most ambitious-sounding choice. If you want Civil at BIPE, BIPE-Civil should be choice #1.",
  "Then list every BIPE branch you'd accept, in your preference order. BIPE-Civil → BIPE-Electrical → BIPE-Mechanical Production → BIPE-CSE → BIPE-Dairy.",
  "Only AFTER you've exhausted BIPE should you list other institutes. Every other-institute choice you put before another BIPE choice is a vote against staying at BIPE.",
  "Don't interleave by perceived prestige. Algorithm processes choices top-to-bottom and gives you the highest-ranked choice you qualify for — so if BIPE-Mechanical is choice #3 and a distant private institute is choice #2, you'll end up at the distant institute if you qualify for both.",
  "Include lower-preference branches too. Some families list only one branch at BIPE and skip the rest; if their rank doesn't make that branch but would have comfortably made another BIPE branch, they end up elsewhere unnecessarily.",
  "Lock in once you're happy. Floating a confirmed seat in Round 2/3 risks losing it without securing the upgrade. Float only if you genuinely prefer the upgrade.",
];

const DOCUMENTS: string[] = [
  "JEECUP rank card / allotment letter (printout)",
  "Class 10 marksheet + certificate (original + 2 photocopies)",
  "Class 12 / ITI / B.Sc certificate (for Group K lateral entry)",
  "Aadhaar card (original + photocopy)",
  "JEECUP application form printout",
  "Domicile / residence certificate (UP-issued, if claiming state quota)",
  "Caste certificate (if claiming SC / ST / OBC reservation — must be valid)",
  "Income certificate (if claiming EWS or income-based scholarship)",
  "Character certificate from last institution attended",
  "Transfer certificate (TC) from Class 10 school",
  "Recent passport-size photographs (8–10 copies)",
  "Medical fitness certificate (some institutes ask; carry one to be safe)",
];

const MISTAKES: { title: string; body: string }[] = [
  {
    title: "Listing only your dream branch",
    body:
      "Common: family lists \"only BIPE Computer Science\" as the BIPE choice, with five other institutes after. If the rank doesn't make CSE, the candidate ends up at a different institute when BIPE-Electrical or BIPE-Civil would have been a perfectly good outcome.",
  },
  {
    title: "Interleaving institutes by prestige",
    body:
      "Common: \"BIPE-CSE first, then big-name-institute-X-CSE, then BIPE-Mech, then big-name-institute-X-Mech.\" The algorithm honours order — interleaving means you'll end up at big-name-X for any branch before getting BIPE-Mech, even if you'd have preferred BIPE for any branch over big-name-X for any branch.",
  },
  {
    title: "Floating a confirmed seat thoughtlessly",
    body:
      "Common: \"I'll float in Round 2 just in case I get something better.\" If you float, the seat is released. If you don't get an upgrade, you do keep the original seat — but the float window is fixed. Float only if you genuinely prefer the upgrade.",
  },
  {
    title: "Missing the document upload window",
    body:
      "Common: candidate gets allotted, plans to upload documents \"on the last day,\" portal is slow or crashes, deadline passes. Each round has a hard cutoff — usually 3–5 days from allotment. Upload on Day 1 if possible.",
  },
  {
    title: "Skipping the spot round when you should attend",
    body:
      "Common: candidate doesn't get a seat in Rounds 1–4, assumes it's over, doesn't attend the institute-level spot round. BIPE's spot round usually has 10–30 vacancies each year — direct application, on-campus, often less competitive than central rounds.",
  },
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
            top: -160,
            width: 480,
            height: 480,
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
            bottom: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--accent) 28%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">JEECUP 2026 · COUNSELLING GUIDE · BIPE 4455</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            JEECUP counselling 2026.{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              All five rounds explained.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "60ch" }}>
            JEECUP counselling is the bridge between your rank and your seat. Five rounds, four
            documents, one institute code (BIPE Varanasi is{" "}
            <strong>4455</strong>) — and a choice-filling order that decides whether you actually
            land at BIPE or somewhere unintended. This page covers all of it, in order.
          </p>
          <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
            <Link href="/apply" className="btn btn-primary btn-lg">
              Apply for 2026-27 <ArrowIcon size={16} />
            </Link>
            <a
              href="https://wa.me/919198646464?text=Hi%20BIPE%20%E2%80%94%20I%20have%20a%20question%20about%20JEECUP%20counselling."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
            >
              WhatsApp admissions <WhatsAppIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. THE 5 ROUNDS                                                         */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">The 5 rounds</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            What happens in{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              each round.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            JEECUP runs four central counselling rounds + one institute-level spot round. Each
            round opens a fresh choice-filling window, allots seats, and gives you 3–5 days to
            confirm. Miss the window, lose the seat.
          </p>
          <div
            className="bipe-grid-3"
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}
          >
            {ROUNDS.map((r) => (
              <article key={r.n} className="card" style={{ padding: 28 }}>
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    color: "var(--brand)",
                    fontSize: 22,
                    marginBottom: 6,
                  }}
                >
                  {r.n}
                </div>
                <h3 className="bipe-h3" style={{ fontSize: 22, lineHeight: 1.25 }}>
                  {r.title}
                </h3>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink-3)",
                    marginTop: 8,
                  }}
                >
                  {r.window}
                </div>
                <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6 }}>
                  {r.body}
                </p>
              </article>
            ))}
          </div>
          <p
            style={{
              marginTop: 28,
              color: "var(--ink-3)",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            Round dates shift each year. For exact 2026 dates, always cross-check the official
            JEECUP portal at{" "}
            <a
              href="https://jeecup.admissions.nic.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              jeecup.admissions.nic.in
            </a>
            .
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. CHOICE FILLING                                                       */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Choice filling · the most consequential step</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            Where families{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              lose seats they should have won.
            </span>
          </h2>
          <p style={{ marginTop: 22, color: "var(--ink-2)", maxWidth: "62ch" }}>
            The choice list is processed top-to-bottom. The system gives you the highest-ranked
            choice you qualify for. So choice <strong>order</strong> determines your outcome more
            than choice <strong>set</strong>. Six rules that turn the algorithm to your advantage:
          </p>
          <ol style={{ marginTop: 24, paddingLeft: 22, color: "var(--ink-1)", lineHeight: 1.65, fontSize: 16 }}>
            {CHOICE_TIPS.map((t, i) => (
              <li key={i} style={{ marginBottom: 14 }}>
                {t}
              </li>
            ))}
          </ol>
          <div
            className="card"
            style={{
              marginTop: 36,
              padding: 28,
              background: "color-mix(in oklab, var(--brand) 6%, transparent)",
              borderColor: "color-mix(in oklab, var(--brand) 22%, var(--line))",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--brand)",
                marginBottom: 8,
              }}
            >
              Worked example · how to order BIPE choices
            </div>
            <p style={{ color: "var(--ink-1)", lineHeight: 1.65 }}>
              If you want Mechanical Production at BIPE, but would also accept Electrical or Civil
              there, your list should start:
            </p>
            <ol
              style={{
                marginTop: 12,
                paddingLeft: 22,
                color: "var(--ink-2)",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              <li>BIPE · Mechanical Engineering (Production) — code 113</li>
              <li>BIPE · Electrical Engineering — code 105</li>
              <li>BIPE · Civil Engineering — code 102</li>
              <li>BIPE · Computer Science & Engineering — code 118</li>
              <li>BIPE · Dairy Engineering — code 123</li>
              <li>(only now, other institutes in preference order)</li>
            </ol>
            <p style={{ marginTop: 16, color: "var(--ink-2)", fontSize: 14, fontStyle: "italic" }}>
              This locks BIPE as your institute as long as ANY of the five branches has a seat open
              that your rank qualifies for. If you genuinely want BIPE, this is the order.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. DOCUMENTS                                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Documents required at allotment</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            Keep these{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              ready before Round 1 opens.
            </span>
          </h2>
          <p style={{ marginTop: 22, color: "var(--ink-2)", maxWidth: "62ch" }}>
            JEECUP gives 3–5 days to upload documents after each allotment. Originals + photocopies
            go to the institute when you report. Keep one master folder ready from Day 1 of
            counselling.
          </p>
          <div
            className="bipe-grid-3"
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 14,
            }}
          >
            {DOCUMENTS.map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "14px 18px",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                }}
              >
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    color: "var(--brand)",
                    fontWeight: 400,
                    fontSize: 18,
                    flexShrink: 0,
                    minWidth: 28,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ color: "var(--ink-1)", fontSize: 15, lineHeight: 1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. COMMON MISTAKES                                                      */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Five mistakes we watch families make every year</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            Avoidable losses.{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              Read these now.
            </span>
          </h2>
          <div style={{ marginTop: 32, display: "grid", gap: 18 }}>
            {MISTAKES.map((m, i) => (
              <article
                key={i}
                className="card"
                style={{
                  padding: 24,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 22,
                  alignItems: "start",
                }}
              >
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontSize: 36,
                    color: "var(--brand)",
                    fontWeight: 400,
                    lineHeight: 0.9,
                    minWidth: 44,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="bipe-h3" style={{ fontSize: 20, lineHeight: 1.3 }}>
                    {m.title}
                  </h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65 }}>
                    {m.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. RELATED — INTERNAL LINKS                                             */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Related JEECUP guides</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "28ch" }}>
            Going{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              deeper.
            </span>
          </h2>
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
                href: "/blog/jeecup-rank-vs-bipe-4455-cutoffs-2024-2025",
                eyebrow: "Cutoff data",
                title: "What JEECUP rank do you need for BIPE 4455?",
                body: "Real 2024-25 and 2025-26 closing ranks per branch — 342 admitted-student rows.",
              },
              {
                href: "/blog/how-to-fill-jeecup-2026-application-form-step-by-step",
                eyebrow: "Application form",
                title: "How to fill the JEECUP 2026 application form",
                body: "Screenshot-by-screenshot walkthrough of the official portal — registration to fee payment.",
              },
              {
                href: "/jeecup",
                eyebrow: "Full pathway",
                title: "JEECUP 6-step counselling guide",
                body: "The broader BIPE-side funnel from application through reporting at the institute.",
              },
              {
                href: "/blog/polytechnic-kya-hai-aur-kaise-kare",
                eyebrow: "Hindi guide",
                title: "Polytechnic Kya Hai aur Kaise Kare",
                body: "पॉलिटेक्निक क्या है, पात्रता, फीस, JEECUP — एक हिन्दी गाइड।",
              },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                style={{
                  display: "block",
                  padding: 24,
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color .25s, transform .25s",
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
                  {r.eyebrow}
                </div>
                <h3 className="bipe-h3" style={{ fontSize: 19, marginTop: 8, lineHeight: 1.25 }}>
                  {r.title}
                </h3>
                <p
                  style={{
                    marginTop: 10,
                    color: "var(--ink-2)",
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {r.body}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. FINAL CTA                                                            */}
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
                <div className="eyebrow">Need help during your counselling?</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
                  Call us before you{" "}
                  <span
                    className="serif"
                    style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                  >
                    freeze a choice.
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
                  Counselling rules change year to year. If you're a real-time candidate during a
                  2026 round window, talk to the admissions team — Hindi or English, on
                  WhatsApp or phone — before you submit choices. Free, no obligation.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <a
                  href="tel:+919198646464"
                  className="btn btn-primary btn-lg"
                  style={{ justifyContent: "space-between" }}
                >
                  Call +91-9198646464 <PhoneIcon />
                </a>
                <a
                  href="https://wa.me/919198646464?text=Hi%20BIPE%20%E2%80%94%20I%20have%20a%20question%20about%20JEECUP%20counselling."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    background: "var(--accent)",
                    color: "var(--ink)",
                    justifyContent: "space-between",
                  }}
                >
                  WhatsApp now <WhatsAppIcon />
                </a>
                <Link
                  href="/apply"
                  className="btn btn-ghost btn-lg"
                  style={{ justifyContent: "space-between" }}
                >
                  Start BIPE application <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

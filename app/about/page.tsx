import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { getBranchesMapped, getPageSection } from "@/lib/content";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import CatchmentMap from "@/components/about/CatchmentMap";
import PressMentions from "@/components/about/PressMentions";
import { PageIntro } from "@/components/shared/PageIntro";
import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("about"); }

type Stat = { num: string; label: string; suffix?: string };
const STATS: Stat[] = [
  { num: "2010", label: "Founded" },
  { num: "6", label: "Acres" },
  { num: "5", label: "Branches" },
  { num: "550", label: "Students", suffix: "+" },
  { num: "40", label: "Faculty" },
  { num: "1:20", label: "Mentor ratio" },
];

const FEATURES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "1:20 mentorship with home visits",
    body: "Each faculty mentor takes responsibility for 20 students through their entire diploma — including periodic home visits to parents in Mau, Ghazipur and beyond. Institution, parent and student bonded as one family.",
  },
  {
    n: "02",
    title: "Book Bank · ₹1000 / sem",
    body: "Full-semester sets of textbooks and reference materials borrowable for ₹1000 per semester. No student goes without books because of family budget.",
  },
  {
    n: "03",
    title: "Positive campus culture",
    body: "We do not run on fines or penalty-driven discipline. Mentor conversations and parent calls do the work. The campus is warm, safe and academically serious at the same time.",
  },
  {
    n: "04",
    title: "PMKVY · Make in India · Swachh Bharat",
    body: "Curriculum, skilling pathways and student projects align with national missions. Our diploma equips students for the India that is being built today.",
  },
];

const CORE_VALUES: { en: string; hi: string; gloss: string; body: string }[] = [
  {
    en: "Kaushal",
    hi: "कौशल",
    gloss: "Skill",
    body: "Skill is our highest offering. We measure success not by marks alone but by what a student can make, fix, operate, and deliver with their hands and mind together.",
  },
  {
    en: "Satya",
    hi: "सत्य",
    gloss: "Integrity",
    body: "An engineer who cuts corners endangers lives. We build the habit of doing things right — in every weld, every circuit, every measurement — whether or not anyone is watching.",
  },
  {
    en: "Karmatā",
    hi: "कर्मता",
    gloss: "Work ethic",
    body: "The Gita's greatest lesson is action without excuse. We cultivate punctuality, perseverance and pride in one's craft — the hallmarks of every great technician.",
  },
  {
    en: "Samānatā",
    hi: "समानता",
    gloss: "Inclusivity",
    body: "A file, a lathe, a multimeter — tools have no caste or gender. Every student, regardless of background, has an equal right to skill, opportunity and dignity at BIPE.",
  },
  {
    en: "Seva",
    hi: "सेवा",
    gloss: "Service",
    body: "Skills are most powerful when used in service. Our graduates fix what is broken, build what is needed and serve communities — in small workshops and in large industries alike.",
  },
  {
    en: "Uttamatvam",
    hi: "उत्तमत्वम्",
    gloss: "Excellence",
    body: "Excellence in a polytechnic is a perfectly finished surface, a correctly wired panel, a precisely calibrated instrument. We hold ourselves to the standard the job demands.",
  },
];

type District = { name: string; hi: string; tag: string };
const DISTRICTS: District[] = [
  // HOME — BIPE Phoolpur sits in Varanasi district.
  { name: "Varanasi",    hi: "वाराणसी",       tag: "HOME" },
  // MAJOR — daily-transport rural belt (≤ 90 min from campus).
  { name: "Mau",         hi: "मऊ",            tag: "MAJOR" },
  { name: "Ghazipur",    hi: "गाज़ीपुर",      tag: "MAJOR" },
  { name: "Jaunpur",     hi: "जौनपुर",        tag: "MAJOR" },
  { name: "Bhadohi",     hi: "भदोही",         tag: "MAJOR" },
  // ACTIVE — wider Eastern-UP draw (regular admissions, longer commute).
  { name: "Azamgarh",    hi: "आज़मगढ़",       tag: "ACTIVE" },
  { name: "Chandauli",   hi: "चंदौली",        tag: "ACTIVE" },
  { name: "Mirzapur",    hi: "मिर्ज़ापुर",     tag: "ACTIVE" },
  { name: "Sonebhadra",  hi: "सोनभद्र",        tag: "ACTIVE" },
  { name: "Ballia",      hi: "बलिया",         tag: "ACTIVE" },
  { name: "Gorakhpur",   hi: "गोरखपुर",       tag: "ACTIVE" },
  { name: "Kushinagar",  hi: "कुशीनगर",       tag: "ACTIVE" },
];

export default async function Page() {
  // Branch data flows from the backend when populated, falls back to
  // the static branches otherwise. Used by the branch-wise seat
  // allotment table below.
  const branches = await getBranchesMapped();
  // Optional admin-managed intro block shown above the existing
  // editorial copy. Renders only when a published row exists.
  const intro = await getPageSection("about", "intro");
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About BIPE", path: "/about" },
            ]),
          ),
        }}
      />
      <PageIntro section={intro} />
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 26%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, bottom: -160, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 30%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="eyebrow">EST. 2010 · PHOOLPUR · VARANASI</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                Sixteen years{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  since 2010.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "52ch" }}>
                A six-acre AICTE-approved polytechnic in Varanasi, with its campus in Phoolpur. Five BTEUP-affiliated branches, 550+ students drawn from twelve districts, 40 faculty — built to make rural India a credible address for technical education.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">Apply for 2026-27 <ArrowIcon size={16} /></Link>
                <Link href="/visit" className="btn btn-ghost btn-lg">Visit campus</Link>
              </div>

              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Trust marks &rarr;
                </span>
                {["AICTE", "BTEUP", "AISHE"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < 3 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Image collage. First (large left) tile is the LCP candidate
                — flagged `priority` so the browser fetches it eagerly with
                fetchPriority="high" rather than waiting for the rest of
                the page to parse. The other two tiles stay default
                (lazy) — they're below the H1 fold on most viewports. */}
            <div className="bipe-collage" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 14, height: 540 }}>
              <Img src={BIPE_IMG.campusWide} label="6-acre campus" priority sizes="(max-width: 860px) 100vw, 50vw" style={{ gridRow: "1 / 3", borderRadius: 18, height: "100%" }} />
              <Img src={BIPE_IMG.students2024} label="Recent cohort" sizes="(max-width: 860px) 100vw, 25vw" style={{ borderRadius: 18, height: "100%" }} />
              <Img src={BIPE_IMG.workshop} label="Mech workshop" sizes="(max-width: 860px) 100vw, 25vw" style={{ borderRadius: 18, height: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. VISION · MISSION · VALUES                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "30%", top: -160, width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 40%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          {/* Shloka header */}
          <div style={{ textAlign: "center", marginBottom: 56, paddingBottom: 28, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>Vision. Mission. Values.</div>
            <div className="serif" style={{
              marginTop: 22,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(28px, 3.2vw, 44px)",
              lineHeight: 1.25, color: "var(--paper)",
              letterSpacing: "-0.005em",
            }}>
              ॥&nbsp;न हि ज्ञानेन सदृशं पवित्रमिह विद्यते&nbsp;॥
            </div>
            <div style={{ marginTop: 14, color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "52ch", marginInline: "auto", fontSize: 15.5, lineHeight: 1.65 }}>
              &ldquo;There is nothing as purifying as knowledge in this world.&rdquo;
              <span style={{ display: "block", marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>
                Bhagavad Gita · 4.38
              </span>
            </div>
          </div>

          {/* Vision · Mission */}
          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0, border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderRadius: 24, overflow: "hidden", marginBottom: 28 }}>
            <div style={{ padding: "44px 36px", borderRight: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>VISION</div>
              <div className="serif" style={{ marginTop: 16, fontSize: 30, lineHeight: 1.15, color: "var(--paper)", fontStyle: "italic", fontWeight: 400 }}>
                Where skill is the highest form of knowledge.
              </div>
              <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>
                To be the most trusted polytechnic institution of Kashi — one that transforms students into industry-ready, skilled technicians and diploma engineers who learn by doing, grow by creating, and serve by building.
              </p>
            </div>

            <div style={{ padding: "44px 36px", background: "color-mix(in oklab, var(--brand) 12%, var(--ink))" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>MISSION</div>
              <div className="serif" style={{ marginTop: 16, fontSize: 30, lineHeight: 1.15, color: "var(--paper)", fontStyle: "italic", fontWeight: 400 }}>
                Five pillars of purposeful, practice-first education.
              </div>
              <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>
                To deliver rigorous, skill-first diploma education — grounded in equal parts theory and practice — that makes every BIPE student immediately employable, ethically grounded, and ready to contribute to the growth of industry and nation.
              </p>
            </div>
          </div>

          {/* Core values · 6 principles */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", margin: "32px 0 28px", paddingBottom: 20, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Core values</div>
              <h3 className="bipe-h2" style={{ marginTop: 12, maxWidth: "26ch", color: "var(--paper)" }}>
                Six principles lived in the{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>workshop and the classroom.</span>
              </h3>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "44ch", justifySelf: "end", textAlign: "right", fontSize: 15 }}>
              Names in Devanāgarī. Practice in the lab. These six aren&apos;t a poster — they&apos;re the standard a faculty mentor calls a student back on.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderRadius: 24, overflow: "hidden" }}>
            {CORE_VALUES.map((v, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              return (
                <div key={v.en} style={{
                  padding: "36px 30px",
                  borderRight: col < 2 ? "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" : "none",
                  borderTop: row > 0 ? "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" : "none",
                  background: (i + row) % 2 === 0 ? "transparent" : "color-mix(in oklab, var(--brand) 10%, var(--ink))",
                }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 26, lineHeight: 1.05, color: "var(--accent)",
                  }}>
                    {v.hi}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 18, color: "var(--paper)" }}>{v.en}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
                      {v.gloss}
                    </span>
                  </div>
                  <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.65, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. LONG-FORM STORY                                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, top: -120, width: 320, height: 320, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }}>
            <div>
              <div className="eyebrow">The story</div>
              <p className="serif" style={{
                fontSize: "clamp(34px, 4vw, 56px)",
                lineHeight: 1.05,
                marginTop: 20,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}>
                &ldquo;Built by families,
                <br />
                <span style={{ color: "var(--brand)" }}>for families.</span>&rdquo;
              </p>
              <div style={{
                marginTop: 28, paddingLeft: 16, borderLeft: "2px solid var(--accent)",
                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--ink-3)",
              }}>
                Purwanchal Educational Trust<br />Founders, 2010
              </div>
            </div>
            <div style={{ color: "var(--ink-2)", fontSize: 16.5, lineHeight: 1.75, maxWidth: "62ch" }}>
              <p>
                BIPE was founded in 2010 by the <strong style={{ color: "var(--ink)" }}>Purwanchal Educational Trust</strong>, a registered non-profit, with one stated purpose: to bring accountable, hands-on technical education to families across Eastern Uttar Pradesh who could not afford to send their children to Lucknow, Kanpur or further.
              </p>
              <p style={{ marginTop: 18 }}>
                Our catchment spans fourteen districts — <strong style={{ color: "var(--ink)" }}>Varanasi, Mau, Ghazipur, Jaunpur, Bhadohi, Azamgarh, Chandauli, Mirzapur, Sonebhadra, Ballia, Gorakhpur, Kushinagar, Pratapgarh and Sultanpur</strong>. The campus sits on six acres in Phoolpur, on the Phoolpur&ndash;Parsara approach road off NH-56. Three-quarters of our students are first-generation engineering aspirants. Many arrive shy of English and leave fluent in lathes, theodolites and PLC ladder logic.
              </p>
              <p style={{ marginTop: 18 }}>
                We run <em>five</em> BTEUP-affiliated branches — including <strong style={{ color: "var(--brand)" }}>Dairy Engineering</strong>, a programme offered by fewer than 1.1% of UP polytechnics. Our first Dairy cohort entered in 2025-26 and finishes in 2028; Amul, Mother Dairy, Parag, Nestl&eacute; and the NDDB are the employers that qualification opens up. Civil and Mechanical Engineering (Production) alumni work on Smart Cities, Bharatmala alignments and the Kashi Vishwanath corridor. Computer Science &amp; Engineering graduates clear B.Tech entrances; Electrical graduates write SSC JE and RRB JE.
              </p>
              <p style={{ marginTop: 18 }}>
                Sixteen years in, {formatPlacements(PLACEMENT_STATS.totalPlacements)} TPO-verified BIPE alumni serve at <strong style={{ color: "var(--ink)" }}>Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro</strong> and dozens of other employers — including 28 in government posts (Indian Railways ALP, UPPCL, SSC JE, UP Police). Most of them came from villages within 80 kilometres of our gate. That is the story we are most proud of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. STATS BAR                                                            */}
      {/* ====================================================================== */}
      <section className="section-tight" style={{ position: "relative" }}>
        <div className="container">
          <div className="bipe-stats" style={{
            border: "1px solid var(--line)", borderRadius: 24, overflow: "hidden",
            background: "var(--white)",
            display: "grid", gridTemplateColumns: `repeat(${STATS.length}, 1fr)`,
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: "32px 22px",
                borderRight: i < STATS.length - 1 ? "1px solid var(--line)" : "none",
                position: "relative",
              }}>
                <div className="serif" style={{
                  fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(40px, 4.5vw, 72px)",
                  lineHeight: 0.9, color: "var(--brand)", letterSpacing: "-0.02em",
                }}>
                  {s.num.match(/^[0-9,]+$/) ? <Counter to={s.num} suffix={s.suffix ?? ""} /> : s.num}
                </div>
                <div style={{
                  marginTop: 14,
                  fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "var(--ink-3)",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. BRANCH-WISE SEAT ALLOTMENT                                           */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, top: -120, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 16%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 36, paddingBottom: 22, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Sanctioned intake · 2026-27</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                Branch-wise{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  seat allotment.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              The 2026-27 sanctioned intake under JEECUP college code 4455 — five 3-year BTEUP-affiliated diploma courses, total {branches.reduce((s, b) => s + b.seats, 0)} seats.
            </p>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden", maxWidth: 980, margin: "0 auto" }}>
            {/* Header row */}
            <div style={{
              display: "grid", gridTemplateColumns: "auto minmax(0, 3fr) 1fr",
              padding: "16px 24px",
              background: "var(--ink)", color: "var(--paper)",
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <div style={{ minWidth: 80 }}>Code</div>
              <div>Branch</div>
              <div style={{ textAlign: "right" }}>Seats</div>
            </div>

            {branches.map((b, i) => (
              <div key={b.code} style={{
                display: "grid", gridTemplateColumns: "auto minmax(0, 3fr) 1fr",
                padding: "20px 24px",
                background: i % 2 === 0 ? "var(--white)" : "var(--paper)",
                borderBottom: i < branches.length - 1 ? "1px solid var(--line)" : "none",
                alignItems: "center",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--brand)", minWidth: 80 }}>{b.code}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>{b.name}</div>
                  <div className="serif" style={{ fontStyle: "italic", color: "var(--ink-3)", fontSize: 14, marginTop: 2 }}>{b.hi}</div>
                </div>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400, fontSize: 30,
                  color: "var(--ink)", letterSpacing: "-0.01em",
                  textAlign: "right",
                }}>
                  {b.seats}
                </div>
              </div>
            ))}

            {/* Total footer */}
            <div style={{
              display: "grid", gridTemplateColumns: "auto minmax(0, 3fr) 1fr",
              padding: "20px 24px",
              background: "color-mix(in oklab, var(--brand) 8%, var(--paper))",
              borderTop: "2px solid var(--brand)",
              alignItems: "center",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--brand)", minWidth: 80 }}>TOTAL</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>2026-27 sanctioned intake · 5 BTEUP branches</div>
              <div className="serif" style={{
                fontStyle: "italic", fontWeight: 400, fontSize: 36,
                color: "var(--brand)", letterSpacing: "-0.02em",
                textAlign: "right",
              }}>
                {branches.reduce((s, b) => s + b.seats, 0)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, textAlign: "center" }}>
            <Link href="/courses" className="btn btn-ghost btn-sm">
              See branch syllabi <ArrowIcon size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. CATCHMENT MAP                                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Catchment</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "18ch" }}>
                Twelve districts.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>One campus.</span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 20, fontSize: 16, lineHeight: 1.7, maxWidth: "52ch" }}>
                BIPE was located in Phoolpur deliberately — equidistant from the rural belts of Mau, Ghazipur, Azamgarh and Jaunpur, and reachable from Varanasi, Bhadohi, Mirzapur and Chandauli by daily transport. Students from Sonebhadra, Ballia, Gorakhpur and Kushinagar make up the wider Eastern-UP draw.
              </p>

              <div style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 10,
              }}>
                {DISTRICTS.map((d) => (
                  <div key={d.name} style={{
                    border: "1px solid var(--line)", borderRadius: 10,
                    padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: 8,
                    background: "var(--white)",
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                      <div className="serif" style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.hi}</div>
                    </div>
                    <span className="pill" style={{
                      fontSize: 9,
                      padding: "2px 6px",
                      flexShrink: 0,
                      background: d.tag === "HOME" ? "var(--brand)" : d.tag === "MAJOR" ? "color-mix(in oklab, var(--accent) 22%, var(--paper))" : "var(--brand-soft)",
                      color: d.tag === "HOME" ? "#fff" : d.tag === "MAJOR" ? "var(--accent-deep)" : "var(--brand)",
                    }}>{d.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real OSM map of the Eastern UP catchment with a marker per
                district. Leaflet is loaded lazily inside the client
                component so the page can still SSR. */}
            <div style={{
              position: "relative", aspectRatio: "1.15 / 1",
              borderRadius: 24, overflow: "hidden",
              border: "1px solid var(--line)",
              background: "var(--paper-2)",
              isolation: "isolate",
            }}>
              <CatchmentMap />
              <div style={{
                position: "absolute", left: 18, bottom: 18,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--ink-3)",
                background: "var(--white)", borderRadius: 8,
                padding: "6px 10px", border: "1px solid var(--line)",
                pointerEvents: "none",
                zIndex: 400,
              }}>
                UP & Bihar · Catchment 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. SALIENT FEATURES                                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, bottom: -160, width: 360, height: 360, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Salient features</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Four things you can{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>verify</span>{" "}
                in one campus visit.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Every claim below is observable on a Saturday tour — ask the front desk for a current student to walk you through.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {FEATURES.map((f) => (
              <article key={f.n} className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: "clamp(56px, 6vw, 92px)",
                    lineHeight: 0.85, color: "var(--brand)",
                    letterSpacing: "-0.02em",
                  }}>
                    {f.n}
                  </div>
                  <div>
                    <h3 className="bipe-h3" style={{ fontSize: 22, lineHeight: 1.25 }}>{f.title}</h3>
                    <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65 }}>
                      {f.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. IN THE PRESS                                                         */}
      {/* ====================================================================== */}
      <PressMentions />

      {/* ====================================================================== */}
      {/* 8. FINAL CTA                                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28, border: "1px solid var(--line)",
            background: "var(--white)",
            padding: "56px 56px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: -160, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 22%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 32%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />

            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div className="eyebrow">Three pathways</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                  Visit. Apply.{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    Talk to us.
                  </span>
                </h2>
                <p className="lead" style={{ marginTop: 18, maxWidth: "44ch" }}>
                  Whether you want to walk the campus, send the form, or ask one question on WhatsApp first — we will meet you where you are in the decision.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/visit" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--ink)", color: "var(--paper)", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>01</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Visit campus</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 60%, transparent)", marginTop: 2 }}>~35 min from Varanasi Cantt by auto</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <Link href="/apply" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--brand)", color: "#fff", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, #fff 65%, transparent)" }}>02</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Apply for 2026-27</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, #fff 70%, transparent)", marginTop: 2 }}>Single-step form · 5 minutes</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--paper-2)", color: "var(--ink)", textDecoration: "none",
                  border: "1px solid var(--line)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>03</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Talk on WhatsApp</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Same-day reply · EN / हिं</div>
                  </div>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WhatsAppIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

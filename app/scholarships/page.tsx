import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { IconTile } from "@/components/ui/IconTile";
import { Award } from "lucide-react";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { SITE_URL } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("scholarships"); }

const GOV: { roman: string; cat: string; benefit: string; portal: string; href: string; note: string }[] = [
  {
    roman: "i",
    cat: "SC / ST",
    benefit: "Full tuition reimbursement",
    portal: "scholarship.up.gov.in",
    href: "https://scholarship.up.gov.in",
    note: "Annual; submitted at the UP State portal each year. Income threshold applies.",
  },
  {
    roman: "ii",
    cat: "OBC",
    benefit: "Partial tuition fee reimbursement, subject to income",
    portal: "scholarship.up.gov.in",
    href: "https://scholarship.up.gov.in",
    note: "Family income ceiling per UP norms; renewable each year on satisfactory progress.",
  },
  {
    roman: "iii",
    cat: "EWS",
    benefit: "Partial tuition fee reimbursement per UP Government norms",
    portal: "scholarship.up.gov.in",
    href: "https://scholarship.up.gov.in",
    note: "Requires valid EWS certificate from competent authority.",
  },
  {
    roman: "iv",
    cat: "Minority",
    benefit: "Central scholarships via NSP portal",
    portal: "scholarships.gov.in",
    href: "https://scholarships.gov.in",
    note: "National Scholarship Portal — pre-matric, post-matric and merit-cum-means schemes.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Can I combine government and merit scholarships?",
    a: "Yes — UP Government post-matric scholarships and BIPE merit waivers are stackable. The merit waiver is applied to the tuition component the family actually pays after government reimbursement. Talk to admissions before counselling so we can model the net figure for you.",
  },
  {
    q: "When do I apply on the UP portal?",
    a: "After admission. The UP scholarship.up.gov.in portal opens for fresh applications between July and October each year. We help every eligible BIPE student fill the form correctly the first time — most rejections are clerical.",
  },
  {
    q: "What income proof is needed?",
    a: "An income certificate from the tehsildar / SDM (₹2.5 lakh family income for OBC, ₹2 lakh for SC/ST per current UP norms) plus a category certificate. Apply for both at the tehsil the day after JEECUP results — they take 7 to 10 working days.",
  },
  {
    q: "Does the waiver cover hostel?",
    a: "Government post-matric covers tuition; hostel and mess are separate. On-campus boys' hostel accommodation is ₹12,000/year (one-time, non-refundable) and mess is ₹4,000/month paid in advance — billed separately from tuition. BIPE merit waivers (including the 50% top-2,000-JEECUP-rank scholarship) are tuition-only.",
  },
  // ─── Hindi vernacular Q&As — for families searching "scholarship in
  // hindi" / "UP government scholarship कितनी" / "BIPE scholarship"
  {
    q: "SC/ST students के लिए BIPE में क्या scholarship है?",
    a: "UP Government का post-matric scholarship — SC/ST students को full tuition reimbursement मिलती है (income ceiling के अंदर — currently ₹2 lakh family income). Apply scholarship.up.gov.in portal पर admission के बाद होता है। BIPE की scholarships team पूरी process में मदद करती है — हर साल हम सैकड़ों applications भरवाते हैं।",
  },
  {
    q: "BIPE merit scholarship क्या है — कितनी मिलती है?",
    a: "JEECUP 2026 में top 2,000 All-India rank वालों को 50% tuition waiver मिलता है — ₹30,150 की tuition पर सीधे ₹15,075/year। Alternatively, Class 10 में 90%+ वालों को 10% waiver। दोनों BIPE Trust की तरफ से, fee deposit के समय directly applied — कोई अलग application form नहीं भरना। (एक student के पास एक समय में सिर्फ़ एक Trust scholarship हो सकती है।)",
  },
  {
    q: "Government scholarship + BIPE merit — दोनों एक साथ मिल सकती हैं?",
    a: "हाँ — दोनों stackable हैं। UP Government का post-matric tuition cover करता है; BIPE merit उस residual portion पर applied होता है जो परिवार actually pay करता है। Net figure admission के समय admissions team हाथ से model करके बता देती है — आप WhatsApp पर पूछ सकते हैं।",
  },
];

/**
 * Schema.org JSON-LD for /scholarships — two blocks:
 *
 *   1. FAQPage — the 4 Q&As (eligibility, timing, income proof, hostel
 *      coverage). Matches the pattern already used on /fees, /faq, and
 *      /jeecup. Eligible for the FAQ rich-result accordion in SERP.
 *
 *   2. CollectionPage + ItemList<MonetaryGrant> — the 6 scholarship
 *      schemes (4 government + 2 BIPE Trust merit). MonetaryGrant is
 *      the semantically-correct Schema.org type for scholarships;
 *      EducationalOccupationalProgram would refer to the diploma itself,
 *      not the grants funding it.
 *
 * Why funder is split into two Organization types:
 *
 *   - Government schemes: GovernmentOrganization (UP State Govt or
 *     Government of India) — accurate, and helps Google associate the
 *     page with the official portals in scholarship.up.gov.in and NSP.
 *
 *   - Trust merit awards: EducationalOrganization with BIPE as the
 *     funder. Trust is the legal entity, but for graph purposes BIPE
 *     is the surface students interact with — and the trust signal
 *     reinforces "BIPE actively rewards merit", not just "the trust
 *     somewhere behind BIPE does".
 *
 * The MonetaryGrant nodes intentionally don't list a fixed `amount`
 * field — UP government reimbursements are income-tied and BIPE merit
 * is slab-based, so a single number would mislead. The `description`
 * carries the human-readable benefit instead.
 */
// Derive the FAQPage schema from the FAQS array (single source of
// truth). Matches the /fees and /jeecup pattern — adding a new Q&A
// to FAQS auto-flows through to the schema. Previously hardcoded
// inline, refactored May 2026 when Hindi Q&As were added.
const SCHOLARSHIPS_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Funder references — keep terse, anchored by URL where possible so
// Google deduplicates them across pages.
const FUNDER_UP_GOVT = {
  "@type": "GovernmentOrganization",
  name: "Government of Uttar Pradesh · Department of Social Welfare",
  url: "https://scholarship.up.gov.in",
} as const;

const FUNDER_INDIA_GOVT = {
  "@type": "GovernmentOrganization",
  name: "Government of India · National Scholarship Portal",
  url: "https://scholarships.gov.in",
} as const;

const FUNDER_BIPE = {
  "@type": "EducationalOrganization",
  name: "Banaras Institute of Polytechnic & Engineering",
  url: SITE_URL,
} as const;

type GrantInput = {
  id: string;
  name: string;
  description: string;
  funder: typeof FUNDER_UP_GOVT | typeof FUNDER_INDIA_GOVT | typeof FUNDER_BIPE;
  url?: string;
};

const GRANT_SCHEMES: GrantInput[] = [
  {
    id: "sc-st-post-matric",
    name: "SC / ST Post-Matric Scholarship (Uttar Pradesh)",
    description:
      "Full tuition reimbursement for SC and ST students at BIPE, subject to the UP State Government's annual income ceiling.",
    funder: FUNDER_UP_GOVT,
    url: "https://scholarship.up.gov.in",
  },
  {
    id: "obc-post-matric",
    name: "OBC Post-Matric Scholarship (Uttar Pradesh)",
    description:
      "Partial tuition reimbursement for OBC students at BIPE, subject to the UP State Government's family income ceiling (currently ₹2.5 lakh).",
    funder: FUNDER_UP_GOVT,
    url: "https://scholarship.up.gov.in",
  },
  {
    id: "ews-reimbursement",
    name: "EWS Tuition Reimbursement (Uttar Pradesh)",
    description:
      "Partial tuition reimbursement for students with a valid EWS certificate, per current UP State Government norms.",
    funder: FUNDER_UP_GOVT,
    url: "https://scholarship.up.gov.in",
  },
  {
    id: "minority-nsp",
    name: "Minority Scholarships via National Scholarship Portal",
    description:
      "Central Government pre-matric, post-matric and merit-cum-means scholarships for minority community students, applied through the NSP portal.",
    funder: FUNDER_INDIA_GOVT,
    url: "https://scholarships.gov.in",
  },
  {
    id: "bipe-jeecup-merit",
    name: "BIPE JEECUP Top-Rank Merit Award",
    description:
      "50% tuition waiver on the published ₹30,150 annual tuition for any candidate within the top 2,000 JEECUP 2026 All-India rank. Applied directly at the time of fee deposit on production of the JEECUP rank card. Stackable on top of government post-matric reimbursements.",
    funder: FUNDER_BIPE,
  },
  {
    id: "bipe-class10-topper",
    name: "BIPE Class 10 Topper Merit Award",
    description:
      "10% tuition waiver for students with 90%+ aggregate in Class 10. Applied at the time of fee deposit on production of the 10th marksheet. Stackable on top of government reimbursements (not stackable with the BIPE JEECUP award).",
    funder: FUNDER_BIPE,
  },
];

const SCHOLARSHIPS_GRANTS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/scholarships`,
  url: `${SITE_URL}/scholarships`,
  name: "Scholarships · BIPE Varanasi",
  description:
    "Government post-matric and BIPE Trust merit scholarships for diploma students at Banaras Institute of Polytechnic & Engineering — SC/ST, OBC, EWS, Minority, JEECUP top-rank and Class 10 toppers.",
  about: {
    "@type": "CollegeOrUniversity",
    name: "Banaras Institute of Polytechnic & Engineering",
    url: SITE_URL,
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Scholarships available to BIPE students",
    numberOfItems: GRANT_SCHEMES.length,
    itemListElement: GRANT_SCHEMES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MonetaryGrant",
        "@id": `${SITE_URL}/scholarships#${g.id}`,
        name: g.name,
        description: g.description,
        funder: g.funder,
        ...(g.url ? { url: g.url } : {}),
      },
    })),
  },
};

export default function Page() {
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Admission", path: "/admission" },
              { name: "Scholarships", path: "/scholarships" },
            ]),
          ),
        }}
      />
      {/* FAQPage — eligible for the FAQ rich-result accordion. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHOLARSHIPS_FAQ_JSON_LD) }}
      />
      {/* CollectionPage + ItemList<MonetaryGrant> — see schema rationale
          above for why MonetaryGrant (not EducationalOccupationalProgram). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHOLARSHIPS_GRANTS_JSON_LD) }}
      />
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 30%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: 820 }}>
            <div className="eyebrow">Scholarships</div>
            <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
              Many BIPE students{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                pay much less
              </span>{" "}
              than the published fee.
            </h1>
            <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
              Full UP Government post-matric scholarships cover tuition for SC, ST, OBC, EWS, Minority and General categories. BIPE merit scholarships — for top JEECUP and 10th-class rankers — stack on top.
            </p>
            <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
              <Link href="/apply" className="btn btn-primary btn-lg">Apply for 2026-27 <ArrowIcon size={16} /></Link>
              <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                <WhatsAppIcon /> Ask about Admissions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. GOVERNMENT SCHOLARSHIPS                                              */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, top: -120, width: 320, height: 320, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Government schemes</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Four{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  reimbursement
                </span>{" "}
                routes.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Each scheme has its own portal, income ceiling and renewal cadence. Our scholarships team has filed thousands — we know what catches and how to clear it.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {GOV.map((g) => (
              <article key={g.cat} className="card" style={{ padding: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 48, lineHeight: 0.85,
                    color: "var(--brand)",
                    width: 56, textAlign: "right",
                  }}>
                    ({g.roman})
                  </div>
                  <div>
                    <span className="pill pill-accent" style={{ fontSize: 11 }}>{g.cat}</span>
                    <h3 className="bipe-h3" style={{ marginTop: 12, fontSize: 20 }}>{g.benefit}</h3>
                    <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{g.note}</p>
                    <a href={g.href} target="_blank" rel="noopener noreferrer" style={{
                      marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8,
                      fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.04em",
                      color: "var(--brand)", fontWeight: 600,
                    }}>
                      {g.portal} <ArrowIcon size={12} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. MERIT-BASED (DARK)                                                   */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, top: -180, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 40%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>BIPE merit awards</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "16ch" }}>
                For students who earned{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  the rank.
                </span>
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "42ch", justifySelf: "end", textAlign: "right" }}>
              Stackable on top of any government reimbursement. Awarded by Trust resolution each admission cycle, applied at the time of fee payment.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 0, border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderRadius: 24, overflow: "hidden", maxWidth: 880, margin: "0 auto" }}>
            <div style={{ padding: "44px 36px", borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>JEECUP top rank</div>
              {/* 28 May 2026 — anchored to the actual published Trust
                  policy at the user's direction: candidates within the
                  top 2,000 JEECUP 2026 All-India rank get a 50%
                  scholarship on BIPE tuition. Previous "10-20% upto
                  5000 rank" framing has been retired in favour of the
                  concrete top-2000 / 50% number. */}
              <div className="serif" style={{
                marginTop: 18,
                fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(56px, 7vw, 96px)",
                lineHeight: 0.85, color: "var(--accent)",
                letterSpacing: "-0.02em",
              }}>
                50%
              </div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                Tuition waiver · top 2,000 JEECUP 2026 rank
              </div>
              <p style={{ marginTop: 22, fontSize: 15, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 78%, transparent)", maxWidth: "40ch" }}>
                Trust scholarship of 50% on the published ₹30,150 annual tuition for any candidate within the top 2,000 JEECUP 2026 All-India rank. Applied directly at the time of fee deposit on production of the JEECUP rank card. Stackable on top of UP Govt post-matric reimbursement.
              </p>
            </div>

            <div style={{ padding: "44px 36px", background: "color-mix(in oklab, var(--brand) 14%, var(--ink))" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Class 10 topper</div>
              <div className="serif" style={{
                marginTop: 18,
                fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(56px, 7vw, 96px)",
                lineHeight: 0.85, color: "var(--accent)",
                letterSpacing: "-0.02em",
              }}>
                10%
              </div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                90%+ in Class 10 · marksheet proof
              </div>
              <p style={{ marginTop: 22, fontSize: 15, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 78%, transparent)", maxWidth: "40ch" }}>
                For students with 90%+ aggregate in Class 10. Show the 10th marksheet at the time of fee deposit; the 10% tuition reduction is applied immediately.
              </p>
            </div>
          </div>

          <p style={{
            marginTop: 24,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.06em",
            color: "color-mix(in oklab, var(--paper) 70%, transparent)",
            textAlign: "center",
          }}>
            Note: only one Trust scholarship at a time per student — the JEECUP and Class 10 awards are not stackable with each other.
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. HOW REVIEW WORKS                                                     */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow">The promise</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "22ch", marginInline: "auto" }}>
              Twenty-four hours from your message{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                to a clear answer.
              </span>
            </h2>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, maxWidth: 1080, margin: "0 auto" }}>
            {[
              {
                n: "01",
                title: "Send your details",
                body: "Category, family income range, JEECUP rank (or expected) and 10th marks. Photo of the relevant certificate is enough to start.",
              },
              {
                n: "02",
                title: "24-hour review",
                body: "Our scholarships team confirms eligibility for each scheme — government and merit — and gives you the net annual figure in writing.",
              },
              {
                n: "03",
                title: "Award letter or guidance",
                body: "If approved we issue the award letter; if not, we walk you through the portal application step-by-step until the reimbursement clears.",
              },
            ].map((s) => (
              <article key={s.n} className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -50, top: -50, width: 160, height: 160, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 56, lineHeight: 0.85, color: "var(--brand)",
                    letterSpacing: "-0.02em",
                  }}>
                    {s.n}
                  </div>
                  <h3 className="bipe-h3" style={{ marginTop: 14, fontSize: 19 }}>{s.title}</h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. COMMON QUESTIONS                                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Common questions</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Four questions{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  every family asks.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Did not find your question? Message admissions on WhatsApp — same-day reply, in English or Hindi.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {FAQS.map((f, i) => (
              <article key={f.q} className="card" style={{ padding: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 40, lineHeight: 0.85,
                    color: "var(--brand)",
                    width: 56, textAlign: "right",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3 }}>{f.q}</h3>
                    <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>{f.a}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. CTA                                                                  */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28, border: "1px solid var(--line)",
            background: "var(--ink)", color: "var(--paper)",
            padding: "56px 56px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "64px 64px", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 36%, transparent)",
              filter: "blur(120px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>Ask the scholarships team</div>
                <p className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(28px, 3.4vw, 48px)",
                  lineHeight: 1.1, color: "var(--paper)",
                  marginTop: 18, maxWidth: "20ch",
                }}>
                  We help every eligible family{" "}
                  <span style={{ color: "var(--accent)" }}>claim what they qualify for.</span>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/apply" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                  Apply for 2026-27 <ArrowIcon size={16} />
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-wa" style={{ justifyContent: "space-between" }}>
                  WhatsApp scholarships <WhatsAppIcon />
                </a>
                <a href={`tel:${DATA.contact.phone}`} className="btn btn-lg" style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)", justifyContent: "space-between" }}>
                  <span><PhoneIcon /> {DATA.contact.phone}</span>
                  <ArrowIcon size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="bipe-img-strip" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <IconTile icon={Award} label="Award day · 2024 cohort" tone="accent" style={{ height: 220, borderRadius: 18 }} />
            <Img src={BIPE_IMG.studentWriting} label="Filing the portal form" style={{ height: 220, borderRadius: 18 }} />
          </div>
        </div>
      </section>
    </div>
  );
}

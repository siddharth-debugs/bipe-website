import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { PUBLIC_BRANCHES, PUBLIC_SEATS } from "@/lib/data";
import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";

const _placed = formatPlacements(PLACEMENT_STATS.totalPlacements);

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("jeecupCutoff2026");
}

interface CutoffRow {
  institute: string;
  branch: string;
  marksGeneral: string;
  closingRank: string;
  category: "Top tier (state)" | "Eastern UP" | "BIPE";
}

const CUTOFFS: CutoffRow[] = [
  // Top tier
  { institute: "Government Polytechnic Lucknow", branch: "Computer Science Engineering", marksGeneral: "300+", closingRank: "~2,000-3,500", category: "Top tier (state)" },
  { institute: "Government Polytechnic Kanpur", branch: "Mechanical Engineering", marksGeneral: "280+", closingRank: "~3,000-5,000", category: "Top tier (state)" },
  { institute: "Government Polytechnic Ghaziabad", branch: "Computer Science Engineering", marksGeneral: "290+", closingRank: "~2,500-4,000", category: "Top tier (state)" },
  // Eastern UP
  { institute: "Government Polytechnic Jaunpur", branch: "Electrical Engineering", marksGeneral: "~200+", closingRank: "~16,000", category: "Eastern UP" },
  { institute: "Government Polytechnic Jaunpur", branch: "Mechanical Engineering", marksGeneral: "~200+", closingRank: "~14,000-18,000", category: "Eastern UP" },
  { institute: "Government Polytechnic Kuru Pindra, Varanasi", branch: "Electrical Engineering (one of two branches)", marksGeneral: "Variable · only 30 seats", closingRank: "Sharp · rank-competitive", category: "Eastern UP" },
  { institute: "Government Polytechnic Mirzapur", branch: "Civil / Electrical / Mechanical", marksGeneral: "~180+", closingRank: "~18,000-25,000 typical", category: "Eastern UP" },
  { institute: "Government Polytechnic Azamgarh", branch: "Mechanical / Electrical", marksGeneral: "~190+", closingRank: "~15,000-22,000", category: "Eastern UP" },
  // BIPE
  { institute: "BIPE Phoolpur (private · code 4455)", branch: "Civil Engineering", marksGeneral: "Open to wider rank band", closingRank: "Final rounds · upgradation seats", category: "BIPE" },
  { institute: "BIPE Phoolpur (private · code 4455)", branch: "Computer Science Engineering", marksGeneral: "Open to wider rank band", closingRank: "Final rounds · upgradation seats", category: "BIPE" },
  { institute: "BIPE Phoolpur (private · code 4455)", branch: "Mechanical (Production)", marksGeneral: "Open to wider rank band", closingRank: "Final rounds · upgradation seats", category: "BIPE" },
  { institute: "BIPE Phoolpur (private · code 4455)", branch: "Electrical Engineering", marksGeneral: "Open to wider rank band", closingRank: "Final rounds · upgradation seats", category: "BIPE" },
];

const FAQS = [
  {
    q: "What was the JEECUP 2025 cutoff and how does that predict 2026?",
    a: "JEECUP 2025 general-category qualifying marks were ~77.3, with OBC at ~77 and SC/ST at ~68.6. But qualifying marks are very different from institute-level cutoffs. For seat allotment at popular government polytechnics, you typically need 200+ marks (Eastern UP government polytechnics) or 280-300+ marks (top-tier Lucknow/Kanpur/Ghaziabad CSE/Mechanical). JEECUP 2026 cutoffs are released round by round during counselling — Round 1 cutoff sets the baseline; Rounds 2-5 see upgradations and additional seat opening.",
  },
  {
    q: "What rank should I aim for to secure a government polytechnic seat in Eastern UP?",
    a: "For Eastern UP government polytechnics (Jaunpur, Mirzapur, Ghazipur, Azamgarh), Round 1 closing ranks for popular branches typically fall between 14,000 and 20,000 in the general category. Below ~14,000 you have strong chances at most local government polytechnics in your preferred branch. Above ~22,000, the math becomes harder — popular branches at popular institutes fill, and you may be looking at upgradations or final-round openings.",
  },
  {
    q: "Why does BIPE not publish a 'closing rank'?",
    a: "Private polytechnic admission through JEECUP is structurally different from government. Government polytechnics have fixed per-branch capacity that fills sharply by rank in Round 1. Private polytechnics like BIPE participate across all 5 JEECUP rounds and absorb seats as government allotments stabilise. BIPE's branch-wise availability persists into the later rounds — meaning a wider rank band can secure BIPE seats. We can't publish a single closing rank because the number isn't fixed the way government rank cutoffs are.",
  },
  {
    q: "If I get a borderline rank, should I take a government seat in any branch or wait for BIPE in my preferred branch?",
    a: "This is the single biggest decision rural families face. The honest answer: take the government seat in your preferred branch if you can, even at a less prestigious institute. Don't take a government seat in a branch you don't actually want — the diploma is 3 years of your life and the branch determines your placement pipeline. If your preferred branch isn't available at government, BIPE's wider rank band makes it the practical option — across all four branches (Civil, Electrical, Mechanical Engineering Production, Computer Science & Engineering), with on-campus hostel if you are travelling in from outside Varanasi.",
  },
  {
    q: "How does JEECUP rank affect aided polytechnic admission?",
    a: "Aided polytechnics (19 institutes in UP) participate in JEECUP counselling alongside government. Their closing ranks behave similarly to government polytechnics — sharp in Round 1 for popular branches, with upgradations across rounds. Because there are only 19 aided institutes, they fill quickly. Aim for an aided seat only if your rank is comfortably within the historical cutoff band and you've researched the specific institute's branch offerings.",
  },
  {
    q: "My rank is past the government cutoffs — what does a BIPE seat actually give me at that rank?",
    a: `Seat depth first, because that is what a wide rank band is made of: ${PUBLIC_SEATS} seats across ${PUBLIC_BRANCHES.length} branches — Civil (120), Electrical (120), Mechanical Engineering Production (120) and Computer Science & Engineering (120) — against a total intake of 60 students at the nearest government polytechnic, Kuru Pindra in Varanasi. A rank that closes government options in Round 1 can still reach the branch you actually want at BIPE in the later rounds. Beyond the seat count: an eight-section workshop (fitting, welding, foundry, machining, CNC, sheet metal), a 120-system computer lab, an on-campus survey yard for Civil, a 1:20 mentor ratio with home visits, an on-campus boys' hostel, and a published year-wise placement record of ${_placed} TPO-verified placements. Fees are AFRC-approved at ₹30,150/year, with UP Post-Matric reimbursement for eligible categories.`,
  },
  {
    q: "When is JEECUP 2026 counselling and how many rounds are there?",
    a: "JEECUP 2026 followed a 5-round counselling cycle in two phases that ran from late June through August 2026, following the rescheduled exam window of 02-09 June 2026. Round 1 sees the sharpest cutoffs; Rounds 2-5 progressively see upgradations, withdrawals, and final seat openings; the institute-level spot round follows Round 5. The full schedule is published on jeecup.admissions.nic.in — and BIPE's counselling guide on /jeecup-counselling walks through each round's strategy.",
  },
];

function categoryColor(cat: CutoffRow["category"]): string {
  if (cat === "Top tier (state)") return "var(--ink-3)";
  if (cat === "Eastern UP") return "var(--accent)";
  return "var(--brand)";
}

export default function Page() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    {
      name: "JEECUP Cutoff 2026 · BIPE vs Government",
      path: "/jeecup-cutoff-2026-bipe-vs-government",
    },
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="page-enter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* HERO */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: -180, top: -120, width: 460, height: 460, borderRadius: "50%", background: "color-mix(in oklab, var(--brand) 26%, transparent)", filter: "blur(120px)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", right: -160, bottom: -160, width: 420, height: 420, borderRadius: "50%", background: "color-mix(in oklab, var(--accent) 28%, transparent)", filter: "blur(120px)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">JEECUP 2026 · cutoff guide · government + BIPE</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "30ch" }}>
            JEECUP 2026 cutoff —{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              what your rank actually buys.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "64ch" }}>
            JEECUP 2025 closing ranks were sharper than most rural families expect.
            Top-tier government polytechnics (Lucknow, Kanpur, Ghaziabad) need 280-300+ marks
            for popular branches. Eastern UP government polytechnics see closing ranks around
            14,000-22,000 for general category. BIPE participates in all 5 rounds with a wider
            rank band. Below: branch-wise cutoff context for the 2026 cycle, plus an honest
            framework for what each rank tier actually qualifies for.
          </p>
          <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
            <Link href="/jeecup-counselling" className="btn btn-primary btn-lg">
              JEECUP counselling guide <ArrowIcon size={16} />
            </Link>
            <Link href="/government-polytechnic-in-eastern-up" className="btn btn-ghost btn-lg">
              See every government polytechnic in Eastern UP
            </Link>
          </div>
        </div>
      </section>

      {/* TIER OVERVIEW */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Three rank tiers · three different decisions</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            Where does{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              your rank land?
            </span>
          </h2>
          <div className="bipe-grid-3" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            <article className="card" style={{ padding: 26, background: "var(--paper)", borderTop: "4px solid #16a34a" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#16a34a", marginBottom: 8 }}>
                Top tier · Rank below ~5,000
              </div>
              <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3 }}>State-flagship government polytechnics open up</h3>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>
                Government Polytechnic Lucknow, Kanpur, Ghaziabad become realistic for popular
                branches (CSE, Mechanical). 280-300+ marks needed. The lowest-fee + highest-
                prestige route is yours to take.
              </p>
              <p style={{ marginTop: 12, fontSize: 13, fontStyle: "italic", color: "var(--ink-3)", lineHeight: 1.6 }}>
                BIPE is not the obvious choice for this tier — though the on-campus hostel
                and the published year-wise placement record are worth weighing if the
                flagship institutes sit a long way from home.
              </p>
            </article>
            <article className="card" style={{ padding: 26, background: "var(--paper)", borderTop: "4px solid var(--accent)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                Mid tier · Rank 5,000-20,000
              </div>
              <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3 }}>The Eastern UP government polytechnic band</h3>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>
                Government Polytechnic Jaunpur, Mirzapur, Ghazipur, Azamgarh open up here for
                most branches. Round 1 cutoffs typically close around 14,000-20,000. This is
                where the real decision-making happens for most rural families.
              </p>
              <p style={{ marginTop: 12, fontSize: 13, fontStyle: "italic", color: "var(--ink-3)", lineHeight: 1.6 }}>
                BIPE is a parallel option — list both in JEECUP choice-filling. If your branch
                doesn&rsquo;t secure at government, BIPE&rsquo;s {PUBLIC_BRANCHES.length} branches
                absorb across later rounds.
              </p>
            </article>
            <article className="card" style={{ padding: 26, background: "color-mix(in oklab, var(--brand) 6%, var(--paper))", borderTop: "4px solid var(--brand)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 8 }}>
                Wider band · Rank 20,000+
              </div>
              <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3 }}>BIPE becomes the structural fit</h3>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>
                Government polytechnic seats in popular Eastern UP institutes are largely gone
                by this rank tier in Round 1. BIPE participates through all 5 rounds with a
                wider rank band — {PUBLIC_BRANCHES.length} branches across {PUBLIC_SEATS} seats,
                on-campus hostel for distant catchments, AFRC ₹30,150 fees, UP Post-Matric
                Scholarship for eligible categories.
              </p>
              <p style={{ marginTop: 12, fontSize: 13, fontStyle: "italic", color: "var(--brand)", lineHeight: 1.6 }}>
                JEECUP code 4455. List all {PUBLIC_BRANCHES.length} branch preferences during
                choice-filling — the more you list, the more rounds you stay in contention for.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CUTOFF TABLE */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">JEECUP cutoff snapshot · indicative · 2025-2026</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            Cutoffs by{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              institute and branch.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "70ch", lineHeight: 1.7 }}>
            Indicative cutoffs derived from JEECUP 2025 published data and counselling-round
            outcomes. <strong>Verify final 2026 cutoffs</strong> on jeecup.admissions.nic.in
            after each round closes. Numbers below are guidance for choice-filling strategy,
            not commitments.
          </p>
          <div style={{ marginTop: 32, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>Institute</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>Branch</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>Marks (Gen)</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>Closing rank</th>
                </tr>
              </thead>
              <tbody>
                {CUTOFFS.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--line)", background: c.category === "BIPE" ? "color-mix(in oklab, var(--brand) 4%, transparent)" : "transparent" }}>
                    <td style={{ padding: "14px", verticalAlign: "top", color: "var(--ink-1)", lineHeight: 1.5 }}>
                      <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: categoryColor(c.category), marginBottom: 4, textTransform: "uppercase" }}>{c.category}</div>
                      <div style={{ fontWeight: 600 }}>{c.institute}</div>
                    </td>
                    <td style={{ padding: "14px", verticalAlign: "top", color: "var(--ink-2)", lineHeight: 1.5 }}>{c.branch}</td>
                    <td style={{ padding: "14px", verticalAlign: "top", color: "var(--ink-2)", lineHeight: 1.5 }}>{c.marksGeneral}</td>
                    <td style={{ padding: "14px", verticalAlign: "top", color: "var(--ink-2)", lineHeight: 1.5 }}>{c.closingRank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 24, color: "var(--ink-3)", fontSize: 12, fontStyle: "italic", lineHeight: 1.7, maxWidth: "70ch" }}>
            Sources: JEECUP 2025 official published cutoffs, BTE UP gazette,
            Careers360 / Collegedunia analysis. BIPE&rsquo;s entries reflect the wider rank
            band typical of private-polytechnic admission via JEECUP rounds 1-5.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Common JEECUP-cutoff questions · 2026</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            What students ask{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              about their rank.
            </span>
          </h2>
          <div style={{ marginTop: 28, display: "grid", gap: 14, maxWidth: "78ch" }}>
            {FAQS.map((f, i) => (
              <article key={i} className="card" style={{ padding: "22px 26px", background: "var(--paper)" }}>
                <h3 className="bipe-h3" style={{ fontSize: 17, lineHeight: 1.35, color: "var(--ink-1)" }}>{f.q}</h3>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>{f.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: "1px solid var(--line)", background: "var(--white)", padding: "48px 48px" }}>
            <div aria-hidden="true" style={{ position: "absolute", left: -160, top: -120, width: 360, height: 360, borderRadius: "50%", background: "color-mix(in oklab, var(--brand) 22%, transparent)", filter: "blur(110px)", pointerEvents: "none" }} />
            <div aria-hidden="true" style={{ position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%", background: "color-mix(in oklab, var(--accent) 32%, transparent)", filter: "blur(110px)", pointerEvents: "none" }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div className="eyebrow">Got your JEECUP rank?</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                  Tell us your rank.{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    We&rsquo;ll be honest.
                  </span>
                </h2>
                <p style={{ marginTop: 16, color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6, maxWidth: "46ch" }}>
                  Share your JEECUP rank + preferred branch + home district on WhatsApp.
                  We&rsquo;ll tell you whether government, aided, or BIPE is realistically your
                  best fit. EN / हिंदी. No commitment.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <a href="https://wa.me/917310077788?text=Hi%20BIPE%20%E2%80%94%20My%20JEECUP%202026%20rank%20is%20%5Brank%5D%2C%20I%20want%20to%20discuss%20whether%20government%20or%20BIPE%20fits%20best." target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ justifyContent: "space-between" }}>
                  WhatsApp with your rank <WhatsAppIcon />
                </a>
                <Link href="/apply" className="btn btn-ghost btn-lg" style={{ justifyContent: "space-between" }}>
                  Start BIPE application <ArrowIcon size={16} />
                </Link>
                <Link href="/jeecup-counselling" className="btn btn-ghost btn-lg" style={{ justifyContent: "space-between" }}>
                  Round-by-round counselling guide <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

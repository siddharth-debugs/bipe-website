import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("aidedPolytechnicUp");
}

const KEY_DIFFS = [
  {
    heading: "Funding model",
    govt: "Fully state-funded. Operating costs covered by UP technical-education department.",
    aided: "Partially state-funded. State pays teachers and grants operational subsidy. Capital + management private.",
    private: "Fully self-funded via student tuition. No state grant.",
  },
  {
    heading: "Fees per academic year",
    govt: "₹11,870 – ₹35,610 (government fee structure)",
    aided: "Government-set fee, in the same low range. Cannot charge private rates.",
    private: "₹30,000 – ₹1,01,000+ (varies by AFRC approval status and institute reputation)",
  },
  {
    heading: "Total institutes in UP",
    govt: "154",
    aided: "19 (rare)",
    private: "1,200+",
  },
  {
    heading: "Admission route",
    govt: "JEECUP counselling — government-quota cutoffs typically sharper",
    aided: "JEECUP counselling — treated similarly to government for fee subsidy purposes",
    private: "JEECUP counselling — private-quota cutoffs typically softer (more seats)",
  },
  {
    heading: "Faculty employment",
    govt: "State-government employees (job-secured cadre)",
    aided: "Government-paid (where the grant applies), some private staff",
    private: "Private employees — institute-driven HR",
  },
  {
    heading: "Branch portfolio",
    govt: "Varies by institute; commonly 3-5 standard engineering branches",
    aided: "Varies; some aided institutes offer specialised branches",
    private: "Wider variation — niche branches (e.g., Dairy Engineering at BIPE) more common at private",
  },
];

const FAQS = [
  {
    q: "What is an aided polytechnic college in UP?",
    a: "An aided polytechnic in UP is an institute that receives operating-grant subsidy from the state government but is privately managed. The state typically pays faculty salaries and provides some operational support; the institute's capital and broader management are private. The defining feature: aided polytechnics are authorised to charge only government-set fees (lower than private), even though their operational structure is private.",
  },
  {
    q: "How many aided polytechnics exist in Uttar Pradesh?",
    a: "Approximately 19 aided polytechnic institutions operate in UP — making them rare compared to 154 government polytechnics and 1,200+ private polytechnics. Because they're rank-competitive (low fees + scarce seats), aided seats fill quickly during JEECUP counselling rounds.",
  },
  {
    q: "Are aided polytechnic degrees treated the same as government polytechnic degrees?",
    a: "Legally, yes — both result in a BTE UP-affiliated diploma certificate with identical credential weight for SSC JE, RRB JE, UPPCL eligibility and AKTU lateral entry. The diploma certificate doesn't distinguish between government, aided, and private institutes on its face. The differences (faculty cadre, infrastructure, placement support) are operational.",
  },
  {
    q: "Should I aim for an aided polytechnic instead of BIPE?",
    a: "If your JEECUP rank confidently secures a seat at one of UP's 19 aided polytechnics in a branch you want, and the lower fee structure makes a real difference for your family — yes, the aided route is sensible. If your rank is borderline, or if the aided institute doesn't offer your preferred branch (e.g., Dairy Engineering is rare across both government and aided), or if you need hostel access at a specific location, BIPE remains the structurally better fit. See /private-vs-government-polytechnic for the broader framework.",
  },
  {
    q: "Are there any aided polytechnics in Eastern UP?",
    a: "Yes — a few of UP's 19 aided polytechnics serve Eastern UP catchments. Verify the current academic year's aided-institute list on the BTE UP fee notification or the JEECUP counselling portal. The total being so small (19 statewide) makes Eastern UP coverage thin — most rank-competitive students from the Varanasi / Jaunpur / Ghazipur / Mirzapur belt either secure a government seat, an aided seat (rare), or move to a private polytechnic like BIPE.",
  },
  {
    q: "What's the difference between aided and unaided in terms of student experience?",
    a: "On day-to-day student experience, the differences are often subtle: similar fee structure to government, similar BTE UP curriculum, similar JEECUP-based admission. Where aided institutes can differ from pure government is in management agility — private operational management can sometimes mean faster decision cycles on facility upgrades, lab equipment, placement-cell intensity. But this varies widely by institute and shouldn't be assumed.",
  },
];

export default function Page() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    {
      name: "Aided Polytechnic in UP",
      path: "/aided-polytechnic-uttar-pradesh",
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
          <div className="eyebrow">The rare third lane · 2026-27</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "30ch" }}>
            Aided polytechnic in UP —{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              the option most families don&rsquo;t know exists.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            Uttar Pradesh has 154 government polytechnics and 1,200+ private ones. Between them sits a
            quiet category most applicants overlook: <strong>19 aided polytechnic institutions</strong>,
            government-funded but privately managed. Low fees, rank-competitive admission, often
            invisible in coaching-centre advice. Here&rsquo;s what they are, when to consider them,
            and where BIPE fits if you don&rsquo;t make the cut.
          </p>
          <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
            <Link href="/government-polytechnic-in-eastern-up" className="btn btn-primary btn-lg">
              See government polytechnics in Eastern UP <ArrowIcon size={16} />
            </Link>
            <Link href="/private-vs-government-polytechnic" className="btn btn-ghost btn-lg">
              The honest framework
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">What "aided" means · plain English</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            Government-funded.{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              Privately managed.
            </span>{" "}
            Same diploma.
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "70ch", lineHeight: 1.7 }}>
            An aided polytechnic receives operational subsidy from the state government — typically
            faculty salaries and a portion of running costs — but the institute is privately owned
            and managed. Three operational consequences:
          </p>
          <ol style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "70ch", lineHeight: 1.8, paddingLeft: 22 }}>
            <li><strong>Fees are government-set</strong> — aided institutes cannot charge private-school rates. Fees sit in the same ₹11,870-35,610/year band as government polytechnics.</li>
            <li><strong>Admission is JEECUP-based</strong> — same counselling rounds, same merit-rank system. Aided seats are treated similarly to government for the fee-subsidy benefit.</li>
            <li><strong>Faculty are partly government-paid</strong> — where the grant applies, teachers are government-cadre employees. Some institutes mix government-paid and private faculty.</li>
          </ol>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Government vs Aided vs Private · the comparison</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            Six dimensions,{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              three categories.
            </span>
          </h2>
          <div style={{ marginTop: 32, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>Dimension</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>Government (154)</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)", background: "color-mix(in oklab, var(--accent) 8%, transparent)" }}>Aided (19)</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand)" }}>Private incl. BIPE (1,200+)</th>
                </tr>
              </thead>
              <tbody>
                {KEY_DIFFS.map((d) => (
                  <tr key={d.heading} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "16px 14px", verticalAlign: "top", fontWeight: 600, color: "var(--ink-1)" }}>{d.heading}</td>
                    <td style={{ padding: "16px 14px", verticalAlign: "top", color: "var(--ink-2)", lineHeight: 1.6 }}>{d.govt}</td>
                    <td style={{ padding: "16px 14px", verticalAlign: "top", color: "var(--ink-2)", lineHeight: 1.6, background: "color-mix(in oklab, var(--accent) 4%, transparent)" }}>{d.aided}</td>
                    <td style={{ padding: "16px 14px", verticalAlign: "top", color: "var(--ink-2)", lineHeight: 1.6 }}>{d.private}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHO SHOULD CONSIDER */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">Who should aim for an aided seat</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "28ch" }}>
            When the aided route{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              is worth chasing.
            </span>
          </h2>
          <div className="bipe-grid-2" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
            <article className="card" style={{ padding: 26, background: "var(--paper)", borderTop: "4px solid var(--accent)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                Aim for aided when
              </div>
              <ul style={{ paddingLeft: 20, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>
                <li>Your JEECUP rank is strong (top 5,000-15,000 for general category)</li>
                <li>The aided institute in your region offers the branch you want</li>
                <li>You&rsquo;re comfortable with a JEECUP-only admission process</li>
                <li>Lower fee is a binding consideration for your family</li>
                <li>You&rsquo;re willing to attend the institute&rsquo;s location (limited geographic spread)</li>
              </ul>
            </article>
            <article className="card" style={{ padding: 26, background: "color-mix(in oklab, var(--brand) 6%, var(--paper))", borderTop: "4px solid var(--brand)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 8 }}>
                BIPE remains the fit when
              </div>
              <ul style={{ paddingLeft: 20, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>
                <li>Your rank doesn&rsquo;t safely secure an aided seat in your branch</li>
                <li>You want Dairy Engineering (BIPE is one of 4 BTE UP Dairy programmes in UP)</li>
                <li>You need hostel access on-campus (BIPE&rsquo;s Phoolpur hostel)</li>
                <li>You want documented placement infrastructure (1,331 verified placements at 44 recruiters)</li>
                <li>You&rsquo;re from Eastern UP and BIPE is the geographically practical 5-branch option</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Common questions</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            What families ask{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              about the aided category.
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
                <div className="eyebrow">Comparing all three options?</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                  Talk to a real counsellor.{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    Get the honest answer.
                  </span>
                </h2>
                <p style={{ marginTop: 16, color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6, maxWidth: "46ch" }}>
                  Tell us your JEECUP rank, your preferred branch, and where you live — we&rsquo;ll
                  give you a straight answer on whether government, aided, or BIPE is your best
                  fit. No pressure, no commitment, EN / हिंदी on WhatsApp.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <a href="https://wa.me/919198646464?text=Hi%20BIPE%20%E2%80%94%20I%20want%20to%20understand%20whether%20government%2C%20aided%2C%20or%20BIPE%20is%20best%20for%20my%20JEECUP%20rank." target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ justifyContent: "space-between" }}>
                  WhatsApp counsellor <WhatsAppIcon />
                </a>
                <Link href="/visit" className="btn btn-ghost btn-lg" style={{ justifyContent: "space-between" }}>
                  Book a campus visit <ArrowIcon size={16} />
                </Link>
                <Link href="/jeecup-counselling" className="btn btn-ghost btn-lg" style={{ justifyContent: "space-between" }}>
                  JEECUP counselling guide <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

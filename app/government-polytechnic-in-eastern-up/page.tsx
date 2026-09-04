import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";

const _placed = formatPlacements(PLACEMENT_STATS.totalPlacements);
const _recruiters = PLACEMENT_STATS.totalRecruiters;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("governmentPolytechnicEasternUp");
}

interface GovtPoly {
  name: string;
  location: string;
  founded?: string;
  branches: string;
  seats: string;
  fees: string;
  notes: string;
}

const POLYTECHNICS: GovtPoly[] = [
  {
    name: "Government Polytechnic Kuru Pindra",
    location: "Varanasi (Kuru Pindra block)",
    branches: "Electrical Engineering · Textile Engineering",
    seats: "60 total · 30 per branch",
    fees: "~₹22,000 per academic year (upper end of GP fee range)",
    notes:
      "The only general government polytechnic within Varanasi district. Total intake of just 60 students across 2 branches makes it sharply rank-competitive. Most JEECUP applicants from Varanasi and surrounding districts do not secure a seat here.",
  },
  {
    name: "Government Girls Polytechnic Varanasi",
    location: "Varanasi",
    branches: "Multiple branches (Civil, Electronics, etc. — verify current offering)",
    seats: "Limited per branch",
    fees: "Government structure (~₹12,000-22,000/year)",
    notes:
      "Girls-only catchment. Strong reputation, BTE UP-affiliated. Boys are not eligible — a real constraint for many family situations.",
  },
  {
    name: "Government Polytechnic Mirzapur",
    location: "Mirzapur city",
    branches: "Civil, Electrical, Mechanical (verify current syllabus on BTE UP portal)",
    seats: "Standard government intake",
    fees: "Government structure (~₹12,000-22,000/year)",
    notes:
      "Serves Mirzapur district. Standard government intake and fee structure, with Round-1 closing ranks that have run around 18,000-25,000 in the general category. Mirzapur applicants comparing this against BIPE are weighing the same four engineering branches on either route — the difference is seat depth, hostel access and placement support rather than the branch list.",
  },
  {
    name: "Government Polytechnic Jaunpur",
    location: "Jaunpur",
    founded: "1984",
    branches: "Mechanical, Civil, Electrical, Electronics (verify current syllabus)",
    seats: "Standard government intake",
    fees: "Government structure (~₹12,000-22,000/year)",
    notes:
      "One of Eastern UP's longer-running BTE UP government polytechnics. JEECUP cutoffs in popular branches close around 16,000 rank with ~200+ marks in the general category per recent cycles.",
  },
  {
    name: "Government Polytechnic Ghazipur",
    location: "Ghazipur district",
    branches: "Civil, Electrical, Mechanical (verify current syllabus)",
    seats: "Standard government intake",
    fees: "Government structure (~₹12,000-22,000/year)",
    notes:
      "Serves Ghazipur's agricultural and small-industry belt. Standard government intake and fee structure. Ghazipur is 80 km from Phoolpur, so applicants who miss the Round-1 cutoff here commonly list BIPE alongside the Varanasi-district government options — with the on-campus hostel doing the work a daily commute cannot.",
  },
  {
    name: "Government Polytechnic Bara, Prayagraj",
    location: "Bara block, Prayagraj district",
    branches: "Civil, Electrical, Mechanical, CSE (verify on BTE UP portal)",
    seats: "Standard government intake",
    fees: "Government structure",
    notes:
      "Serves the Allahabad / Prayagraj belt and adjoining districts. Operated by the Prerna Group under the UP technical-education department.",
  },
  {
    name: "Government Polytechnic Azamgarh",
    location: "Azamgarh district",
    branches: "Civil, Electrical, Mechanical (verify current syllabus)",
    seats: "Standard government intake — rank competitive",
    fees: "Government structure (~₹12,000-22,000/year)",
    notes:
      "Azamgarh has one of Eastern UP's larger JEECUP applicant pools, so cutoffs at the local government polytechnic can run sharper than the regional average.",
  },
];

const FAQS = [
  {
    q: "How many government polytechnics are there in Uttar Pradesh, and how does this affect my admission chances?",
    a: "Uttar Pradesh has 154 government polytechnics, 19 aided institutions, and over 1,200 private polytechnics — yet government seats fill first because of lower fees. For any given JEECUP cycle, the vast majority of candidates do not secure a government seat in their preferred branch. The math: ~154 institutes × ~120 seats per institute ≈ 18,000-20,000 government seats annually, against 50,000+ JEECUP applicants in the front rank pool.",
  },
  {
    q: "What is the typical fee range at UP government polytechnics?",
    a: "UP government polytechnic fees range from approximately ₹12,000 to ₹22,000 per academic year, varying by institute, branch, and category. The lower end (~₹12,000) is typical for general government polytechnics; the upper end (~₹22,000) applies at specific institutes like Government Polytechnic Kuru Pindra in Varanasi. Verify the current fee structure on the BTE UP fee gazette or the institute's own notice.",
  },
  {
    q: "Is a government polytechnic diploma worth more than a private one from BIPE?",
    a: "Legally, no. Both BIPE and every government polytechnic listed above are affiliated to Board of Technical Education, Uttar Pradesh (BTE UP). The diploma certificate is identical — same paper, same authority, same legal weight for SSC JE, RRB JE, UPPCL JE eligibility and AKTU lateral entry. The differences are operational: cohort size, mentor accessibility, placement infrastructure, branch portfolio, and hostel availability. See /private-vs-government-polytechnic for the honest comparison framework.",
  },
  {
    q: "What is an 'aided' polytechnic and how does it differ from government?",
    a: "Aided polytechnics receive financial support from the state government but are managed privately. UP has 19 such aided institutions, and they're authorised to charge only government-set fees (typically lower than private). Teachers may be government-paid. From a student's perspective, aided polytechnics behave like government polytechnics on fees and admission process (JEECUP-based) but with private operational management. The 19-institute count makes them rare and admission rank-competitive. See /aided-polytechnic-uttar-pradesh for a deeper look.",
  },
  {
    q: "If my JEECUP rank is borderline for a government seat, should I take BIPE or wait?",
    a: "JEECUP counselling ran 5 rounds across two phases for the 2026 cycle. If your rank is genuinely close to a government polytechnic cutoff in a branch you want, sit through the rounds — government seats sometimes open up after upgradation across the additional rounds. But don't lose your BIPE preference: list it in your choices simultaneously. BIPE participates in JEECUP under institute code 4455 and is a strong fallback if the government seat doesn't materialise. The risk of waiting too long: by the final round, both options may be gone.",
  },
  {
    q: "Are the placement records published by these government polytechnics comparable to BIPE's?",
    a: `Most UP government polytechnics do not publish year-wise named placement data publicly. Government-recruitment placements happen through national-level exams (SSC JE, RRB JE) which students self-apply to — the institute's role is academic preparation, not on-campus drive intensity. BIPE's documented record of ${_placed} named placements across ${_recruiters} recruiters is a private-institute advantage that government polytechnics typically don't replicate. The named placement list is public on /alumni.`,
  },
  {
    q: "The government polytechnic near me doesn't offer the branch I want. What are my options?",
    a: "This is the most common reason Eastern UP families end up at a private polytechnic, and it is a better reason than rank alone. Most district government polytechnics run three standard branches (Civil, Electrical, Mechanical) at fixed per-branch capacity, and Government Polytechnic Kuru Pindra — the only general government polytechnic inside Varanasi district — runs just two, Electrical and Textile, with 60 seats in total. If your branch isn't on that list, no rank secures it. BIPE runs four branches across 480 seats: Civil (120), Electrical (120), Mechanical Engineering (Production) (120) and Computer Science & Engineering (120) — Computer Science in particular is thinly covered by the government polytechnics in this belt. Seat depth is also why BIPE's branch-wise availability persists into the later JEECUP rounds instead of closing in Round 1.",
  },
];

export default function Page() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    {
      name: "Government Polytechnic in Eastern UP",
      path: "/government-polytechnic-in-eastern-up",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* HERO */}
      <section
        className="section bipe-pad"
        style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}
      >
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: -180, top: -120, width: 460, height: 460, borderRadius: "50%", background: "color-mix(in oklab, var(--brand) 26%, transparent)", filter: "blur(120px)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", right: -160, bottom: -160, width: 420, height: 420, borderRadius: "50%", background: "color-mix(in oklab, var(--accent) 28%, transparent)", filter: "blur(120px)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">Honest comparison · Eastern UP · 2026-27</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "30ch" }}>
            Government polytechnic in Eastern UP —{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              the complete list and the honest math.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "64ch" }}>
            Uttar Pradesh has 154 government polytechnics, 19 aided institutions, and over 1,200
            private polytechnics. For rural and Tier-2 town families in Eastern UP, the government
            route is almost always the first choice — and rightly so when it fits. Below: every
            major government polytechnic serving Eastern UP, what each offers, and where BIPE
            Phoolpur fits as the alternative.
          </p>
          <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
            <Link href="/private-vs-government-polytechnic" className="btn btn-primary btn-lg">
              See the private-vs-government framework <ArrowIcon size={16} />
            </Link>
            <Link href="/jeecup-counselling" className="btn btn-ghost btn-lg">
              JEECUP counselling guide
            </Link>
          </div>
        </div>
      </section>

      {/* THE NUMBERS */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">The UP polytechnic ecosystem at a glance</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            How big is{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              the playing field?
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
              { label: "Government", value: "154", sub: "polytechnics in UP" },
              { label: "Aided", value: "19", sub: "institutions in UP" },
              { label: "Private", value: "1,200+", sub: "polytechnics in UP" },
              { label: "Government seats", value: "~18-20k", sub: "annual intake" },
              { label: "JEECUP applicants", value: "50k+", sub: "in serious rank pool" },
              { label: "Fee range govt.", value: "₹12,000-22,000", sub: "per academic year" },
              { label: "Fee range private", value: "₹30k-1.01L", sub: "per academic year" },
              { label: "BIPE AFRC", value: "₹30,150", sub: "AFRC-approved · low end of private" },
            ].map((s) => (
              <article key={s.label} className="card" style={{ padding: 22, background: "var(--paper)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand)" }}>
                  {s.label}
                </div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 500, color: "var(--ink-1)", marginTop: 8, lineHeight: 1.2 }}>
                  {s.value}
                </div>
                <div style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 13, lineHeight: 1.5 }}>
                  {s.sub}
                </div>
              </article>
            ))}
          </div>
          <p style={{ marginTop: 28, color: "var(--ink-2)", maxWidth: "74ch", lineHeight: 1.7 }}>
            The math is unflattering for anyone hoping the government route is universally
            available: <strong>~18,000-20,000 government seats</strong> against{" "}
            <strong>50,000+ rank-competitive JEECUP applicants</strong> means most students
            do not secure a government seat in their preferred branch. The aided category is
            rare (19 institutes statewide). The private layer absorbs the rest — and BIPE&rsquo;s
            AFRC-approved ₹30,150/year sits at the low end of the private band, only
            ~₹8,000/year more than the upper-end government institutes like Government
            Polytechnic Kuru Pindra in Varanasi (~₹22,000/year).
          </p>
        </div>
      </section>

      {/* THE LIST */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Major government polytechnics · Eastern UP</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            What&rsquo;s actually{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              available near you.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "70ch", lineHeight: 1.7 }}>
            Seven government polytechnics covering BIPE&rsquo;s Eastern UP catchment. Capacity,
            branches and fees per institute below — verify the current academic year&rsquo;s
            data on each institute&rsquo;s BTE UP listing before applying.
          </p>
          <div style={{ marginTop: 36, display: "grid", gap: 18 }}>
            {POLYTECHNICS.map((p, i) => (
              <article key={p.name} className="card" style={{ padding: 26, display: "grid", gridTemplateColumns: "auto 1fr", gap: 22, alignItems: "start" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 38, color: "var(--brand)", lineHeight: 0.95, minWidth: 48 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="bipe-h3" style={{ fontSize: 20, lineHeight: 1.3 }}>
                    {p.name}
                  </h3>
                  <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--ink-3)" }}>
                    {p.location}{p.founded ? ` · est. ${p.founded}` : ""}
                  </div>
                  <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 4 }}>Branches</div>
                      <div style={{ fontSize: 13, color: "var(--ink-1)", lineHeight: 1.5 }}>{p.branches}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 4 }}>Seats</div>
                      <div style={{ fontSize: 13, color: "var(--ink-1)", lineHeight: 1.5 }}>{p.seats}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 4 }}>Fees</div>
                      <div style={{ fontSize: 13, color: "var(--ink-1)", lineHeight: 1.5 }}>{p.fees}</div>
                    </div>
                  </div>
                  <p style={{ marginTop: 16, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>
                    {p.notes}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THE FRAMEWORK */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">The decision framework</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "28ch" }}>
            Government, aided, or BIPE —{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              which fits your situation?
            </span>
          </h2>
          <div
            className="bipe-grid-3"
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            <article className="card" style={{ padding: 26, background: "var(--paper)", borderTop: "4px solid var(--ink-3)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>
                Government polytechnic
              </div>
              <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3 }}>
                The natural first choice
              </h3>
              <ul style={{ marginTop: 14, paddingLeft: 20, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>
                <li>Fee gap of ₹8,000-18,000/year vs BIPE is meaningful</li>
                <li>Your JEECUP rank safely secures a seat in the branch you want</li>
                <li>Day-scholar feasible (you live in the institute city or close)</li>
                <li>Comfortable navigating government admission portals and timelines</li>
              </ul>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-3)", fontStyle: "italic", lineHeight: 1.6 }}>
                Take the government seat. It&rsquo;s the right answer for this profile.
              </p>
            </article>

            <article className="card" style={{ padding: 26, background: "var(--paper)", borderTop: "4px solid var(--accent)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 8 }}>
                Aided polytechnic
              </div>
              <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3 }}>
                The rare third lane
              </h3>
              <ul style={{ marginTop: 14, paddingLeft: 20, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>
                <li>Only 19 institutes statewide — rank-competitive</li>
                <li>Government-set fees (lower than private)</li>
                <li>Private operational management</li>
                <li>Worth applying if your rank is strong + you find an aided option in your branch</li>
              </ul>
              <Link href="/aided-polytechnic-uttar-pradesh" className="btn btn-ghost" style={{ marginTop: 14, fontSize: 13 }}>
                See the aided category in detail <ArrowIcon size={13} />
              </Link>
            </article>

            <article className="card" style={{ padding: 26, background: "color-mix(in oklab, var(--brand) 6%, var(--paper))", borderTop: "4px solid var(--brand)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 8 }}>
                BIPE Phoolpur
              </div>
              <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3 }}>
                When private earns its fee
              </h3>
              <ul style={{ marginTop: 14, paddingLeft: 20, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>
                <li>Your rank doesn&rsquo;t safely secure your preferred branch at a government polytechnic</li>
                <li>You want real branch choice — 480 seats across four branches, where the nearest government polytechnic (Kuru Pindra) admits 60 students in total</li>
                <li>You&rsquo;re from outside Varanasi city — hostel access is essential</li>
                <li>You want documented placement infrastructure ({_placed} verified placements at {_recruiters} recruiters)</li>
                <li>Smaller cohort + named faculty mentors matters to your learning</li>
              </ul>
              <Link href="/why-bipe" className="btn btn-ghost" style={{ marginTop: 14, fontSize: 13 }}>
                See BIPE&rsquo;s 8 pillars <ArrowIcon size={13} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Common questions · 2026-27</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            What families ask{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              before counselling.
            </span>
          </h2>
          <div style={{ marginTop: 28, display: "grid", gap: 14, maxWidth: "78ch" }}>
            {FAQS.map((f, i) => (
              <article key={i} className="card" style={{ padding: "22px 26px", background: "var(--paper)" }}>
                <h3 className="bipe-h3" style={{ fontSize: 17, lineHeight: 1.35, color: "var(--ink-1)" }}>
                  {f.q}
                </h3>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>
                  {f.a}
                </p>
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
                <div className="eyebrow">Weighing government against BIPE?</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                  Walk both campuses.{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    Compare in person.
                  </span>
                </h2>
                <p style={{ marginTop: 16, color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6, maxWidth: "46ch" }}>
                  Visit BIPE the same day you visit your local government polytechnic. Walk the
                  workshops, sit in on a class, eat at the mess. ~35 minutes from Varanasi
                  Cantt by auto or app-cab. The decision is too important for one-sided
                  information.
                </p>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <Link href="/visit" className="btn btn-primary btn-lg" style={{ justifyContent: "space-between" }}>
                  Book a campus visit <ArrowIcon size={16} />
                </Link>
                <a href="https://wa.me/917310077788?text=Hi%20BIPE%20%E2%80%94%20I%20am%20comparing%20government%20polytechnic%20options%20against%20BIPE.%20Can%20you%20help%20me%20decide%3F" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                  WhatsApp counsellor <WhatsAppIcon />
                </a>
                <Link href="/private-vs-government-polytechnic" className="btn btn-ghost btn-lg" style={{ justifyContent: "space-between" }}>
                  Detailed comparison framework <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

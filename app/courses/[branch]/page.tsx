import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DATA } from "@/lib/data";
import { getBranchesMapped } from "@/lib/content";
import { BRANCH_DETAIL } from "@/lib/branchContent";
import { SITE_URL } from "@/lib/routes";
import { Img } from "@/components/ui/Img";
import { CrossfadeSlider } from "@/components/ui/CrossfadeSlider";
import { ArrowIcon } from "@/components/shell/Icons";

type Params = { branch: string };

export async function generateStaticParams(): Promise<Params[]> {
  return DATA.branches.map((b) => ({ branch: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { branch } = await params;
  const branches = await getBranchesMapped();
  const b = branches.find((x) => x.slug === branch);
  if (!b) return {};
  const path = `/courses/${b.slug}`;
  // May 2026 keyword research: "diploma in civil engineering" 9,900/mo,
  // "diploma in computer science" 9,900/mo, "diploma in mechanical
  // engineering" 3,600/mo, "diploma in electrical engineering" 2,400/mo.
  // Title pattern rewritten to lead with the exact phrase searchers
  // type — "Diploma in <Branch>" — instead of "<Branch> Diploma".
  const title = `Diploma in ${b.name} · Varanasi · BTEUP ${b.code} | BIPE`;
  const description = `Diploma in ${b.name} at BIPE Varanasi — BTEUP code ${b.code}, JEECUP institute code 4455, AFRC tuition ₹${b.fee}/year, ${b.seats} seats. ${b.desc.slice(0, 80)}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      // en-IN only — see comment in lib/seo.ts. The site has no SSR
      // Hindi variant; declaring hi-IN here would be hreflang-lying.
      languages: { "en-IN": path },
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

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${canonical}#course`,
    name: `Diploma in ${b.name}`,
    description: detail.intro,
    courseCode: b.code,
    inLanguage: ["en-IN"],
    educationalCredentialAwarded: "Diploma in Engineering (3-year, BTEUP)",
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
    },
    occupationalCredentialAwarded: detail.careers[0],
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

  return (
    <article className="page-enter">
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
                <Link href="/apply" className="btn btn-primary">Apply for 2026-27 <ArrowIcon /></Link>
                <Link href="/jeecup" className="btn btn-ghost">JEECUP 4455 guidance <ArrowIcon /></Link>
              </div>
            </div>

            <div>
              <CrossfadeSlider images={detail.labs.length ? b.slides : b.slides} aspectRatio="4/3" radius={18} />
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
          <div className="eyebrow">Curriculum</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            What you&apos;ll learn. <span className="serif">Six semesters.</span>
          </h2>
          <p className="lead" style={{ marginTop: 18, maxWidth: "60ch" }}>
            BTEUP curriculum for code {b.code} — taught in the six-semester sequence below. Sem 6 includes mandatory industrial training and a final project assessed by external examiners.
          </p>
          <div className="grid" style={{ marginTop: 32, gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {detail.semesterThemes.map((t, i) => (
              <div key={i} className="card" style={{ padding: 22 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{`0${i + 1}`}</div>
                <div style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>{t}</div>
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
                <div className="eyebrow">Eligibility & Admission</div>
                <h2 className="bipe-h1" style={{ marginTop: 12, fontSize: 36, maxWidth: "16ch" }}>
                  Class 10 pass. <span className="serif">JEECUP 4455.</span>
                </h2>
                <p style={{ marginTop: 16, color: "var(--ink-2)", lineHeight: 1.7 }}>
                  Eligibility for the {b.name} diploma is a Class 10 pass with Mathematics and Science. Admission is through JEECUP Group A — choose institute code 4455 and BTEUP code {b.code} during counselling. AICTE permanent ID 1-488233171.
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
              Applications for the 2026-27 {b.name} cohort are open. Five minutes to apply — personal guidance call within 24 hours.
            </p>
            <div className="row" style={{ marginTop: 28, gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/apply" className="btn btn-primary" style={{ background: "#fff", color: "var(--brand)" }}>Apply for {b.name} <ArrowIcon /></Link>
              <Link href="/visit" className="btn btn-ghost" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>Visit the campus <ArrowIcon /></Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

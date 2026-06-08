import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor } from "@/lib/seo";
import { ArrowIcon } from "@/components/shell/Icons";
import { EarlyRegistrationForm } from "./EarlyRegistrationForm";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("earlyRegistration");
}

const BENEFITS = [
  {
    tag: "Your branch, held",
    title: "Seat & branch reserved for early registrants",
    body: "Register and visit within 7 days, and BIPE holds your preferred branch under its direct-admission quota (code 4455) — open regardless of your JEECUP rank, subject to seats and basic eligibility.",
  },
  {
    tag: "₹1,200 scholarship",
    title: "A ₹1,200 PET scholarship — just for registering early",
    body: "Early registrants who join for 2026-27 get a one-time ₹1,200 scholarship credited toward admission. Our thank-you for deciding early.",
  },
  {
    tag: "Popular branches fill first",
    title: "Priority on Computer Science & Mechanical",
    body: "CS and Mechanical management seats are limited and fill first. Registering early puts you at the front of the queue for them.",
  },
  {
    tag: "Free · zero risk",
    title: "Completely free, completely non-binding",
    body: "Registration costs nothing and commits you to nothing. Visit, see the labs and hostel, talk to faculty — then decide. Your reserved branch and scholarship are simply held for a week.",
  },
];

const STEPS = [
  { n: "01", t: "Register free", d: "Fill the short form below — name, phone, JEECUP application number, group and preferred branch. Two minutes." },
  { n: "02", t: "Visit within 7 days", d: "Come to BIPE Phoolpur within a week. Tour the campus, meet the admissions team, ask anything." },
  { n: "03", t: "Branch + ₹1,200 locked", d: "Your preferred branch is confirmed under direct admission and the ₹1,200 scholarship is applied. We also guide you through JEECUP counselling for code 4455." },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 76, paddingBottom: 40 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 20%, transparent)", filter: "blur(130px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", maxWidth: 880 }}>
          <div className="eyebrow">JEECUP 2026 · Early Seat Registration</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
            Reserve your BIPE seat &amp;{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>branch — early.</span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "60ch" }}>
            Appeared in JEECUP 2026? Register free in two minutes. Visit campus within 7 days and BIPE holds your preferred branch under
            its direct-admission quota (code 4455) — <strong>regardless of your rank</strong>, subject to seats &amp; eligibility — plus a
            <strong> ₹1,200 scholarship</strong>.
          </p>
          <p lang="hi" style={{ marginTop: 14, maxWidth: "60ch", color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
            JEECUP 2026 दिया है? फ्री में रजिस्टर करें, 7 दिन में campus आएं — आपकी पसंदीदा branch direct admission में reserve, साथ में ₹1,200 scholarship।
          </p>
          <div className="row" style={{ gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="#register" className="btn btn-primary btn-lg">Register free now <ArrowIcon size={16} /></Link>
            <Link href="/visit#book" className="btn btn-ghost btn-lg">See the campus first</Link>
          </div>
          <p className="muted" style={{ marginTop: 18, fontSize: 12.5, maxWidth: "62ch" }}>
            Early Seat Registration <strong>complements the official JEECUP counselling — it does not replace it.</strong> We also help you
            fill choices for BIPE code 4455.
          </p>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(248px, 1fr))", gap: 18 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} className="card" style={{ padding: 24 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{b.tag}</div>
                <div style={{ fontWeight: 600, fontSize: 17, marginTop: 10, lineHeight: 1.3 }}>{b.title}</div>
                <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">How it works</div>
          <h2 className="bipe-h2" style={{ marginTop: 12, maxWidth: "22ch" }}>Three steps. Seven days.</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginTop: 28 }}>
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 40, color: "var(--brand)", lineHeight: 0.9 }}>{s.n}</div>
                <div style={{ fontWeight: 600, fontSize: 17, marginTop: 12 }}>{s.t}</div>
                <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <section id="register" className="section" style={{ background: "var(--paper-2)", scrollMarginTop: 96 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="card" style={{ padding: "40px 40px" }}>
            <div className="eyebrow" style={{ color: "var(--brand)" }}>Early Seat Registration · 2026-27</div>
            <h2 className="bipe-h2" style={{ marginTop: 8, fontSize: 30 }}>
              Register free in two minutes
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>.</span>
            </h2>
            <p className="muted" style={{ marginTop: 8, fontSize: 14, maxWidth: "56ch" }}>
              Fill the basics — our admissions team calls to confirm and helps you plan your campus visit.
            </p>
            <div style={{ marginTop: 26 }}>
              <EarlyRegistrationForm />
            </div>
          </div>

          {/* Honest scope / fine print */}
          <p className="muted" style={{ marginTop: 20, fontSize: 12, lineHeight: 1.75 }}>
            <strong>The details:</strong> &ldquo;Seat &amp; branch reserved&rdquo; refers to BIPE&rsquo;s direct-admission (management quota)
            seats at the Phoolpur campus, JEECUP code 4455 — held for 7 days from registration, subject to seat availability and basic
            eligibility (Class 10 passed). The ₹1,200 PET scholarship is a one-time admission credit for early registrants who enrol for
            2026-27. Early Seat Registration runs <strong>alongside the official JEECUP counselling, not in place of it</strong> — you remain
            free to participate in counselling, and we&rsquo;ll guide you through choice-filling for code 4455.
          </p>
        </div>
      </section>
    </div>
  );
}

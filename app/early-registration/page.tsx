import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor } from "@/lib/seo";
import { ArrowIcon } from "@/components/shell/Icons";
import { EarlyRegistrationForm } from "./EarlyRegistrationForm";
import { RegistrationCountdown } from "./RegistrationCountdown";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("earlyRegistration");
}

const BENEFITS = [
  {
    tag: "Your branch, held",
    title: "Seat & branch reserved for early registrants",
    body: "Register and visit within 7 days, and BIPE reserves your preferred branch for you (code 4455) — subject to seats and basic eligibility.",
  },
  {
    tag: "Free counselling guidance",
    title: "We guide your JEECUP choice-filling",
    body: "Our admissions team helps you order your counselling choices so BIPE code 4455 lands the branch you want — free, on call or WhatsApp.",
  },
  {
    tag: "Popular branches fill first",
    title: "Priority on Computer Science & Mechanical",
    body: "CS and Mechanical management seats are limited and fill first. Registering early puts you at the front of the queue for them.",
  },
  {
    tag: "Free · zero risk",
    title: "Completely free, completely non-binding",
    body: "Registration costs nothing and commits you to nothing. Visit, see the labs and hostel, talk to faculty — then decide. Your reserved branch is simply held for a week.",
  },
];

const STEPS = [
  { n: "01", t: "Register free", d: "Fill the short form below — name, phone, JEECUP application number, group and preferred branch. Two minutes." },
  { n: "02", t: "Visit within 7 days", d: "Come to BIPE Phoolpur within a week. Tour the campus, meet the admissions team, ask anything." },
  { n: "03", t: "Branch reserved + guidance", d: "Your preferred branch is confirmed at BIPE, and we guide you through JEECUP counselling choice-filling for code 4455." },
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
          <div className="eyebrow">JEECUP 2026 · Round 5 · Final round · classes on</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            Round 5 is on —{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>get your seat at BIPE.</span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "60ch" }}>
            Pre-Counselling Registration closed on 27 July — but <strong>JEECUP Round 5 — the final counselling round — is on</strong>, open to every state,
            and <strong>classes are already under way</strong>. Leave your details and BIPE admissions will call you about a seat (code 4455), guide your
            Round-5 choices, and confirm branch availability. Subject to seats &amp; eligibility.
          </p>
          <p lang="hi" style={{ marginTop: 14, maxWidth: "60ch", color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
            Pre-Counselling Registration 27 जुलाई को बंद हो गई — पर JEECUP Round 5 — आख़िरी counselling round — चल रहा है, सभी राज्यों के लिए, और classes शुरू हो चुकी हैं। नीचे details भरें — BIPE admissions आपको seat (code 4455) के बारे में call करेंगे और Round-5 choices में guide करेंगे।
          </p>
          <p className="muted" style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-3)", maxWidth: "60ch" }}>
            <strong>Note:</strong> the ₹1,200 PET scholarship offer closed on 22 June 2026 and is no longer available — Pre-Counselling Registration itself stays free.
          </p>
          <RegistrationCountdown />
          <div className="row" style={{ gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="#register" className="btn btn-primary btn-lg">Talk to admissions <ArrowIcon size={16} /></Link>
            <Link href="/visit#book" className="btn btn-ghost btn-lg">See the campus first</Link>
          </div>
          <p className="muted" style={{ marginTop: 18, fontSize: 12.5, maxWidth: "62ch" }}>
            Pre-Counselling Registration <strong>complements the official JEECUP counselling — it does not replace it.</strong> We also help you
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
            <div className="eyebrow" style={{ color: "var(--brand)" }}>Round 5 Admissions Enquiry · 2026-27</div>
            <h2 className="bipe-h2" style={{ marginTop: 8, fontSize: 30 }}>
              Leave your details — we&rsquo;ll call you
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>.</span>
            </h2>
            <p className="muted" style={{ marginTop: 8, fontSize: 14, maxWidth: "56ch" }}>
              Fill the basics — our admissions team calls to guide your Round-5 choices (code 4455) and confirm a seat before classes begin.
            </p>
            <div style={{ marginTop: 26 }}>
              <EarlyRegistrationForm />
            </div>
          </div>

          {/* Honest scope / fine print */}
          <p className="muted" style={{ marginTop: 20, fontSize: 12, lineHeight: 1.75 }}>
            <strong>The details:</strong> &ldquo;Seat &amp; branch reserved&rdquo; refers to BIPE&rsquo;s own institute seats at the
            Phoolpur campus, JEECUP code 4455 — held for 7 days from registration, subject to seat availability and basic
            eligibility (Class 10 passed). Pre-Counselling Registration runs <strong>alongside the official JEECUP counselling, not in place of it</strong> — you remain
            free to participate in counselling, and we&rsquo;ll guide you through choice-filling for code 4455.
          </p>
        </div>
      </section>
    </div>
  );
}

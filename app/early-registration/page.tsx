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
    tag: "An honest read on seats",
    title: "We tell you what is actually open",
    body: "Pre-Counselling Registration closed on 27 July 2026 and has not reopened. Leave your details and admissions will tell you, branch by branch, whether BIPE (code 4455) still has room for 2026-27.",
  },
  {
    tag: "Admissions guidance",
    title: "We walk you through what is left",
    body: "Our admissions team explains what joining BIPE now involves — which branches still have room, what documents you need, and how quickly you would have to move. Free, on call or WhatsApp.",
  },
  {
    tag: "Popular branches fill first",
    title: "Computer Science and Mechanical go first",
    body: "CS and Mechanical seats are limited and were the first to fill this session. Ask about those two early — they are the likeliest to be gone.",
  },
  {
    tag: "Free · zero risk",
    title: "Completely free, completely non-binding",
    body: "The enquiry costs nothing and commits you to nothing. Visit, see the labs and hostel, talk to faculty — then decide.",
  },
];

const STEPS = [
  { n: "01", t: "Send your details", d: "Fill the short form below — name, phone, JEECUP application number, group and preferred branch. Two minutes." },
  { n: "02", t: "We call you back", d: "Admissions ring you in Hindi or English and tell you honestly whether your branch still has room at code 4455." },
  { n: "03", t: "Visit and decide", d: "If a seat is open, come to BIPE Phoolpur — tour the campus, meet faculty, check the documents you need, then decide." },
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
          <div className="eyebrow">JEECUP 2026 · Counselling concluded · Classes under way</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            Counselling has closed —{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>talk to us about a seat.</span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "60ch" }}>
            Pre-Counselling Registration closed on 27 July, and <strong>JEECUP counselling has concluded</strong> — Round 5 was the final round and it closed
            in mid-August. <strong>Classes are already under way.</strong> Leave your details and BIPE admissions will call you back, tell you honestly what is
            open at code 4455, and talk you through what joining now would involve. Subject to seats &amp; eligibility.
          </p>
          <p lang="hi" style={{ marginTop: 14, maxWidth: "60ch", color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
            Pre-Counselling Registration 27 जुलाई को बंद हो गई, और JEECUP counselling भी पूरी हो चुकी है — Round 5 आख़िरी round था, जो अगस्त के मध्य में ख़त्म हो गया। Classes शुरू हो चुकी हैं। नीचे details भरें — BIPE admissions आपको call करके ईमानदारी से बताएँगे कि code 4455 पर क्या खुला है।
          </p>
          <p className="muted" style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-3)", maxWidth: "60ch" }}>
            <strong>Note:</strong> the ₹1,200 PET scholarship offer closed on 22 June 2026 and is no longer available — this admissions enquiry is free.
          </p>
          <RegistrationCountdown />
          <div className="row" style={{ gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="#register" className="btn btn-primary btn-lg">Talk to admissions <ArrowIcon size={16} /></Link>
            <Link href="/visit#book" className="btn btn-ghost btn-lg">See the campus first</Link>
          </div>
          <p className="muted" style={{ marginTop: 18, fontSize: 12.5, maxWidth: "62ch" }}>
            <strong>Pre-Counselling Registration for 2026-27 is closed and has not reopened.</strong> This form is an admissions enquiry — it is not a
            registration, and it does not hold a seat for you.
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
          <h2 className="bipe-h2" style={{ marginTop: 12, maxWidth: "22ch" }}>Three steps. One phone call.</h2>
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
            <div className="eyebrow" style={{ color: "var(--brand)" }}>Admissions Enquiry · 2026-27</div>
            <h2 className="bipe-h2" style={{ marginTop: 8, fontSize: 30 }}>
              Leave your details — we&rsquo;ll call you
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>.</span>
            </h2>
            <p className="muted" style={{ marginTop: 8, fontSize: 14, maxWidth: "56ch" }}>
              Fill the basics — our admissions team calls you back, tells you honestly what is open at code 4455, and talks you through joining now that classes are under way.
            </p>
            <div style={{ marginTop: 26 }}>
              <EarlyRegistrationForm />
            </div>
          </div>

          {/* Honest scope / fine print */}
          <p className="muted" style={{ marginTop: 20, fontSize: 12, lineHeight: 1.75 }}>
            <strong>The details:</strong> this form is an admissions enquiry about BIPE&rsquo;s own institute seats at the
            Phoolpur campus, JEECUP code 4455. It does not reserve a seat and holds nothing for you — any admission is
            subject to seat availability and basic eligibility (Class 10 passed). <strong>Pre-Counselling Registration for
            2026-27 closed on 27 July 2026 and has not reopened</strong>; classes began 1 August 2026.
          </p>
        </div>
      </section>
    </div>
  );
}

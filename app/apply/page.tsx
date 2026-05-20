import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

// Dynamic import keeps zod + react-hook-form out of the global
// shared chunk. See companion comment on /contact and /visit pages.
const ApplyView = dynamic(
  () => import("./ApplyView").then((m) => m.ApplyView)
);

export async function generateMetadata(): Promise<Metadata> { return metadataFor("apply"); }

const AFTER: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "24-hour callback",
    body: "An admissions counsellor calls the number you provide — usually within twelve working hours, never beyond twenty-four. In English or Hindi, whichever the family prefers.",
  },
  {
    n: "02",
    title: "Personal mentor introduction",
    body: "Once you commit to a branch, we introduce the faculty mentor who will hold your file for the next three years — including periodic visits to your parents at home.",
  },
  {
    n: "03",
    title: "Free shuttle for visit",
    body: "From Varanasi Cantt to Phoolpur and back. Book a Saturday — meet current students, walk the labs, eat at the mess. The shuttle is on us.",
  },
];

const DISCUSS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Best branch fit by rank", body: "Given your JEECUP rank (or expected) and 10th marks, which of the five branches give the strongest career return?" },
  { n: "02", title: "Fee + scholarship eligibility", body: "Net annual figure after every reimbursement and waiver you qualify for — in writing, before any deposit." },
  { n: "03", title: "Hostel availability", body: "Boys' hostel block, semester-wise rates, current vacancy, mess options. Book early or be on the waitlist." },
  { n: "04", title: "Document gaps you can fix", body: "Missing TC? Migration certificate stuck at the board? We tell you what is fixable in the verification window — and how." },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO (server)                                                        */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}>
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
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Apply · 2026-27</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                Begin your application.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Five minutes.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                Four short steps. One human callback within twenty-four hours. No fee to apply, no commitment, no portal credentials. We meet you where you are in the decision.
              </p>
            </div>

            {/* reassurance cluster */}
            <div style={{
              position: "relative", overflow: "hidden",
              borderRadius: 24,
              border: "1px solid var(--line)",
              background: "color-mix(in oklab, var(--brand) 8%, var(--white))",
              padding: 28,
            }}>
              <div aria-hidden="true" style={{
                position: "absolute", right: -80, top: -80, width: 220, height: 220, borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 26%, transparent)",
                filter: "blur(80px)", pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>What you get</div>
                <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
                  {[
                    ["24h", "Response · phone or WhatsApp"],
                    ["EN/हिं", "Counselling support · either language"],
                    ["Free", "Guidance call · no commitment"],
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center",
                      padding: "14px 18px",
                      background: "var(--white)",
                      border: "1px solid var(--line)", borderRadius: 14,
                    }}>
                      <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "var(--brand)", lineHeight: 1, width: 64 }}>
                        {k}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. THREE-CARD STRIP — "what happens after submit"                       */}
      {/* ====================================================================== */}
      <section className="section-tight" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 32, paddingBottom: 22, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">After you submit</div>
              <h2 className="bipe-h2" style={{ marginTop: 12, maxWidth: "16ch" }}>
                Three things{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  happen automatically.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              No email autoresponders. No marketing sequences. Real people, real names, real callbacks.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {AFTER.map((a) => (
              <article key={a.n} className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -50, top: -50, width: 160, height: 160, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 48, lineHeight: 0.85,
                    color: "var(--brand)", letterSpacing: "-0.02em",
                  }}>
                    {a.n}
                  </div>
                  <h3 className="bipe-h3" style={{ marginTop: 14, fontSize: 18 }}>{a.title}</h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{a.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. THE FORM (client) — wrapped in editorial frame inside ApplyView      */}
      {/* ====================================================================== */}
      <ApplyView />

      {/* ====================================================================== */}
      {/* 4. WHAT WE WILL DISCUSS ON THE CALL                                     */}
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
              <div className="eyebrow" style={{ color: "var(--accent)" }}>On the call</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "16ch" }}>
                Four things we will{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  cover
                </span>{" "}
                in twelve minutes.
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Call agendas mailed in advance, no scripts, no sales pitch. Bring questions; we will leave room for them.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22 }}>
            {DISCUSS.map((d) => (
              <article key={d.n} style={{
                padding: 32,
                borderRadius: 18,
                background: "color-mix(in oklab, var(--paper) 6%, transparent)",
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 48, lineHeight: 0.85,
                    color: "var(--accent)",
                    width: 60, textAlign: "right",
                  }}>
                    {d.n}
                  </div>
                  <div>
                    <h3 className="bipe-h3" style={{ fontSize: 19, color: "var(--paper)" }}>{d.title}</h3>
                    <p style={{ marginTop: 10, color: "color-mix(in oklab, var(--paper) 72%, transparent)", fontSize: 14, lineHeight: 1.7 }}>{d.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. ALTERNATE ROUTES                                                     */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="eyebrow">Or — three other ways</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginInline: "auto" }}>
              The form is just{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                one of several routes.
              </span>
            </h2>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="card" style={{
              padding: 28, display: "block", textDecoration: "none", color: "var(--ink)",
            }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>WhatsApp</div>
              <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "var(--brand)", marginTop: 10, lineHeight: 1 }}>
                Prefer WhatsApp?
              </div>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>
                Message us — same-day reply, EN or Hindi. The fastest path for parents already on the app for school groups.
              </p>
              <span style={{
                marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8,
                color: "#25D366", fontWeight: 600, fontSize: 13,
              }}>
                <WhatsAppIcon /> Open WhatsApp <ArrowIcon size={12} />
              </span>
            </a>

            <a href={`tel:${DATA.contact.phone}`} className="card" style={{
              padding: 28, display: "block", textDecoration: "none", color: "var(--ink)",
            }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Direct call</div>
              <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "var(--brand)", marginTop: 10, lineHeight: 1 }}>
                Want to call?
              </div>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>
                Mon–Sat, 9 AM to 6 PM. Two lines, both staffed. The admissions desk fields most enquiries inside three minutes.
              </p>
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--brand)", fontWeight: 600 }}>
                <span><PhoneIcon /> {DATA.contact.phone}</span>
                <span><PhoneIcon /> {DATA.contact.phone2}</span>
              </div>
            </a>

            <Link href="/visit" className="card" style={{
              padding: 28, display: "block", textDecoration: "none", color: "var(--ink)",
            }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Campus visit</div>
              <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "var(--brand)", marginTop: 10, lineHeight: 1 }}>
                Still deciding?
              </div>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>
                Book a Saturday slot. Free shuttle from Varanasi Cantt. Walk the labs, meet current students, eat at the mess.
              </p>
              <span style={{
                marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8,
                color: "var(--brand)", fontWeight: 600, fontSize: 13,
              }}>
                Book a campus visit <ArrowIcon size={12} />
              </span>
            </Link>
          </div>

          {/*
            Internal-linking row — May 2026 SEO audit identified /apply
            as a thin link surface (linked only to /visit). Adding a
            quick-jump strip to the four pages applicants ask about
            most: branches, fees, scholarships, counselling. Each is
            a small underlined link, no styling weight.
          */}
          <div
            style={{
              marginTop: 36,
              padding: "24px 28px",
              border: "1px solid var(--line)",
              borderRadius: 16,
              background: "var(--paper-2)",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                whiteSpace: "nowrap",
              }}
            >
              Before you fill the form
            </div>
            <div
              className="row"
              style={{
                display: "flex",
                gap: 22,
                flexWrap: "wrap",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Link href="/courses" style={{ color: "var(--brand)" }}>
                Browse all 5 branches →
              </Link>
              <Link href="/fees" style={{ color: "var(--brand)" }}>
                Fees 2026-27 →
              </Link>
              <Link href="/scholarships" style={{ color: "var(--brand)" }}>
                UP scholarship eligibility →
              </Link>
              <Link href="/jeecup-counselling" style={{ color: "var(--brand)" }}>
                JEECUP counselling guide →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

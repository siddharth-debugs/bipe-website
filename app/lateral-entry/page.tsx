import type { Metadata } from "next";
import Link from "next/link";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("lateralEntry");

// Course Portfolio audit (§A.4) — BIPE has 4 BTEUP-licensed lateral-entry
// tracks (375, 378, 384, 386). The audit estimates 60-100 hidden enrolment
// opportunity per year because no website page targets ITI graduates in
// Eastern UP. This page directly addresses that gap.

const TRACKS: { code: string; name: string; from: string; seats: number }[] = [
  { code: "375", name: "Civil Engineering", from: "ITI Civil / 12th PCM", seats: 24 },
  { code: "378", name: "Electrical Engineering", from: "ITI Electrician / 12th PCM", seats: 24 },
  { code: "384", name: "Mechanical Engineering — Automobile", from: "ITI Auto / 12th PCM", seats: 24 },
  { code: "386", name: "Mechanical Engineering — Production", from: "ITI Fitter, Turner, Machinist / 12th PCM", seats: 24 },
];

export default function Page() {
  const totalSeats = TRACKS.reduce((s, t) => s + t.seats, 0);
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO                                                                 */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 64 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">§ Lateral Entry · Group K</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                Skip a year.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Same diploma.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "56ch" }}>
                Built for ITI graduates and 12th-PCM students across Eastern UP — Mau, Ghazipur, Azamgarh, Mirzapur, Chandauli, Sonbhadra, Jaunpur and Varanasi. Lateral entry takes you straight into semester 3 of the BTEUP diploma. Two years to graduation. The same workshops, the same recruiters, the same diploma that 3-year students earn.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">Apply for lateral entry <ArrowIcon size={16} /></Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg"><WhatsAppIcon /> WhatsApp admissions</a>
              </div>
            </div>

            {/* Stat block */}
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { num: "2", lbl: "years to diploma", sub: "vs 3 for direct entry" },
                { num: `${totalSeats}`, lbl: "lateral-entry seats", sub: "across 4 BTEUP branches" },
                { num: "K", lbl: "JEECUP Group", sub: "ITI / 12th PCM eligible" },
              ].map((s) => (
                <div key={s.lbl} style={{
                  position: "relative", overflow: "hidden",
                  padding: "22px 26px",
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: 18,
                }}>
                  <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                  <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.lbl}</div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-2)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. WHO QUALIFIES                                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">§ Who qualifies</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginBottom: 28 }}>
            Two paths{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              into year 2.
            </span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[
              {
                tag: "ITI HOLDER",
                title: "Finished an ITI in a relevant trade",
                body: "If you completed an ITI in Fitter, Turner, Machinist, Electrician, Civil, Auto, Wireman, Welder or related trade — you can enter the BTEUP diploma directly into semester 3. The lateral-entry path was designed for you. Eastern UP has dozens of ITIs producing exactly this profile every year.",
              },
              {
                tag: "12TH PCM",
                title: "12th pass with PCM",
                body: "If you finished Class 12 with Physics, Chemistry and Mathematics — you can also enter laterally via JEECUP Group K. Useful if you missed the JEECUP Group A round, want a hands-on engineering route, or want a faster B.Tech path via Lateral Entry to second year of B.Tech after the diploma.",
              },
            ].map((c) => (
              <article key={c.tag} className="card" style={{ padding: 32 }}>
                <span className="pill pill-accent">{c.tag}</span>
                <h3 className="bipe-h3" style={{ marginTop: 14, fontSize: 22 }}>{c.title}</h3>
                <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. THE FOUR TRACKS                                                      */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">§ Four BTEUP-licensed tracks</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginBottom: 28 }}>
            Branches with{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              lateral entry at BIPE.
            </span>
          </h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "auto 2fr 2fr 1fr",
              padding: "16px 24px",
              background: "var(--ink)", color: "var(--paper)",
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <div>Code</div>
              <div>Branch</div>
              <div>Eligible from</div>
              <div>Seats</div>
            </div>
            {TRACKS.map((t, i) => (
              <div key={t.code} style={{
                display: "grid", gridTemplateColumns: "auto 2fr 2fr 1fr",
                padding: "20px 24px",
                background: i % 2 === 0 ? "var(--white)" : "var(--paper-2)",
                borderBottom: i < TRACKS.length - 1 ? "1px solid var(--line)" : "none",
                alignItems: "center",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--brand)", minWidth: 48 }}>{t.code}</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                <div style={{ color: "var(--ink-2)", fontSize: 14 }}>{t.from}</div>
                <div className="serif" style={{ fontStyle: "italic", fontSize: 26, color: "var(--ink)" }}>{t.seats}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 18, fontSize: 13, color: "var(--ink-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            JEECUP college code 4455 · Codes are BTEUP-issued. CSE (355) and Dairy Engineering (327) currently admit via Group A only.
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. WHY LATERAL                                                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow" style={{ color: "var(--accent)" }}>§ Why lateral</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "22ch", color: "var(--paper)", marginBottom: 28 }}>
            What an ITI graduate from Mau gains by{" "}
            <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
              lateral entry to BIPE.
            </span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              { n: "01", t: "A year saved", b: "2 years vs 3. A year of fees, time and earlier earnings." },
              { n: "02", t: "Same diploma", b: "BTEUP diploma identical to the 3-year track. Same workshops, same employers." },
              { n: "03", t: "Same recruiters", b: "Mahindra, Tata Motors, BEL, Indian Railways, UPPCL recruit lateral students alongside Group A." },
              { n: "04", t: "Lateral B.Tech open", b: "After diploma, JEECUP B.Tech lateral entry takes you into year 2 of engineering — saving another year." },
            ].map((c) => (
              <article key={c.n} style={{
                padding: 24, borderRadius: 18,
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                background: "color-mix(in oklab, var(--paper) 5%, transparent)",
              }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 48, lineHeight: 0.85, color: "var(--accent)" }}>{c.n}</div>
                <h3 style={{ marginTop: 12, fontSize: 17, fontWeight: 700, color: "var(--paper)" }}>{c.t}</h3>
                <p style={{ marginTop: 8, color: "color-mix(in oklab, var(--paper) 75%, transparent)", fontSize: 13.5, lineHeight: 1.65 }}>{c.b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. CTA                                                                   */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18 }}>
            <div>
              <div className="eyebrow">§ Counselling open</div>
              <h2 className="bipe-h3" style={{ marginTop: 6, fontSize: 24 }}>
                ITI graduate from Eastern UP? Talk to admissions today.
              </h2>
              <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14, maxWidth: "60ch" }}>
                Counsellors are bilingual (EN / हिं) and can walk you through JEECUP Group K registration, eligibility verification and BIPE&rsquo;s lateral-entry seat status.
              </p>
            </div>
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              <Link href="/apply" className="btn btn-primary">Apply <ArrowIcon size={14} /></Link>
              <Link href="/jeecup" className="btn btn-ghost">JEECUP guidance</Link>
              <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

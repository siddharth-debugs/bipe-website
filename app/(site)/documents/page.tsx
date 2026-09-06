import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { IconTile } from "@/components/ui/IconTile";
import { FolderOpen, Files, Stamp } from "lucide-react";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("documents"); }

const MANDATORY: { n: string; title: string; sub: string }[] = [
  { n: "01", title: "JEECUP Rank Card / Allotment Letter", sub: "Downloaded from the JEECUP portal · printed × 3" },
  { n: "02", title: "Class 10 Marksheet", sub: "Original + 2 self-attested photocopies" },
  { n: "03", title: "School Transfer Certificate (TC)", sub: "Issued by your last school" },
  { n: "04", title: "Character Certificate", sub: "From the Principal of your last school" },
  { n: "05", title: "Aadhaar Card (student)", sub: "Original + 2 self-attested copies" },
  { n: "06", title: "Passport-size Photographs", sub: "8 copies · same recent sitting · light background" },
  { n: "07", title: "Bank Passbook (front page)", sub: "Student's account · for scholarship credit" },
  { n: "08", title: "Anti-Ragging Undertaking", sub: "Signed by both student and parent / guardian" },
  { n: "09", title: "JEECUP Allotment Confirmation", sub: "After choice-locking · printout for verification" },
  // Added 3 Sep 2026 — owner confirmed the admission office does collect the
  // filled application-form printout at reporting. The JEECUP verification
  // checklist had always called it mandatory while this list omitted it.
  { n: "10", title: "JEECUP Application Form (printout)", sub: "The filled form as submitted on the portal · collected at reporting" },
];

const CONDITIONAL: { group: string; chips: string[]; note: string }[] = [
  {
    group: "For other-board students",
    chips: ["Migration Certificate"],
    note: "Required if your 10th board is anything other than UP Board (CBSE / ICSE / state boards).",
  },
  {
    group: "For scholarships",
    chips: ["Caste Certificate", "Income Certificate", "Domicile Certificate", "EWS Certificate", "PWD Certificate"],
    note: "Required for UP Government post-matric and central NSP scholarships. Apply at the tehsil immediately after JEECUP results.",
  },
  {
    group: "Optional but useful",
    chips: ["PAN of parent / guardian", "Aadhaar of parent / guardian", "Medical Fitness Certificate"],
    note: "Saves a return trip if any tax / KYC formality arises during the academic year.",
  },
];

const TIPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Originals + two copies",
    body: "Verifying staff need to inspect originals and retain self-attested photocopies. Two copies of each document is the safe minimum — three for the JEECUP rank card.",
  },
  {
    n: "02",
    title: "Buy a sturdy A4 folder",
    body: "Plastic sleeves, indexed dividers, one document per sleeve in the order on this page. ₹120 at any stationer. Saves twenty minutes at the counter and weeks of nerves.",
  },
  {
    n: "03",
    title: "Keep digital scans",
    body: "Scan every document and upload to a Google Drive folder named with the student's full name and JEECUP roll number. If a paper copy is lost on the journey, you can reprint at the campus stationer.",
  },
];

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
              { name: "Documents", path: "/documents" },
            ]),
          ),
        }}
      />
      {/* ====================================================================== */}
      {/* 1. HERO                                                                 */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -160, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 26%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Documents</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "18ch" }}>
                What to bring on{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  reporting day.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                Originals plus two self-attested photocopies of each. Organised in a sturdy folder, in the order listed below — saves time at the admission counter, and saves you the panic of a missing paper.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">Enquire for 2027-28 <ArrowIcon size={16} /></Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                  <WhatsAppIcon /> Missing a doc? Ask
                </a>
              </div>
              <div className="bipe-stats" style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                {[
                  { num: "10", l: "Mandatory" },
                  { num: "10+", l: "Conditional" },
                  { num: "2", l: "Self-attested copies" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 36, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                    <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative IconTile — desktop-only visual companion to
                the hero copy on the left. On mobile (bipe-split
                collapses to single column) the 4:5 tile becomes a
                giant near-empty box adding scroll length for no
                content value. .bipe-hide-mobile hides at <=860px. */}
            <div className="bipe-hide-mobile">
              <IconTile icon={FolderOpen} label="Reporting-day folder" tone="brand" aspectRatio="4/5" iconSize={88} style={{ borderRadius: 18 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. MANDATORY LIST                                                       */}
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
              <div className="eyebrow">Mandatory · Ten documents</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                These ten{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  cannot be missed.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Every BIPE candidate, every category, every branch. Show up without one of these and the verification window stays open another day — at best.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {MANDATORY.map((m) => (
              <article key={m.n} className="card" style={{ padding: 26, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -40, top: -40, width: 130, height: 130, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 6%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 40, lineHeight: 0.85,
                    color: "var(--brand)",
                    width: 44, textAlign: "right",
                  }}>
                    {m.n}
                  </div>
                  <div>
                    <h3 className="bipe-h3" style={{ fontSize: 16, lineHeight: 1.3 }}>{m.title}</h3>
                    <p className="muted" style={{ marginTop: 8, fontSize: 12.5, lineHeight: 1.55 }}>{m.sub}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. CONDITIONAL / OPTIONAL (DARK)                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, bottom: -180, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Conditional & optional</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "18ch" }}>
                Some only{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  apply to you
                </span>{" "}
                — check carefully.
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Most students need only the ten mandatory items. Scholarship applicants and out-of-state students need additional papers — listed below by reason.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22 }}>
            {CONDITIONAL.map((c) => (
              <article key={c.group} style={{
                padding: 32,
                borderRadius: 18,
                background: "color-mix(in oklab, var(--paper) 6%, transparent)",
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
              }}>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>{c.group}</div>
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {c.chips.map((chip) => (
                    <span key={chip} className="pill" style={{
                      background: "color-mix(in oklab, var(--paper) 12%, transparent)",
                      color: "var(--paper)",
                      border: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)",
                    }}>
                      {chip}
                    </span>
                  ))}
                </div>
                <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.65, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>
                  {c.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. QUICK-PREP TIPS                                                      */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow">Three things parents always thank us for</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginInline: "auto" }}>
              Quick-prep{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                advice.
              </span>
            </h2>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {TIPS.map((t) => (
              <article key={t.n} className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -50, top: -50, width: 160, height: 160, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--accent) 10%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 56, lineHeight: 0.85, color: "var(--brand)",
                    letterSpacing: "-0.02em",
                  }}>
                    {t.n}
                  </div>
                  <h3 className="bipe-h3" style={{ marginTop: 14, fontSize: 19 }}>{t.title}</h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{t.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. NEED HELP / CTA                                                      */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28, border: "1px solid var(--line)",
            background: "color-mix(in oklab, var(--brand) 6%, var(--white))",
            padding: "56px 56px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: -160, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 22%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 32%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow">Missing a document?</div>
                <p className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(28px, 3.4vw, 44px)",
                  lineHeight: 1.1, color: "var(--ink)",
                  marginTop: 14, maxWidth: "20ch",
                }}>
                  Don&apos;t have a document?{" "}
                  <span style={{ color: "var(--brand)" }}>Don&apos;t skip applying — call us first.</span>
                </p>
                <p style={{ marginTop: 18, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7, maxWidth: "44ch" }}>
                  Duplicates and replacements can usually be arranged before the verification window closes. Most &quot;missing-paper&quot; panics resolve in a single phone call to admissions.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-wa" style={{ justifyContent: "space-between" }}>
                  <span><WhatsAppIcon /> WhatsApp admissions</span>
                  <ArrowIcon size={16} />
                </a>
                <a href={`tel:${DATA.contact.phone}`} className="btn btn-lg btn-primary" style={{ justifyContent: "space-between" }}>
                  <span><PhoneIcon /> {DATA.contact.phone}</span>
                  <ArrowIcon size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Decorative tile pair — desktop-only visual chrome that
              closes out the page next to the CTA stack. On mobile
              the 2-col grid collapses to single column and the two
              220px-tall tiles add 440px+ of empty scroll length for
              no information value. Hidden via .bipe-hide-mobile
              (same utility used for the hero Reporting-day folder
              tile higher up on this same page). */}
          <div className="bipe-hide-mobile bipe-img-strip" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <IconTile icon={Files} label="Verification desk · day one" tone="brand" style={{ height: 220, borderRadius: 18 }} />
            <IconTile icon={Stamp} label="Seal & signature" tone="accent" style={{ height: 220, borderRadius: 18 }} />
          </div>
        </div>
      </section>
    </div>
  );
}

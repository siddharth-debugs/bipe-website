import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("hostel");

const FEES: { k: string; v: string; note: string }[] = [
  { k: "Triple-sharing room", v: "₹38,000", note: "per academic year" },
  { k: "Double-sharing room", v: "₹48,000", note: "per academic year" },
  { k: "Mess (3 meals daily)", v: "₹36,000", note: "veg & non-veg · monthly rotation" },
  { k: "Caution deposit", v: "₹5,000", note: "refundable on exit" },
];

const AMENITIES: { icon: React.ReactNode; title: string; body: string }[] = [
  { icon: <BedIcon />, title: "Furnished room", body: "Bed, mattress, study desk and chair." },
  { icon: <PlateIcon />, title: "3 meals a day", body: "Vegetarian and non-vegetarian options." },
  { icon: <DropIcon />, title: "24/7 water", body: "Backed by 6-bore rainwater + tank reserve." },
  { icon: <BoltIcon />, title: "Backup power", body: "Generator + UPS across the hostel." },
  { icon: <WifiIcon />, title: "Wi-Fi in commons", body: "50 Mbps firewalled · campus-wide." },
  { icon: <CrossIcon />, title: "Medical room", body: "On-call doctor and emergency access." },
  { icon: <ShieldIcon />, title: "24×7 security", body: "Staffed gate and visitor register." },
  { icon: <BellIcon />, title: "Parent hotline", body: "Emergency line into the warden's desk." },
];

const SAFETY: { n: string; body: string }[] = [
  { n: "01", body: "Boundary walls and a staffed gate — entries logged after 7 PM." },
  { n: "02", body: "Visitor registration with photo-ID. Parents only after verification." },
  { n: "03", body: "Resident warden on duty round the clock; on-call doctor reachable from the warden's desk." },
  { n: "04", body: "Anti-ragging committee, 24×7 helpline, anonymous complaint box." },
  { n: "05", body: "Fire safety equipment on every floor and quarterly fire drills." },
  { n: "06", body: "9:30 PM curfew — extensions only with parental authorisation." },
  { n: "07", body: "Periodic administrative inspections — rooms, mess, sanitation." },
];

function BedIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 17v-7h12a3 3 0 013 3v4M3 17h18M6 13h6"/></svg>; }
function PlateIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>; }
function DropIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l5 7a5 5 0 11-10 0l5-7z"/></svg>; }
function BoltIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></svg>; }
function WifiIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 9a16 16 0 0120 0M5 13a10 10 0 0114 0M8 17a4 4 0 018 0"/><circle cx="12" cy="20" r="1"/></svg>; }
function CrossIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="3" y="9" width="18" height="6" rx="1"/></svg>; }
function ShieldIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>; }
function BellIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 16V11a6 6 0 0112 0v5l1.5 2H4.5L6 16zM10 21h4"/></svg>; }

export default function Page() {
  return (
    <div className="page-enter">
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
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Hostel · Mess</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "18ch" }}>
                Safe, on-campus,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  home enough.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                Boys&rsquo; hostel on campus &mdash; 24×7 water, backup power, on-campus mess and a parent hotline that rings straight into the warden&rsquo;s desk.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/visit" className="btn btn-primary btn-lg">Book a hostel viewing <ArrowIcon size={16} /></Link>
                <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost btn-lg"><PhoneIcon /> {DATA.contact.phone}</a>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> WhatsApp</a>
              </div>
              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Within the boundary &rarr;
                </span>
                {["Boys hostel", "Mess", "Medical room"].map((t, i, arr) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < arr.length - 1 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Stacked image pair — boys hostel exterior + interior */}
            <div style={{ display: "grid", gap: 14 }}>
              <Img src={BIPE_IMG.hostelBoys} label="HOSTEL · EXTERIOR" style={{ height: 260, borderRadius: 18 }} />
              <Img src={BIPE_IMG.hostel} label="HOSTEL · INTERIOR" style={{ height: 220, borderRadius: 18, marginLeft: 40 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. ANNUAL FEES                                                          */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container" style={{ maxWidth: 1080 }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="eyebrow">Annual fees</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "14ch" }}>
                Hostel and mess,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  itemised.
                </span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 18, fontSize: 15.5, lineHeight: 1.7 }}>
                Hostel and mess are paid semester-wise. Bring your own bedding for the first week — the room is furnished but linen rotates with you.
              </p>
              <div style={{ marginTop: 22, padding: "14px 18px", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 12 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>Refundable</div>
                <div style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
                  ₹5,000 caution deposit returns at the end of the diploma — net of any deductions for damages.
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr", padding: "14px 26px", background: "var(--paper-2)", borderBottom: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                <div>Item</div>
                <div style={{ textAlign: "right" }}>Annual</div>
                <div style={{ textAlign: "right" }}>Note</div>
              </div>
              {FEES.map((f, i) => (
                <div key={f.k} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 2fr",
                  gap: 18,
                  padding: "20px 26px",
                  borderBottom: i < FEES.length - 1 ? "1px solid var(--line)" : "none",
                  alignItems: "center",
                  background: i % 2 === 0 ? "var(--white)" : "var(--paper)",
                }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{f.k}</div>
                  <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)", fontSize: 15 }}>{f.v}</div>
                  <div className="muted" style={{ fontSize: 13, textAlign: "right" }}>{f.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. AMENITIES — DARK GRID                                                */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, top: -180, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 40%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Amenities · Eight</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch", color: "var(--paper)" }}>
                What every{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  room includes.
                </span>
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Eight things you should not have to ask about. Listed here so the conversation moves on.
            </p>
          </div>
          <div className="bipe-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {AMENITIES.map((a) => (
              <div key={a.title} style={{
                padding: "22px 22px",
                background: "color-mix(in oklab, var(--paper) 6%, transparent)",
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                borderRadius: 16,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "color-mix(in oklab, var(--accent) 24%, transparent)",
                  color: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{a.icon}</div>
                <div style={{ marginTop: 14, fontWeight: 600, fontSize: 15, color: "var(--paper)" }}>{a.title}</div>
                <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>{a.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. SAFETY & RULES                                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, top: -120, width: 320, height: 320, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="eyebrow">Safety · Discipline</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "14ch" }}>
                Safety,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  parent-first.
                </span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 18, fontSize: 15.5, lineHeight: 1.7, maxWidth: "46ch" }}>
                Every protocol below is written for the parent in Mau, Ghazipur or Azamgarh who is putting their son on a train. The seven rules apply across every floor of the hostel.
              </p>
              <div style={{ marginTop: 26, padding: "22px 24px", background: "var(--white)", border: "1px solid var(--line)", borderRadius: 16 }}>
                <div className="serif" style={{ fontStyle: "italic", fontSize: 26, lineHeight: 1.35, color: "var(--ink)" }}>
                  &ldquo;Parents stay in the loop.{" "}
                  <span style={{ color: "var(--brand)" }}>Always.</span>&rdquo;
                </div>
                <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Warden · BIPE Hostel
                </div>
              </div>
            </div>
            <div>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
                {SAFETY.map((s) => (
                  <li key={s.n} style={{
                    display: "grid", gridTemplateColumns: "auto 1fr", gap: 22, alignItems: "baseline",
                    padding: "18px 22px",
                    background: "var(--white)", border: "1px solid var(--line)", borderRadius: 14,
                  }}>
                    <span className="serif" style={{
                      fontStyle: "italic", fontWeight: 400,
                      fontSize: 38, lineHeight: 0.9, color: "var(--brand)",
                      width: 48,
                    }}>{s.n}</span>
                    <span style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>{s.body}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. MESS & FOOD                                                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden", padding: 0 }}>
        <div style={{ position: "relative" }}>
          <Img src={BIPE_IMG.mess} label="MESS · DINING HALL" style={{ height: 540, borderRadius: 0 }} />
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, var(--ink) 0%, color-mix(in oklab, var(--ink) 80%, transparent) 45%, transparent 75%)",
          }} />
          <div className="container" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
            <div style={{ maxWidth: 560, color: "var(--paper)" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Mess · Three meals daily</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "14ch" }}>
                A kitchen that{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  feeds the floor.
                </span>
              </h2>
              <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 84%, transparent)" }}>
                Three meals a day — vegetarian and non-vegetarian options, monthly menu rotation, hygiene-first kitchen practice. Festival specials on Holi, Diwali, Eid, Christmas. Roti is hand-rolled, not machine-pressed.
              </p>
              <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Veg & non-veg", "Monthly menu", "Festival specials", "Hand-rolled roti"].map((t) => (
                  <span key={t} style={{
                    padding: "8px 14px", borderRadius: 999,
                    background: "color-mix(in oklab, var(--paper) 12%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)",
                    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. CTA                                                                  */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28, border: "1px solid var(--line)",
            background: "var(--white)",
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
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div className="eyebrow">Hostel enquiries</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                  Walk the block.{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    Meet the warden.
                  </span>
                </h2>
                <p className="lead" style={{ marginTop: 18, maxWidth: "44ch" }}>
                  Hostel viewings happen between 11 AM and 4 PM, Monday to Saturday. Bring your parents — that&rsquo;s the visit we expect.
                </p>
                <div style={{ marginTop: 22, display: "grid", gap: 6, fontSize: 14 }}>
                  <div className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Warden desk</div>
                  <div style={{ color: "var(--ink-2)" }}>
                    <a href={`tel:${DATA.contact.phone}`} style={{ color: "var(--brand)", fontWeight: 600 }}>{DATA.contact.phone}</a>
                    {" / "}
                    <a href={`tel:${DATA.contact.phone2}`} style={{ color: "var(--brand)", fontWeight: 600 }}>{DATA.contact.phone2}</a>
                    {" · "}
                    <a href={`mailto:${DATA.contact.email}`} style={{ color: "var(--brand)", fontWeight: 600 }}>{DATA.contact.email}</a>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/visit" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--brand)", color: "#fff", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, #fff 65%, transparent)" }}>01</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Book a hostel viewing</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, #fff 70%, transparent)", marginTop: 2 }}>Free shuttle from Varanasi Cantt</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--ink)", color: "var(--paper)", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>02</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Talk on WhatsApp</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 60%, transparent)", marginTop: 2 }}>EN / हिं · same-day reply</div>
                  </div>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WhatsAppIcon />
                  </span>
                </a>
                <Link href="/fees" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--paper-2)", color: "var(--ink)", textDecoration: "none",
                  border: "1px solid var(--line)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>03</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>See all tuition fees</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>AFRC · ₹30,150 / year</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

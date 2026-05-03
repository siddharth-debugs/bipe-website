import React from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "./Icons";
import { BackToTop } from "./BackToTop";

const Col = ({ heading, items }: { heading: string; items: [string, string][] }) => (
  <div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 50%, transparent)", marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)" }}>{heading}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14 }}>
      {items.map(([label, route]) => (
        <Link key={label + route} href={route} style={{ color: "color-mix(in oklab, var(--paper) 78%, transparent)", textDecoration: "none", display: "inline-block" }}>{label}</Link>
      ))}
    </div>
  </div>
);

export const Footer = () => {
  const C = DATA.contact;
  return (
    <footer className="footer" style={{ position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)", backgroundSize: "96px 96px", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "-30%", transform: "translateX(-50%)", width: 900, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, color-mix(in oklab, var(--brand) 40%, transparent), transparent 65%)", pointerEvents: "none", opacity: 0.5 }} />

      <div className="container" style={{ position: "relative" }}>
        {/* Top accent strip — admissions live indicator */}
        <div style={{
          paddingTop: 36,
          paddingBottom: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          <div className="row" style={{ alignItems: "center", gap: 10 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "var(--accent)",
              boxShadow: "0 0 0 4px color-mix(in oklab, var(--accent) 22%, transparent)",
              animation: "pulse 2s infinite",
              display: "inline-block",
            }} />
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>Admissions Open · 2026-27</span>
          </div>
          <div style={{ color: "color-mix(in oklab, var(--paper) 50%, transparent)" }}>
            JEECUP {C.jeecup} · AICTE {C.aicte}
          </div>
        </div>

        {/* Hero strip — logo mark + wordmark + tagline as one composed band */}
        <div style={{
          paddingTop: 28,
          paddingBottom: 36,
          borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
          position: "relative",
        }}>
          {/* Hairline accent gradient at the top of the strip */}
          <div aria-hidden="true" style={{
            position: "absolute", left: 0, right: 0, top: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent) 50%, transparent) 30%, color-mix(in oklab, var(--brand) 80%, transparent) 70%, transparent 100%)",
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr) auto",
            gap: 40,
            alignItems: "center",
          }}>
            {/* Logo mark — left. Light card so the dark navy parts of the
                logo are visible against the dark footer bg. */}
            <div style={{
              width: 96,
              height: 110,
              borderRadius: 20,
              background: "var(--paper)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 18px 36px -16px rgba(0,0,0,0.6), 0 0 0 1px color-mix(in oklab, var(--paper) 22%, transparent)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/bipe-logo.svg" alt="" aria-hidden="true" style={{ height: 72, width: "auto", display: "block" }} draggable={false} />
            </div>

            {/* Wordmark + sub-eyebrow */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: "clamp(48px, 7.4vw, 120px)",
                lineHeight: 0.9,
                fontWeight: 600,
                letterSpacing: "-0.045em",
                color: "var(--paper)",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "baseline",
                gap: 4,
              }}>
                BIPE
                <span className="serif" style={{
                  color: "var(--accent)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  fontSize: "0.5em",
                  alignSelf: "flex-end",
                }}>.</span>
              </div>
              <div style={{
                marginTop: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 55%, transparent)",
              }}>
                Banaras Institute of Polytechnic &amp; Engineering · Est. 2010
              </div>
            </div>

            {/* Tagline + back-to-top — right */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 18,
              paddingLeft: 24,
              borderLeft: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
            }}>
              <div className="serif" style={{
                fontStyle: "italic",
                fontSize: "clamp(24px, 2.4vw, 38px)",
                lineHeight: 1.1,
                color: "color-mix(in oklab, var(--paper) 92%, transparent)",
                maxWidth: "16ch",
                textAlign: "right",
                letterSpacing: "-0.015em",
              }}>
                Engineers <span style={{ color: "var(--accent)" }}>begin</span> here.
              </div>
              <BackToTop />
            </div>
          </div>

          {/* Stat pill row — visual richness under the wordmark */}
          <div style={{
            marginTop: 28,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            paddingTop: 20,
            borderTop: "1px solid color-mix(in oklab, var(--paper) 10%, transparent)",
          }}>
            {[
              ["6-acre", "Phoolpur campus"],
              ["10", "BTEUP branches"],
              ["1,000+", "Alumni placed"],
              ["33", "Faculty"],
              ["1:20", "Mentor ratio"],
              ["16 yrs", "Eastern UP"],
            ].map(([n, l]) => (
              <div key={l} style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                background: "color-mix(in oklab, var(--paper) 4%, transparent)",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--paper)" }}>{n}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA + contact strip — three matched cards */}
        <div style={{
          padding: "32px 0",
          borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1.1fr",
          gap: 14,
          alignItems: "stretch",
        }}>
          {/* CTA card */}
          <div style={{
            padding: "22px 24px",
            borderRadius: 16,
            border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
            background: "color-mix(in oklab, var(--paper) 5%, transparent)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 18,
          }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "color-mix(in oklab, var(--paper) 55%, transparent)",
            }}>
              Take the next step
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Link href="/apply" className="btn btn-sm" style={{ background: "var(--paper)", color: "var(--ink)", fontWeight: 600 }}>
                Apply for 2026-27 <ArrowIcon size={12} />
              </Link>
              <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: "#25D366", color: "#fff", border: "none" }}>
                <WhatsAppIcon /> WhatsApp
              </a>
              <Link href="/visit" className="btn btn-sm" style={{ color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 28%, transparent)" }}>
                Visit campus
              </Link>
            </div>
          </div>

          {/* Phone card */}
          <a
            href={`tel:${C.phone}`}
            style={{
              padding: "22px 24px",
              borderRadius: 16,
              border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
              background: "color-mix(in oklab, var(--paper) 5%, transparent)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              textDecoration: "none",
              color: "var(--paper)",
              transition: "border-color .2s, background .2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "color-mix(in oklab, var(--brand) 28%, transparent)",
                color: "var(--paper)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <PhoneIcon />
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 55%, transparent)",
              }}>
                Call admissions
              </span>
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 19,
                fontWeight: 700,
                color: "var(--paper)",
                letterSpacing: "-0.005em",
              }}>
                {C.phone}
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13.5,
                color: "color-mix(in oklab, var(--paper) 60%, transparent)",
                marginTop: 4,
              }}>
                Alt · {C.phone2}
              </div>
            </div>
          </a>

          {/* Email card */}
          <a
            href={`mailto:${C.email}`}
            style={{
              padding: "22px 24px",
              borderRadius: 16,
              border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
              background: "color-mix(in oklab, var(--paper) 5%, transparent)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              textDecoration: "none",
              color: "var(--paper)",
              transition: "border-color .2s, background .2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "color-mix(in oklab, var(--accent) 22%, transparent)",
                color: "var(--paper)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 4h12v8H2zM2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 55%, transparent)",
              }}>
                Email · Mon–Sat 9–6
              </span>
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--paper)",
                wordBreak: "break-all",
                letterSpacing: "-0.005em",
              }}>
                {C.email}
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                marginTop: 6,
              }}>
                Same-day reply on working days
              </div>
            </div>
          </a>
        </div>

        <div style={{ padding: "56px 0 40px", display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 50%, transparent)", marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)" }}>Address</div>
            <p style={{ fontSize: 14, color: "color-mix(in oklab, var(--paper) 75%, transparent)", lineHeight: 1.7, maxWidth: 280 }}>
              {C.address}
            </p>
            <Link href="/contact" className="row" style={{ gap: 8, alignItems: "center", marginTop: 18, color: "var(--paper)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              <span>Get directions</span>
              <ArrowIcon size={12} />
            </Link>
          </div>
          <Col heading="Courses" items={[["All courses", "/courses"], ["Computer Science", "/courses"], ["Dairy Engineering", "/courses"], ["Civil", "/courses"], ["Electrical", "/courses"], ["Mechanical", "/courses"], ["Lateral Entry", "/lateral-entry"]]} />
          <Col heading="Admission" items={[["Admission", "/admission"], ["Fees", "/fees"], ["Scholarships", "/scholarships"], ["Documents", "/documents"], ["JEECUP Guidance", "/jeecup"], ["Apply now", "/apply"]]} />
          <Col heading="About & Campus" items={[["About", "/about"], ["Principal", "/principal"], ["Teaching", "/teaching"], ["AI Policy", "/ai-policy"], ["Approvals", "/approvals"], ["Facilities", "/campus"], ["Hostel", "/hostel"], ["Faculty", "/faculty"], ["Events", "/events"]]} />
          <Col heading="Disclosures" items={[["Mandatory Disclosure", "/mandatory-disclosure"], ["Anti-Ragging", "/anti-ragging"], ["Grievance", "/grievance"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"], ["FAQ", "/faq"], ["Blog", "/blog"]]} />
        </div>

        {/* Social handles strip — Phase-2 audit: surface real handles */}
        <div style={{
          padding: "26px 0",
          borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>
              Follow BIPE
            </span>
            {DATA.social.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 999,
                border: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)",
                background: "color-mix(in oklab, var(--paper) 4%, transparent)",
                color: "var(--paper)", textDecoration: "none",
                fontSize: 13, fontWeight: 600,
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>{s.name}</span>
                <span>@{s.handle}</span>
              </a>
            ))}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "color-mix(in oklab, var(--paper) 50%, transparent)", textTransform: "uppercase" }}>
            YouTube · LinkedIn launching 2026-27
          </div>
        </div>

        <div style={{ padding: "28px 0", borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 50%, transparent)" }}>
            Approvals &amp; Affiliations
          </div>
          <div className="row" style={{ gap: 0, flexWrap: "wrap" }}>
            {([
              { l: "JEECUP", v: C.jeecup },
              { l: "AICTE", v: C.aicte },
              { l: "BTEUP", v: "Affiliated" },
              { l: "ISO", v: "9001:2015" },
              { l: "AFRC", v: "Approved" },
            ]).map((a, i, arr) => (
              <React.Fragment key={a.l}>
                <div style={{ padding: "4px 22px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "color-mix(in oklab, var(--paper) 50%, transparent)" }}>{a.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--paper)", marginTop: 2 }}>{a.v}</div>
                </div>
                {i < arr.length - 1 && <span style={{ width: 1, height: 32, background: "color-mix(in oklab, var(--paper) 14%, transparent)" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 0 36px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)", alignItems: "center" }}>
          <div>© 2026 Banaras Institute of Polytechnic &amp; Engineering. Engineering education that changes lives in Eastern UP — since 2010.</div>
          <div className="row" style={{ gap: 18, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", flexWrap: "wrap" }}>
            <Link href="/mandatory-disclosure" style={{ color: "inherit", textDecoration: "none" }}>Mandatory Disclosure</Link>
            <span>·</span>
            <Link href="/grievance" style={{ color: "inherit", textDecoration: "none" }}>Grievance</Link>
            <span>·</span>
            <Link href="/anti-ragging" style={{ color: "inherit", textDecoration: "none" }}>Anti-Ragging</Link>
            <span>·</span>
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
            <span>·</span>
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
            <span>·</span>
            <Link href="/ai-policy" style={{ color: "inherit", textDecoration: "none" }}>AI Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

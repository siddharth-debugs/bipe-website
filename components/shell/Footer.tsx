import Image from "next/image";
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

        {/* Brand strip — logo + height-matched institute name + tagline */}
        <div style={{
          paddingTop: 18,
          paddingBottom: 20,
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

          <div className="bipe-split" style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 24,
            alignItems: "center",
          }}>
            {/* Logo + height-matched institute name (mirrors header BrandMark) */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <Image
                src="/bipe-logo.svg"
                alt=""
                aria-hidden="true"
                width={2162}
                height={2497}
                style={{
                  height: 56,
                  width: Math.round(56 * 2162 / 2497),
                  display: "block",
                  flexShrink: 0,
                  filter: "brightness(0) invert(1)",
                }}
                draggable={false}
              />
              <span style={{
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: 56,
                width: 320,
                flexShrink: 0,
                fontFamily: "var(--font-sans)",
                fontSize: 21,
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: "0.005em",
                textTransform: "uppercase",
                color: "var(--paper)",
                whiteSpace: "nowrap",
              }}>
                <span>Banaras Institute of</span>
                <span>Polytechnic &amp; Engineering</span>
              </span>
            </div>

            {/* Spacer — keeps tagline pinned right on wide screens */}
            <div />

            {/* Tagline + back-to-top — right */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
              paddingLeft: 20,
              borderLeft: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
            }}>
              <div className="serif" style={{
                fontStyle: "italic",
                fontSize: "clamp(18px, 1.8vw, 24px)",
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

        </div>

        {/* CTA + contact strip — three compact matched cards */}
        <div style={{
          padding: "20px 0",
          borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1.1fr",
          gap: 10,
          alignItems: "stretch",
        }} className="bipe-grid-3">
          {/* CTA card */}
          <div style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
            background: "color-mix(in oklab, var(--paper) 5%, transparent)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "color-mix(in oklab, var(--paper) 55%, transparent)",
            }}>
              Take the next step
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Link href="/apply" className="btn btn-sm bipe-footer-cta" style={{ background: "var(--paper)", color: "var(--ink)", fontWeight: 600 }}>
                Apply <ArrowIcon size={11} />
              </Link>
              <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-sm bipe-footer-cta" style={{ background: "#25D366", color: "#fff", border: "none" }}>
                <WhatsAppIcon /> WhatsApp
              </a>
              <Link href="/visit" className="btn btn-sm bipe-footer-cta" style={{ color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 28%, transparent)" }}>
                Visit
              </Link>
            </div>
          </div>

          {/* Phone card */}
          <a
            href={`tel:${C.phone}`}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
              background: "color-mix(in oklab, var(--paper) 5%, transparent)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              color: "var(--paper)",
              transition: "border-color .2s, background .2s",
            }}
          >
            <span style={{
              width: 32, height: 32, borderRadius: 9,
              background: "color-mix(in oklab, var(--brand) 28%, transparent)",
              color: "var(--paper)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <PhoneIcon />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 55%, transparent)",
              }}>
                Call admissions
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--paper)",
                letterSpacing: "-0.005em",
                marginTop: 2,
              }}>
                {C.phone}
              </div>
            </div>
          </a>

          {/* Email card */}
          <a
            href={`mailto:${C.email}`}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
              background: "color-mix(in oklab, var(--paper) 5%, transparent)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              color: "var(--paper)",
              transition: "border-color .2s, background .2s",
            }}
          >
            <span style={{
              width: 32, height: 32, borderRadius: 9,
              background: "color-mix(in oklab, var(--accent) 22%, transparent)",
              color: "var(--paper)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12v8H2zM2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 55%, transparent)",
              }}>
                Email · Mon–Sat 9–6
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--paper)",
                wordBreak: "break-all",
                letterSpacing: "-0.005em",
                marginTop: 2,
              }}>
                {C.email}
              </div>
            </div>
          </a>
        </div>

        <div className="bipe-grid-4" style={{ padding: "56px 0 40px", display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr", gap: 48, alignItems: "start" }}>
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
          <Col heading="Academics" items={[["All branches", "/courses"], ["Computer Science & Engineering", "/courses"], ["Dairy Engineering", "/courses"], ["Civil Engineering", "/courses"], ["Electrical Engineering", "/courses"], ["Mechanical Engineering (Production)", "/courses"]]} />
          <Col heading="Admission" items={[["Admission", "/admission"], ["Fees", "/fees"], ["Scholarships", "/scholarships"], ["Documents", "/documents"], ["JEECUP Guidance", "/jeecup"], ["Apply now", "/apply"]]} />
          <Col heading="About & Campus" items={[["About", "/about"], ["Principal", "/principal"], ["Teaching", "/teaching"], ["Approvals", "/approvals"], ["Facilities", "/campus"], ["Hostel", "/hostel"], ["Faculty", "/faculty"], ["Events", "/events"]]} />
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
          <div className="row" style={{ gap: 18, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", flexWrap: "wrap" }}>
            <Link href="/terms" style={{ color: "color-mix(in oklab, var(--paper) 65%, transparent)", textDecoration: "none" }}>Terms</Link>
            <span style={{ color: "color-mix(in oklab, var(--paper) 30%, transparent)" }}>·</span>
            <Link href="/privacy" style={{ color: "color-mix(in oklab, var(--paper) 65%, transparent)", textDecoration: "none" }}>Privacy</Link>
          </div>
        </div>

        <div style={{ padding: "20px 0 28px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)", alignItems: "center", borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
          <div>© 2026 Banaras Institute of Polytechnic &amp; Engineering.</div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 45%, transparent)" }}>
              Phoolpur · Varanasi · since 2010
            </div>

            {/* Designed & developed credit */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              paddingLeft: 18,
              borderLeft: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 45%, transparent)",
              }}>
                Designed &amp; developed by
              </span>
              <Image
                src="/credit-logo.png"
                alt="SortString"
                width={1700}
                height={750}
                priority={false}
                style={{
                  height: 44,
                  width: "auto",
                  display: "block",
                  opacity: 0.92,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

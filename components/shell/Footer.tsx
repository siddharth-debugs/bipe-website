import Image from "next/image";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "./Icons";
import { BackToTop } from "./BackToTop";

/**
 * Subset of the live ContactInfo singleton the Footer actually renders.
 * app/layout.tsx fetches getContact() server-side and threads this
 * object through <ConditionalChrome> so the Footer can read live edits
 * from the admin's Contact info tab without crossing the client/server
 * async boundary.
 */
export interface FooterContact {
  phone: string;
  phone2: string;
  email: string;
  emailPlacement: string;
  whatsapp: string;
  address: string;
  jeecup: string;
  aicte: string;
}

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

export const Footer = ({ contact }: { contact?: FooterContact } = {}) => {
  // Prefer the server-fetched live contact (threaded via app/layout.tsx
  // → ConditionalChrome). Fall back to DATA.contact for anything the
  // live object doesn't supply or when the prop is omitted entirely
  // (e.g. local dev with the backend down).
  const C = {
    phone: contact?.phone || DATA.contact.phone,
    phone2: contact?.phone2 || DATA.contact.phone2,
    email: contact?.email || DATA.contact.email,
    emailPlacement: contact?.emailPlacement || DATA.contact.emailPlacement,
    whatsapp: contact?.whatsapp || DATA.contact.whatsapp,
    address: contact?.address || DATA.contact.address,
    jeecup: contact?.jeecup || DATA.contact.jeecup,
    aicte: contact?.aicte || DATA.contact.aicte,
  };
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
            JEECUP {C.jeecup}
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

          {/* Email card — surfaces the placement/admissions inbox the
              team actually monitors (Gmail). The institutional
              info@bipe.ac.in still lives on /contact, the Schema.org
              Organization markup, and as the primary in DATA.contact. */}
          <a
            href={`mailto:${C.emailPlacement}`}
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
                {C.emailPlacement}
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
          <Col heading="Academics" items={[["All branches", "/courses"], ["Placements", "/placements"], ["Computer Science & Engineering", "/courses/computer-science-engineering"], ["Dairy Engineering", "/courses/dairy-engineering"], ["Civil Engineering", "/courses/civil-engineering"], ["Electrical Engineering", "/courses/electrical-engineering"], ["Mechanical Engineering (Production)", "/courses/mechanical-engineering-production"]]} />
          {/* Admission column — 2026-05-20: added JEECUP Counselling
              (high-value 18,100/mo head term page that had no footer
              link previously) and JEECUP from Bihar (geo landing). */}
          <Col heading="Admission" items={[["Admission", "/admission"], ["Fees", "/fees"], ["Scholarships", "/scholarships"], ["Documents", "/documents"], ["JEECUP Guidance", "/jeecup"], ["JEECUP Counselling", "/jeecup-counselling"], ["JEECUP from Bihar", "/jeecup-from-bihar"], ["Apply now", "/apply"]]} />
          {/* About & Campus — 2026-05-20: added Affiliations &
              Approvals (consolidated 7-affiliation page) and Why BIPE
              (category-leader brand page). Both were route-live but
              unlinked. */}
          <Col heading="About & Campus" items={[["About", "/about"], ["Affiliations & Approvals", "/about/affiliations"], ["Why BIPE", "/why-bipe"], ["Private vs Government", "/private-vs-government-polytechnic"], ["Principal", "/principal"], ["Teaching", "/teaching"], ["Facilities", "/campus"], ["Hostel", "/hostel"], ["Faculty", "/faculty"], ["Alumni", "/alumni"], ["Events", "/events"], ["FAQ", "/faq"], ["Blog", "/blog"]]} />
          {/* Compliances — 2026-05-20: added AI Policy (route exists,
              required reading for AI-content disclosure but had no nav
              entry). */}
          <Col heading="Compliances" items={[["Approvals", "/approvals"], ["Mandatory Disclosure", "/mandatory-disclosure"], ["Anti-Ragging", "/anti-ragging"], ["Grievance", "/grievance"], ["AI Policy", "/ai-policy"], ["Privacy", "/privacy"], ["Terms", "/terms"]]} />
        </div>

        {/* Eastern UP catchment cluster — 2026-05-26. Footer-level
            internal-linking moat targeting "polytechnic in [town]" geo
            queries across BIPE's natural catchment. Every page on the
            site votes for these 6 geo-landing URLs via this footer
            block — inspired by BITE's "Compare Colleges in Varanasi"
            footer pattern that anchors their programmatic-SEO reach. */}
        <div
          style={{
            paddingTop: 24,
            marginTop: 8,
            borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
          }}
        >
          <Col
            heading="Polytechnic across Eastern UP"
            items={[
              ["Polytechnic in Chandauli", "/polytechnic-in-chandauli"],
              ["Polytechnic in Bhadohi", "/polytechnic-in-bhadohi"],
              ["Polytechnic in Jaunpur", "/polytechnic-in-jaunpur"],
              ["Polytechnic in Mirzapur", "/polytechnic-in-mirzapur"],
              ["Polytechnic in Ghazipur", "/polytechnic-in-ghazipur"],
              ["Polytechnic in Mau", "/polytechnic-in-mau"],
              ["Polytechnic in Sonbhadra", "/polytechnic-in-sonbhadra"],
              ["Polytechnic in Azamgarh", "/polytechnic-in-azamgarh"],
              ["Polytechnic in Ballia", "/polytechnic-in-ballia"],
              ["Polytechnic in Sultanpur", "/polytechnic-in-sultanpur"],
              ["Polytechnic in Pratapgarh", "/polytechnic-in-pratapgarh"],
              ["Polytechnic in Gorakhpur", "/polytechnic-in-gorakhpur"],
              ["Admission from Bihar", "/admission-from-bihar"],
              ["JEECUP from Bihar", "/jeecup-from-bihar"],
            ]}
          />
          {/* Government / aided / JEECUP-cutoff cluster — Commit 3,
              2026-05-26. Intercepts the high-volume "government
              polytechnic [town]" + JEECUP-cutoff search-intent
              cluster. Visible from every footer = site-wide link
              equity for the 3 comparison pages. */}
          <Col
            heading="Government & Aided Comparison"
            items={[
              ["Government polytechnic in Eastern UP", "/government-polytechnic-in-eastern-up"],
              ["Aided polytechnic in UP", "/aided-polytechnic-uttar-pradesh"],
              ["JEECUP 2026 cutoff · BIPE vs Government", "/jeecup-cutoff-2026-bipe-vs-government"],
              ["Private vs Government framework", "/private-vs-government-polytechnic"],
            ]}
          />
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
            {DATA.social
              // DATA.social is the canonical sameAs source for schema.org
              // (consumed by app/layout.tsx). It includes a Wikidata entry
              // for entity-graph binding, but Wikidata isn't a follow-able
              // social channel — filter it out of the visible footer
              // strip. Any non-social identifier (Wikidata, ROR, ORCID
              // when added) can use the same wikidata.org / non-social-
              // domain check.
              .filter((s) => !s.url.includes("wikidata.org"))
              .map((s) => (
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

        {/*
          Trust-signal line — Phase 1.5 keyword strategy (May 2026).
          BTE UP keywords aggregate to 823k+/mo but the SERP is owned
          by bteup.org.in. The affiliation is best used as a constant
          trust signal across every page — so we render it in the
          footer, visible site-wide.
        */}
        <div style={{ padding: "16px 0 14px", borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
          <p style={{
            margin: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "color-mix(in oklab, var(--paper) 60%, transparent)",
            lineHeight: 1.5,
          }}>
            <Link href="/approvals" style={{ color: "color-mix(in oklab, var(--paper) 85%, transparent)", textDecoration: "none" }}>
              Affiliated to BTE UP · Approved by AICTE · Code 4455
            </Link>
          </p>
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
              <a
                href="https://sortstring.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SortString — design and development partner for BIPE (opens in a new tab)"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  // Lift opacity slightly on hover so the link is
                  // discoverable without disturbing the muted footer
                  // composition at rest.
                  transition: "opacity .15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = ""; }}
              >
                <Image
                  src="/credit-logo.png"
                  // Was just "SortString" — that gave Google a bare agency
                  // name on every BIPE page footer with no context. Made
                  // it self-describing so the alt text matches what
                  // sighted users see ("Designed & developed by …").
                  alt="SortString — design and development partner for BIPE"
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
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

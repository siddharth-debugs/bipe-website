import type { Metadata } from "next";
import Image from "next/image";
import { metaFor } from "@/lib/routes";

export const metadata: Metadata = metaFor("brand");

const PRIMARY_COLORS = [
  { name: "Brand Blue", hex: "#005FFF", note: "Dome" },
  { name: "Saffron", hex: "#FF9601", note: "Band" },
  { name: "Deep Navy", hex: "#111D2F", note: "Wordmark" },
  { name: "Steel Grey", hex: "#C2C7CE", note: "Gear ring" },
];

const SYSTEM_COLORS = [
  { name: "Ink", hex: "#0A1A3F", role: "Primary text" },
  { name: "Paper", hex: "#F6F4EE", role: "Background" },
  { name: "Line", hex: "#E4E2DA", role: "Borders & rules" },
  { name: "Accent", hex: "#F0B429", role: "Highlights" },
];

export default function BrandKitPage() {
  return (
    <div className="page-enter" style={{ background: "var(--paper-2)", minHeight: "100vh", padding: "32px 16px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          aspectRatio: "4 / 3",
          background: "var(--paper)",
          borderRadius: 18,
          border: "1px solid var(--line)",
          boxShadow: "0 24px 60px -28px rgba(10, 26, 63, 0.18)",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        {/* Brand ribbon */}
        <div
          aria-hidden="true"
          style={{
            height: 6,
            background:
              "linear-gradient(90deg, #005FFF 0%, #005FFF 40%, #FF9601 70%, #F0B429 100%)",
          }}
        />

        {/* Body grid: Logo · Colours · Typography */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1.4fr",
            minHeight: 0,
          }}
          className="bipe-brand-body"
        >
          {/* LEFT — Logo + meta */}
          <section
            style={{
              padding: "44px 44px 36px",
              borderRight: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>§ Brand Kit · v1</div>
              <h1
                className="bipe-h2"
                style={{ marginTop: 10, letterSpacing: "-0.02em" }}
              >
                BIPE
              </h1>
              <p
                style={{
                  marginTop: 4,
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  color: "var(--ink-3)",
                  fontSize: 17,
                }}
              >
                Banaras Institute of Polytechnic &amp; Engineering
              </p>
            </div>

            {/* Logo lockup */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                background: "var(--white)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                position: "relative",
              }}
            >
              <div style={{ position: "relative", width: "70%", aspectRatio: "2162 / 2497" }}>
                <Image
                  src="/bipe-logo.svg"
                  alt="BIPE logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink-4)",
                }}
              >
                LOGO · SVG
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 14,
                  bottom: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.14em",
                  color: "var(--ink-4)",
                }}
              >
                /bipe-logo.svg
              </div>
            </div>

            {/* Identity meta */}
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                rowGap: 8,
                columnGap: 16,
                margin: 0,
                fontSize: 12.5,
              }}
            >
              {[
                ["Founded", "2010 · Phoolpur, Varanasi"],
                ["Trust", "Purwanchal Educational Trust"],
                ["AICTE ID", "1-488233171"],
                ["JEECUP", "4455"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                      paddingTop: 1,
                    }}
                  >
                    {k}
                  </dt>
                  <dd style={{ margin: 0, color: "var(--ink-2)" }}>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* RIGHT — Colours + Type */}
          <section
            style={{
              padding: "44px 44px 36px",
              display: "grid",
              gridTemplateRows: "auto auto 1fr",
              gap: 28,
              minHeight: 0,
            }}
          >
            {/* Primary palette (from logo) */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div className="eyebrow" style={{ color: "var(--brand)" }}>§ Primary palette</div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: "var(--ink-3)",
                  }}
                >
                  4 colours · sRGB
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
                className="bipe-keep-grid"
              >
                {PRIMARY_COLORS.map((c) => (
                  <div
                    key={c.hex}
                    style={{
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      overflow: "hidden",
                      background: "var(--white)",
                    }}
                  >
                    <div style={{ height: 64, background: c.hex }} />
                    <div style={{ padding: "10px 12px 12px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>
                        {c.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          letterSpacing: "0.04em",
                          color: "var(--ink-2)",
                          marginTop: 2,
                        }}
                      >
                        {c.hex}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--ink-3)",
                          marginTop: 4,
                        }}
                      >
                        {c.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System palette */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div className="eyebrow" style={{ color: "var(--brand)" }}>§ System palette</div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: "var(--ink-3)",
                  }}
                >
                  Web · interface
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
                className="bipe-keep-grid"
              >
                {SYSTEM_COLORS.map((c) => (
                  <div
                    key={c.hex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 10,
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "var(--white)",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        borderRadius: 8,
                        background: c.hex,
                        border: "1px solid var(--line)",
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>
                        {c.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10.5,
                          color: "var(--ink-3)",
                          letterSpacing: "0.02em",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.hex} · {c.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div style={{ minHeight: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <div className="eyebrow" style={{ color: "var(--brand)" }}>§ Typography</div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: "var(--ink-3)",
                  }}
                >
                  3 families
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                  alignItems: "stretch",
                }}
                className="bipe-keep-grid"
              >
                {/* Sans */}
                <div
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: "var(--white)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9.5,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                    }}
                  >
                    Sans · Geist
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>
                    Aa Bb 01
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--ink-3)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Body · UI · Headings
                  </div>
                </div>

                {/* Serif */}
                <div
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: "var(--white)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9.5,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                    }}
                  >
                    Serif · Instrument
                  </div>
                  <div
                    className="serif"
                    style={{
                      fontSize: 30,
                      fontStyle: "italic",
                      color: "var(--brand)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Aa Bb 01
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--ink-3)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Display · accent words
                  </div>
                </div>

                {/* Mono */}
                <div
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: "var(--white)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9.5,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                    }}
                  >
                    Mono · JetBrains
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 22,
                      letterSpacing: "0.02em",
                      lineHeight: 1,
                    }}
                  >
                    Aa Bb 01
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--ink-3)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Eyebrows · meta · code
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer strip */}
        <div
          style={{
            padding: "12px 44px",
            borderTop: "1px solid var(--line)",
            background: "var(--paper-2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            gap: 12,
          }}
        >
          <span>bipevns.org · Brand Kit</span>
          <span>For press &amp; partners</span>
          <span>v1 · 2026</span>
        </div>
      </div>
    </div>
  );
}

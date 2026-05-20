import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { IconTile } from "@/components/ui/IconTile";
import { CrossfadeSlider } from "@/components/ui/CrossfadeSlider";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { LabsGallery } from "@/components/campus/LabsGallery";
import {
  Droplets,
  Sun,
  Lightbulb,
  Accessibility,
  type LucideIcon,
} from "lucide-react";

import { getLibraryPhotos, getPageSection } from "@/lib/content";
import { PageIntro } from "@/components/shared/PageIntro";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("campus"); }

const STATS: { num: string; suffix?: string; label: string; sub: string }[] = [
  { num: "6", label: "Acres", sub: "Phoolpur · single boundary" },
  { num: "8428", label: "Books", sub: "1,220 unique titles" },
  { num: "120", suffix: "+", label: "Networked PCs", sub: "Computer centre" },
  { num: "50", label: "Mbps internet", sub: "Firewalled · 100% Wi-Fi" },
  { num: "40", label: "Faculty", sub: "1:20 mentor ratio" },
  { num: "5", label: "BTEUP branches", sub: "Including Dairy" },
];

const LIB_PILLS: string[] = [
  "DELNET",
  "National Digital Library",
  "1,220 titles",
  "36 journals",
  "95 magazines",
  "4 newspapers",
];

// Direct Cloudinary photos from BIPE's own workshop/lab library
// (lib/labs-manifest.json). Hand-picked to favour shots with students
// actually working — not equipment-only frames. Dairy stays on
// placeholder because we have no in-house dairy lab photography yet.
const CL = "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900";
const LABS: { eyebrow: string; title: string; body: string; img: string; tags: string[] }[] = [
  {
    eyebrow: "CIVIL · SURVEY YARD",
    title: "Civil Engineering",
    body: "Concrete testing, soil mechanics, surveying yard with total station and theodolite, plus a CAD studio. Field practice during the 4th-semester survey camp.",
    img: `${CL}/v1778151196/bipe/labs/civil/survey-camp`,
    tags: ["Total station", "Theodolite", "Concrete lab", "CAD"],
  },
  {
    eyebrow: "ELECTRICAL · POWER",
    title: "Electrical & Power",
    body: "Machines, power systems, PLC automation and renewable-energy testing benches. Renewable and battery-test setups support the Electrical and Mechanical Engineering (Production) cohorts.",
    img: `${CL}/v1778151083/bipe/labs/ee/industrial-visit-220-kb`,
    tags: ["Machines", "PLC", "Renewables", "EV"],
  },
  {
    eyebrow: "MECHANICAL · 8 SECTIONS",
    title: "Mechanical Workshops",
    body: "Welding, foundry, forging, machining (lathes, milling), CNC and an engine test bench. Every diploma student logs hands-on workshop hours each semester.",
    img: `${CL}/v1778151561/bipe/labs/mechanical/machin-shop-3`,
    tags: ["Welding", "Foundry", "CNC", "Lathe"],
  },
  {
    eyebrow: "DAIRY · RARE IN UP",
    title: "Dairy Processing Lab",
    body: "Pasteurisation pilot plant, dairy chemistry and microbiology benches, cold-chain storage. Mirrors what an Amul or Parag floor processes look like.",
    img: BIPE_IMG.dairy,
    tags: ["Pasteurisation", "Microbiology", "Cold chain"],
  },
  {
    eyebrow: "COMPUTER CENTRE",
    title: "Computing & ERP",
    body: "120 networked PCs running licensed operating systems, the in-house ERP, programming labs and a UPS-backed server room. Open 8 AM – 10 PM.",
    img: `${CL}/v1778150980/bipe/labs/cse/programming-lab-4`,
    tags: ["Networked", "Licensed OS", "ERP"],
  },
];

const SPORTS: string[] = ["Cricket", "Football", "Badminton", "Table tennis", "Kabaddi", "Indoor games"];

// Sustainability tiles are illustrated with IconTile (May 2026
// authenticity sweep): no real BIPE photos of solar panels / ramps /
// rainwater systems / LED retrofits on file yet, so the previous
// stock Unsplash placeholders were swapped for honest icon tiles
// (lucide-react glyphs over brand-tinted backgrounds). When campus
// photos become available, swap the IconTile usage in the SUSTAIN
// renderer for <Img src={...}> with a real /public/* path.
const SUSTAIN: { eyebrow: string; title: string; body: string; icon: LucideIcon; tone: "brand" | "accent" }[] = [
  { eyebrow: "WATER",    title: "Rainwater harvesting", body: "Six-bore rainwater system feeds the campus reserve. 24×7 running water across hostels and academic blocks.",                 icon: Droplets,     tone: "brand"  },
  { eyebrow: "ENERGY",   title: "Rooftop solar",        body: "Rooftop photovoltaic generation supplements grid power. Backup gensets across academic and residential blocks.",              icon: Sun,          tone: "accent" },
  { eyebrow: "LIGHTING", title: "LED everywhere",       body: "Campus-wide LED retrofit — academic blocks, workshops, hostels and the corridor. Lower load, longer life.",                   icon: Lightbulb,    tone: "accent" },
  { eyebrow: "ACCESS",   title: "Barrier-free design",  body: "Ramps and accessible toilets to AICTE norms. Ground-floor classrooms allocated for students with mobility needs.",            icon: Accessibility, tone: "brand"  },
];

export default async function Page() {
  // Library photos come from the backend when present, otherwise fall
  // back to the static manifest in lib/images.ts so the page never
  // breaks on a CMS hiccup.
  const [libraryFromApi, intro] = await Promise.all([
    getLibraryPhotos(),
    getPageSection("campus", "intro"),
  ]);
  const librarySlides = libraryFromApi.length
    ? libraryFromApi.map((p) => ({ src: p.image_url, alt: p.alt }))
    : BIPE_IMG.libraryPhotos;

  return (
    <div className="page-enter">
      <PageIntro section={intro} />
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
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
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Campus · Phoolpur</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                Six acres.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Built for hands.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                Our 6-acre Phoolpur campus houses five BTEUP branches, 40 faculty and 550+ students. Library, 120-computer lab, dairy pilot plant, mechanical workshops, hostels and a sports ground — all within one boundary.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/visit" className="btn btn-primary btn-lg">Book a campus visit <ArrowIcon size={16} /></Link>
                <Link href="/apply" className="btn btn-ghost btn-lg">Begin application</Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> WhatsApp</a>
              </div>

              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Within the boundary &rarr;
                </span>
                {["Library", "Workshops", "Hostels", "Sports"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < 3 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Image collage — four real BIPE workshop / lab shots. */}
            <div className="bipe-img-strip" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Img src={`${CL}/v1778151561/bipe/labs/mechanical/machin-shop-3`} label="MECH · WORKSHOP" style={{ height: 220, borderRadius: 18 }} />
              <Img src={`${CL}/v1778150999/bipe/labs/cse/project-expo-3rd-year`} label="CSE · PROJECT EXPO" style={{ height: 220, borderRadius: 18, marginTop: 28 }} />
              <Img src={`${CL}/v1778151196/bipe/labs/civil/survey-camp`} label="CIVIL · SURVEY CAMP" style={{ height: 220, borderRadius: 18, marginTop: -28 }} />
              <Img src={`${CL}/v1778151083/bipe/labs/ee/industrial-visit-220-kb`} label="ELECTRICAL · INDUSTRIAL VISIT" style={{ height: 220, borderRadius: 18 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. STATS BAND                                                           */}
      {/* ====================================================================== */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--white)" }}>
        <div className="container">
          <div className="bipe-stats" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: "32px 22px",
                borderLeft: i === 0 ? "none" : "1px solid var(--line)",
              }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: "clamp(40px, 4vw, 64px)", lineHeight: 0.95, color: "var(--brand)", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
                  <Counter to={s.num} />{s.suffix ?? ""}
                </div>
                <div style={{ marginTop: 10, fontWeight: 600, fontSize: 13.5 }}>{s.label}</div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 3, fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. LIBRARY                                                              */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 56, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ height: 480, borderRadius: 22, overflow: "hidden", position: "relative" }}>
                <CrossfadeSlider
                  images={librarySlides}
                  aspectRatio="4/3"
                  radius={22}
                  interval={4500}
                  fadeMs={900}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 14,
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "color-mix(in oklab, var(--ink) 78%, transparent)",
                    color: "var(--paper)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    zIndex: 2,
                  }}
                >
                  Library · Study hall
                </div>
              </div>
              <div style={{
                position: "absolute", right: -24, bottom: -24,
                background: "var(--white)", border: "1px solid var(--line)", borderRadius: 18,
                padding: "20px 24px", boxShadow: "0 24px 48px -20px rgba(10,26,63,0.18)",
              }}>
                <div className="serif" style={{ fontStyle: "italic", fontSize: 56, lineHeight: 0.9, color: "var(--brand)" }}>
                  <Counter to="8428" />
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginTop: 6 }}>
                  Books on the shelf
                </div>
              </div>
            </div>
            <div>
              <div className="eyebrow">Library</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "16ch" }}>
                A library that{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  teaches itself.
                </span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 18, fontSize: 16, lineHeight: 1.7, maxWidth: "54ch" }}>
                8,428 volumes across 1,220 unique titles. 36 journals, 95 magazines and 4 daily newspapers. DELNET membership opens up inter-library loan, and the National Digital Library puts 70 million records on every reading-room desktop.
              </p>
              <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LIB_PILLS.map((p) => <span key={p} className="pill">{p}</span>)}
              </div>
              <div style={{ marginTop: 28, padding: "20px 22px", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 14 }}>
                <div className="serif" style={{ fontStyle: "italic", fontSize: 22, lineHeight: 1.4, color: "var(--ink)" }}>
                  &ldquo;Books leave the shelves before exam week — we{" "}
                  <span style={{ color: "var(--brand)" }}>track every loan</span> through the in-house ERP.&rdquo;
                </div>
                <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Librarian · BIPE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. COMPUTER CENTRE & ERP — DARK                                         */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -180, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 36%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Computer centre · ERP</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch", color: "var(--paper)" }}>
                One floor.{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  Hundred-and-twenty
                </span>{" "}
                machines.
              </h2>
              <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 80%, transparent)", maxWidth: "54ch" }}>
                A networked computer centre with 120+ machines on licensed operating systems. 50 Mbps firewalled internet across the campus, an in-house ERP for attendance and library, and 100% Wi-Fi coverage from the workshop floor to the hostel mess.
              </p>
              <div className="bipe-stats" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {[
                  ["120+", "PCs networked"],
                  ["50 Mbps", "Internet · firewalled"],
                  ["100%", "Wi-Fi coverage"],
                ].map(([n, l]) => (
                  <div key={l} style={{
                    padding: "18px 18px",
                    background: "color-mix(in oklab, var(--paper) 6%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                    borderRadius: 14,
                  }}>
                    <div className="serif" style={{ fontStyle: "italic", fontSize: 32, color: "var(--accent)", lineHeight: 1 }}>{n}</div>
                    <div style={{ marginTop: 8, fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 64%, transparent)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Img src={BIPE_IMG.computerLab} label="COMPUTER CENTRE" style={{ height: 480, borderRadius: 22 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. ENGINEERING LABS                                                     */}
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
              <div className="eyebrow">Five labs</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Labs that{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  make engineers.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Every diploma here logs hands-on hours. The lab is not the demo room next to the projector — the lab is the course.
            </p>
          </div>

          <div className="bipe-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 22 }}>
            {LABS.map((lab, idx) => (
              <article key={lab.title} className="card" style={{
                padding: 0, overflow: "hidden",
                gridColumn: idx < 3 ? "span 2" : "span 3",
              }}>
                <Img src={lab.img} label={lab.eyebrow} style={{ height: 220, borderRadius: 0 }} />
                <div style={{ padding: 24 }}>
                  <div className="eyebrow" style={{ color: "var(--brand)" }}>{lab.eyebrow}</div>
                  <h3 className="bipe-h3" style={{ marginTop: 8, fontSize: 21 }}>{lab.title}</h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{lab.body}</p>
                  <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {lab.tags.map((t) => <span key={t} className="pill-accent pill">{t}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5b. INSIDE THE LABS — Cloudinary-backed, tab-filtered photo gallery     */}
      {/*                       sourced from the BIPE Drive folder.              */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Inside the labs</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
                From textbook to{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  toolbox.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Real photos, sorted by department. Tap a pill to filter — every shot is from our own workshops, not stock.
            </p>
          </div>

          <LabsGallery />
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. SPORTS — DARK FULL BLEED                                             */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        {/* Decorative background image — aria-hidden parent removes
            the entire subtree from the accessibility tree, so the
            empty label="" on the inner <Img> is intentional. Adding
            alt text here would be wrong: screen readers would
            announce a decorative photo as if it were a content
            image, double-narrating the sports section that already
            has its own heading + body copy. */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.18, pointerEvents: "none",
        }}>
          <Img src={BIPE_IMG.sportsGround} label="" style={{ height: "100%", width: "100%", borderRadius: 0 }} />
        </div>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, var(--ink) 0%, color-mix(in oklab, var(--ink) 70%, transparent) 70%, color-mix(in oklab, var(--ink) 40%, transparent) 100%)",
          pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, top: -160, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 38%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Recreation</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch", color: "var(--paper)" }}>
                Cricket. Football. Kabaddi.{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  And quiet rooms for chess.
                </span>
              </h2>
              <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 78%, transparent)", maxWidth: "54ch" }}>
                The ground sits behind the workshops — open from sunrise. Inter-branch matches every weekend, an annual sports week in February (Spardha) and quiet rooms for board games when the floodlights go off.
              </p>
              <div style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {SPORTS.map((s) => (
                  <span key={s} style={{
                    padding: "8px 14px", borderRadius: 999,
                    background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)",
                    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--paper)",
                  }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{
              padding: "26px 26px",
              background: "color-mix(in oklab, var(--paper) 6%, transparent)",
              border: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)",
              borderRadius: 18,
            }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Annual sports week</div>
              <div className="serif" style={{ marginTop: 10, fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--paper)", lineHeight: 1.05 }}>
                Spardha &mdash; <span style={{ color: "var(--accent)" }}>15&ndash;19 February</span>
              </div>
              <p style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 76%, transparent)" }}>
                Five days. Inter-branch, inter-batch and inter-institute meet — track &amp; field, volleyball, basketball, kabaddi and table tennis.
              </p>
              <Link href="/events" style={{
                marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8,
                color: "var(--accent)", fontWeight: 600, fontSize: 14,
              }}>
                See all February events <ArrowIcon size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. SUSTAINABILITY                                                       */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Sustainability · Access</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "18ch" }}>
                Built to be{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  efficient and open.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "42ch", justifySelf: "end", textAlign: "right" }}>
              Four practical decisions that lower the campus footprint and keep every classroom reachable.
            </p>
          </div>

          <div className="bipe-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {SUSTAIN.map((s) => (
              <article key={s.title} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <IconTile icon={s.icon} label={s.eyebrow} tone={s.tone} style={{ height: 160, borderRadius: 0 }} />
                <div style={{ padding: 22 }}>
                  <div className="eyebrow" style={{ color: "var(--brand)" }}>{s.eyebrow}</div>
                  <h3 className="bipe-h3" style={{ marginTop: 6, fontSize: 18 }}>{s.title}</h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.6 }}>{s.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div style={{
            marginTop: 28, padding: "20px 24px",
            background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 14,
            display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              Also on campus &rarr;
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 22, fontSize: 14, color: "var(--ink-2)" }}>
              <span><strong style={{ color: "var(--ink)" }}>Medical room</strong> · on-call doctor</span>
              <span><strong style={{ color: "var(--ink)" }}>Digital attendance</strong> · ERP</span>
              <span><strong style={{ color: "var(--ink)" }}>Free shuttle</strong> · Varanasi Cantt</span>
              <span><strong style={{ color: "var(--ink)" }}>24×7 security</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 8. CTA                                                                  */}
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
                <div className="eyebrow">Visit</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                  Walk it before{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    you decide.
                  </span>
                </h2>
                <p className="lead" style={{ marginTop: 18, maxWidth: "44ch" }}>
                  Free shuttle from Varanasi Cantt. Front desk open Monday to Saturday. Bring your parents — that&rsquo;s the visit we expect.
                </p>
                <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost btn-sm">
                    <PhoneIcon /> {DATA.contact.phone}
                  </a>
                  <a href={`tel:${DATA.contact.phone2}`} className="btn btn-ghost btn-sm">
                    <PhoneIcon /> {DATA.contact.phone2}
                  </a>
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
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Book a campus visit</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, #fff 70%, transparent)", marginTop: 2 }}>Free shuttle from Varanasi Cantt</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <Link href="/apply" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--ink)", color: "var(--paper)", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>02</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Begin application</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 60%, transparent)", marginTop: 2 }}>JEECUP code 4455</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--paper-2)", color: "var(--ink)", textDecoration: "none",
                  border: "1px solid var(--line)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>03</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Talk on WhatsApp</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Same-day reply · EN / हिं</div>
                  </div>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WhatsAppIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

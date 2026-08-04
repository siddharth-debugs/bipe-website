import type { Metadata } from "next";
import { DATA } from "@/lib/data";
import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";
import LpLeadForm from "./LpLeadForm";
import LpScheduleNote from "./LpScheduleNote";
import { phaseIndexAt } from "./lpSchedule";

/**
 * /lp/jeecup — dedicated paid-ad landing page (Meta / Google).
 *
 * One message, one form, no nav or footer (chrome is stripped in
 * ConditionalChrome for /lp/*). Built for paid mobile traffic: image-light
 * for fast LCP, the reserve-your-branch form above/beside the pitch, and the
 * Meta Lead firing on submit so the campaign optimises on real conversions.
 * noindex — it exists to receive ad clicks, not to rank or duplicate /jeecup.
 */
export const metadata: Metadata = {
  title: "Reserve your branch at BIPE · JEECUP 2026 (code 4455)",
  description:
    "JEECUP 2026 counselling is on. Do your free Pre-Counselling Registration and hold your branch at BIPE Varanasi — AICTE-approved, code 4455. Open / general category, no UP domicile needed.",
  robots: { index: false, follow: false },
};

// Placements figure derives from lib/placement-stats (the TPO manifest) —
// never hardcode it: a stale "993" from the old per-branch PDF sum slipped in
// here once and conflicted with the canonical 1,331 the site (and the video
// ad) use. See app/placements/page.tsx for the same resolution.
const TRUST: [string, string][] = [
  ["AICTE-approved", "Permanent ID 1-488233171"],
  ["BTEUP · code 4455", "5 diploma branches"],
  [`${formatPlacements(PLACEMENT_STATS.totalPlacements)}+ placements`, "TPO-verified · Mahindra · Tata · BEL"],
  ["Since 2010", "16 years on record"],
];

const PROOF: [string, string][] = [
  ["₹30,150", "AFRC-approved tuition / year"],
  ["Boys' hostel", "on-campus · shuttle from Cantt"],
  ["Bihar welcome", "open category · no UP domicile"],
];

export default function Page() {
  const telHref = `tel:${DATA.contact.phone.replace(/[^\d+]/g, "")}`;
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)" }}>
      {/* brand bar — no nav, just identity + call */}
      <div
        style={{
          borderBottom: "1px solid var(--line)",
          background: "var(--white)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 12, paddingBottom: 12 }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bipe-logo.svg" alt="BIPE" width={36} height={36} style={{ display: "block" }} />
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", color: "var(--ink)" }}>
              BIPE <span style={{ fontWeight: 400, color: "var(--ink-3)" }}>Varanasi</span>
            </span>
          </span>
          <a href={telHref} style={{ fontWeight: 600, fontSize: 14, color: "var(--brand)", whiteSpace: "nowrap" }}>
            ☎ {DATA.contact.phone}
          </a>
        </div>
      </div>

      {/* ambient accent */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none",
            backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute", left: -160, top: -140, width: 420, height: 420, borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 24%, transparent)", filter: "blur(120px)", pointerEvents: "none",
          }}
        />
        <div
          className="container"
          style={{
            position: "relative",
            display: "grid",
            // min(320px, 100%) — the track can never demand more than the
            // container, so sub-360px phones don't get sideways scroll.
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: "clamp(24px, 4vw, 48px)",
            alignItems: "start",
            // Top/bottom only — a `padding` shorthand would zero the
            // horizontal 24px that .container provides.
            paddingTop: "clamp(28px, 5vw, 56px)",
            paddingBottom: 40,
          }}
        >
          {/* message */}
          <div>
            <span className="eyebrow" style={{ color: "var(--brand)" }}>JEECUP 2026 · Counselling on now</span>
            <h1 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
              Reserve your branch at BIPE —{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                before counselling closes.
              </span>
            </h1>
            <p className="lead" style={{ marginTop: 18, maxWidth: "52ch", color: "var(--ink-2)" }}>
              Do your <strong>free Pre-Counselling Registration</strong> and hold your preferred branch at BIPE Varanasi — AICTE-approved, JEECUP code <strong>4455</strong>. Open / general category, so <strong>no UP domicile is needed</strong> — Bihar students welcome. Classes are already under way.
            </p>

            {/* Live counselling-schedule strip — rolls Round 3 → allotment →
                spot window on the exact IST dates, so the page always agrees
                with whichever schedule-phased ad brought the click here. */}
            <LpScheduleNote initialIndex={phaseIndexAt(Date.now())} />

            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {TRUST.map(([t, s]) => (
                <div key={t} style={{ padding: "12px 14px", background: "var(--white)", border: "1px solid var(--line)", borderRadius: 11 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{t}</div>
                  <div style={{ marginTop: 3, fontSize: 12, color: "var(--ink-3)" }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Flex, not `grid auto 1fr` — globals.css force-stacks that inline
                pattern at ≤860px (the mobile safety net), which broke these
                rows into awkward two-line stacks on phones. */}
            <ul style={{ marginTop: 22, listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
              {PROOF.map(([k, v]) => (
                <li key={k} style={{ display: "flex", flexWrap: "wrap", columnGap: 12, rowGap: 2, alignItems: "baseline", fontSize: 14.5, color: "var(--ink-2)" }}>
                  <span className="serif" style={{ fontStyle: "italic", color: "var(--brand)", fontWeight: 400, fontSize: 17, minWidth: 92 }}>{k}</span>
                  <span style={{ flex: "1 1 22ch" }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* form card */}
          <div
            className="card"
            style={{ background: "var(--white)", border: "1px solid var(--line)", borderRadius: 18, padding: "clamp(20px, 3vw, 30px)", position: "relative", zIndex: 1 }}
          >
            <div className="eyebrow" style={{ color: "var(--brand)" }}>Free · 2 minutes</div>
            <h2 className="bipe-h3" style={{ marginTop: 8, fontSize: 22, color: "var(--ink)" }}>
              Reserve your branch
            </h2>
            <p style={{ marginTop: 6, marginBottom: 18, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
              Drop your number — admissions calls back within the day, in Hindi or English, to hold your seat and guide your counselling choices.
            </p>
            <LpLeadForm />
          </div>
        </div>
      </section>

      {/* minimal foot */}
      <footer style={{ borderTop: "1px solid var(--line)", background: "var(--white)" }}>
        <div
          className="container"
          style={{ paddingTop: 20, paddingBottom: 20, fontSize: 12.5, color: "var(--ink-3)", display: "flex", flexWrap: "wrap", gap: "6px 16px", justifyContent: "space-between" }}
        >
          <span>Banaras Institute of Polytechnic &amp; Engineering · Gajokhar, Phoolpur, Varanasi 221206 · JEECUP 4455</span>
          <span>Private, AICTE-approved polytechnic. Not a government institution.</span>
        </div>
      </footer>
    </div>
  );
}

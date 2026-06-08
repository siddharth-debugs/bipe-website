import React from "react";
import Link from "next/link";
import { DATA, type Facility } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon } from "@/components/shell/Icons";

/**
 * `items` optional — server page passes live facilities from the
 * home/facilities PageSection. Falls back to DATA.facilities.
 */
export const CampusLife = ({ items }: { items?: Facility[] } = {}) => (
  <section className="section">
    <div className="container">
      <div className="between" style={{ marginBottom: 36, alignItems: "end", flexWrap: "wrap", gap: 24 }}>
        <div className="reveal">
          <div className="eyebrow">Campus Life</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>Six acres in Phoolpur. <span className="serif">Built for hands.</span></h2>
        </div>
        <Link href="/campus" className="btn btn-ghost">All facilities <ArrowIcon /></Link>
      </div>
      {/* Dead-click fix (Clarity, Jun 2026): this campus-photo collage
          reads as a tappable gallery on mobile, so ~1 in 8 sessions racked
          up dead clicks here. Each tile now links to /campus (the
          facilities hub) — taps become navigation instead of nothing. */}
      <div className="reveal bipe-collage" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "260px 200px", gap: 14 }}>
        <Img href="/campus" src={BIPE_IMG.workshop} alt="BIPE mechanical workshop — machining bay with lathes and milling machines" label="WORKSHOP · MACHINING BAY" style={{ gridRow: "span 2", height: "100%" }} />
        <Img href="/campus" src={BIPE_IMG.dairy} alt="BIPE Dairy Engineering pilot plant — pasteuriser and processing line" label="DAIRY PILOT PLANT" style={{ height: "100%" }} />
        <Img href="/campus" src={BIPE_IMG.computerLab} alt="BIPE 120-computer programming lab for the Computer Science diploma" label="120-COMPUTER LAB" style={{ height: "100%" }} />
        <Img href="/campus" src={BIPE_IMG.hostel} alt="BIPE student hostel Block A on the Phoolpur campus" label="HOSTEL · BLOCK A" style={{ height: "100%" }} />
        <Img href="/campus" src={BIPE_IMG.library} alt="BIPE library and reading room" label="LIBRARY" style={{ height: "100%" }} />
      </div>
      <div className="grid bipe-grid-4" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: 24 }}>
        {(items && items.length > 0 ? items : DATA.facilities).slice(0, 4).map((f, i) => (
          <div key={i} className="reveal" style={{ transitionDelay: `${i * 40}ms` }}>
            <div className="eyebrow" style={{ color: "var(--brand)" }}>{f.count}</div>
            <div style={{ fontWeight: 600, fontSize: 16, marginTop: 6 }}>{f.name}</div>
            <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

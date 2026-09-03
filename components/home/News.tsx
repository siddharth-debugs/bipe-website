import React from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/shell/Icons";
import { DATA } from "@/lib/data";

// Pinned to DATA.events as of 28 May 2026.
//
// Previously this was a server component calling getEvents() with a
// fallback to DATA.events. The admin record was serving stale +
// factually-wrong cards ("JEECUP 2026 results declared · May 24"
// when results aren't out until mid-June; "Tata Motors campus drive
// — 14 selected" attaching ₹3.6 LPA to what was actually an
// apprenticeship selection — see the note in lib/data.ts events; an
// 11-Apr-2026 Open House still surfacing as upcoming). Static now
// wins until the admin record is brought in line — same pattern
// used on Recruiters.tsx (see comment there).
export const News = () => {
  // Normalize each event to a stable id (date|title) so the JSX keys
  // below stay deterministic without a backend-supplied uuid.
  const events = DATA.events.map((e) => ({ ...e, id: `${e.date}|${e.title}` }));
  const top = events.slice(0, 3);
  const rest = events.slice(3, 7);
  return (
    <section className="section">
      <div className="container">
        <div className="between" style={{ marginBottom: 36, alignItems: "end", flexWrap: "wrap", gap: 24 }}>
          <div className="reveal">
            <div className="eyebrow">News & Events</div>
            <h2 className="bipe-h1" style={{ marginTop: 14 }}>What&apos;s <span className="serif">happening</span> on campus.</h2>
          </div>
          <Link href="/events" className="btn btn-ghost">All events <ArrowIcon /></Link>
        </div>
        {/* 28 May 2026 — wrapped every news card in a <Link href="/events">.
            Previously the cards looked clickable (visible arrow on the
            "rest" cards in the bottom row) but had no link wrap — the
            UI lied about the affordance. There are no per-event detail
            pages yet, so the natural destination is the /events listing
            page, which carries the full announcement copy plus the
            larger photo gallery. */}
        <div className="grid bipe-grid-3" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>
          {top.map((e, i) => (
            <Link
              key={e.id}
              href="/events"
              className="card reveal"
              style={{
                padding: i === 0 ? 28 : 22,
                gridRow: i === 0 ? "span 1" : "auto",
                transitionDelay: `${i * 50}ms`,
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="row" style={{ gap: 10, marginBottom: 14 }}>
                <span className="pill">{e.tag}</span>
                <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{formatDate(e.date)}</span>
              </div>
              <h3 className={i === 0 ? "bipe-h2" : "bipe-h3"}>{e.title}</h3>
              <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 12, lineHeight: 1.55 }}>{e.body}</p>
            </Link>
          ))}
        </div>
        {rest.length > 0 && (
          <div className="bipe-img-strip" style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {rest.map((e) => (
              <Link
                key={e.id}
                href="/events"
                className="card reveal"
                style={{
                  padding: 18,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 14,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div>
                  <div className="row" style={{ gap: 10, marginBottom: 6 }}>
                    <span className="pill" style={{ fontSize: 10 }}>{e.tag}</span>
                    <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{formatDate(e.date)}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{e.title}</div>
                </div>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

function formatDate(d: string): string {
  // Accept ISO YYYY-MM-DD or original "Apr 11, 2026" — render uniformly.
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const dt = new Date(d);
    if (!isNaN(dt.valueOf())) {
      return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }
  }
  return d;
}

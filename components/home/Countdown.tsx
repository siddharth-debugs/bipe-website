"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/shell/Icons";

const cell = (n: number, l: string) => (
  <div style={{ textAlign: "center", padding: "18px 8px", background: "var(--white)", border: "1px solid var(--line)", borderRadius: 14, minWidth: 84 }}>
    <div className="serif" style={{ fontSize: 48, lineHeight: 1, color: "var(--brand)" }} suppressHydrationWarning>{String(n).padStart(2, "0")}</div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", marginTop: 6, color: "var(--ink-3)", textTransform: "uppercase" }}>{l}</div>
  </div>
);

/**
 * Session countdown.
 *
 * Counts down to the first day of class. ONCE THAT DATE HAS PASSED the
 * component must not keep rendering a frozen 00:00:00:00 — it flips to
 * a "session under way" panel instead (Aug 2026: classes began 1 Aug
 * while JEECUP Round 5, the final counselling round, was still running,
 * so late entrants are still a live audience).
 *
 * The elapsed check runs against the live clock in an effect, not at
 * module scope, so the server render and the first client render agree.
 */
const START = "2026-08-01T00:00:00+05:30";

export const Countdown = () => {
  const target = useMemo(() => new Date(START).getTime(), []);
  // Start from the build-time comparison so SSR and first paint match,
  // then let the interval correct it on the client.
  const [now, setNow] = useState(target);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = target - now;
  const started = diff <= 0;

  const d = Math.floor(Math.max(0, diff) / 86400000);
  const h = Math.floor((Math.max(0, diff) % 86400000) / 3600000);
  const m = Math.floor((Math.max(0, diff) % 3600000) / 60000);
  const s = Math.floor((Math.max(0, diff) % 60000) / 1000);

  return (
    <section className="section">
      <div className="container">
        <div className="reveal bipe-split bipe-pad-box" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center", border: "1px solid var(--line)", background: "var(--brand-tint)", borderRadius: 24, padding: 40 }}>
          <div>
            <div className="row" style={{ alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span className="live-dot" />
              <span className="eyebrow" style={{ color: "var(--brand)" }} suppressHydrationWarning>
                {started ? "Session under way" : "Counselling Live"}
              </span>
            </div>

            {started ? (
              <>
                <h2 className="bipe-h2" suppressHydrationWarning>
                  Classes have <span className="serif">begun.</span>
                </h2>
                <p className="lead" style={{ marginTop: 14 }} suppressHydrationWarning>
                  The 2026-27 session started on 1 August — but JEECUP <strong>Round 5, the final counselling round</strong>, is still running and a few seats remain at BIPE. Add code 4455 to your choices, then talk to admissions the same day so you can join with minimal catch-up.
                </p>
              </>
            ) : (
              <>
                <h2 className="bipe-h2">Classes begin <span className="serif">1 August, 2026.</span></h2>
                <p className="lead" style={{ marginTop: 14 }}>JEECUP 2026 Round 5 (Phase 2) counselling is on — open to all states. Seat allotment is rank-based: add code 4455 to your choices and talk to admissions about a seat.</p>
              </>
            )}

            <div className="row" style={{ marginTop: 22, flexWrap: "wrap" }}>
              <Link href="/apply" className="btn btn-primary">Apply now <ArrowIcon /></Link>
              <Link href="/jeecup" className="btn btn-ghost">JEECUP guide</Link>
            </div>
          </div>

          {started ? (
            <div style={{
              justifySelf: "end", textAlign: "center",
              padding: "30px 34px", borderRadius: 18,
              background: "var(--white)", border: "1px solid var(--line)",
              minWidth: 240,
            }} suppressHydrationWarning>
              <div className="serif" style={{ fontStyle: "italic", fontSize: 40, lineHeight: 1.1, color: "var(--brand)" }}>
                Round 5
              </div>
              <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", lineHeight: 1.7 }}>
                Final counselling round<br />Open to all states
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--brand)", fontWeight: 700 }}>
                BIPE CODE 4455
              </div>
            </div>
          ) : (
            <div className="row" style={{ justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
              {cell(d, "days")}
              {cell(h, "hours")}
              {cell(m, "min")}
              {cell(s, "sec")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

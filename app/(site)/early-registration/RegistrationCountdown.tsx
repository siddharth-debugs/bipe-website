"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/**
 * Live countdown to the Pre-Counselling Registration deadline.
 *
 * Deadline: end of 27 July 2026 — BIPE's Round 5 admissions enquiry
 * deadline (owner-confirmed 25 Jul 2026 via the Double Tick R4 notice: complete
 * registration by then and the BIPE office reserves your branch + seat).
 * Anchored to IST (+05:30) so every visitor counts down to the *same* instant
 * regardless of their device timezone. Edit the one constant below to move it.
 *
 * Mirrors the home page's <Countdown> ticking + cell pattern
 * (components/home/Countdown.tsx): Date.now() differs server↔client by
 * a second, so the digit text nodes carry suppressHydrationWarning.
 * Once the deadline passes, diff pins to 0 and a "closed" notice
 * replaces the cells.
 */
const DEADLINE = "2026-07-28T00:00:00+05:30"; // close of 27 Jul 2026, IST (BIPE Round 5 admissions enquiry)

const cell = (n: number, label: string) => (
  <div
    style={{
      textAlign: "center",
      padding: "14px 6px",
      background: "var(--white)",
      border: "1px solid var(--line)",
      borderRadius: 12,
      minWidth: 70,
    }}
  >
    <div
      className="serif"
      style={{ fontSize: 38, lineHeight: 1, color: "var(--brand)" }}
      suppressHydrationWarning
    >
      {String(n).padStart(2, "0")}
    </div>
    <div
      style={{
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
        fontSize: 10,
        letterSpacing: "0.12em",
        marginTop: 6,
        color: "var(--ink-3)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  </div>
);

export function RegistrationCountdown() {
  const target = useMemo(() => new Date(DEADLINE).getTime(), []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const closed = diff === 0;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div
      style={{
        marginTop: 26,
        padding: "20px 22px",
        border: "1px solid var(--line)",
        background: "var(--brand-tint)",
        borderRadius: 18,
        maxWidth: 560,
      }}
    >
      <div className="row" style={{ alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="live-dot" />
        <span className="eyebrow" style={{ color: "var(--brand)" }} suppressHydrationWarning>
          {closed ? "Session 2026-27 · admission closed" : "Round 5 — final counselling round"}
        </span>
      </div>

      {closed ? (
        <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }} suppressHydrationWarning>
          Admission for session 2026-27 is closed — Pre-Counselling Registration ended on 27 July, <strong>JEECUP counselling has concluded</strong> with
          Round 5 as the final round, and classes began on 1 August. Planning session 2027-28? Leave your details below and BIPE admissions will call you
          back about code 4455, or{" "}
          <Link href="/contact" style={{ color: "var(--brand)", fontWeight: 600 }}>
            contact admissions
          </Link>{" "}
          directly.
        </p>
      ) : (
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          {cell(d, "days")}
          {cell(h, "hours")}
          {cell(m, "min")}
          {cell(s, "sec")}
        </div>
      )}
    </div>
  );
}

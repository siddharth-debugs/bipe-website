"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "./Icons";

const Cell = ({ v, l }: { v: number; l: string }) => (
  <span className="adm-cell">
    <span className="adm-cell-num" suppressHydrationWarning>{String(v).padStart(2, "0")}</span>
    <span className="adm-cell-lbl">{l}</span>
  </span>
);

export function AdmStrip() {
  const target = new Date("2026-08-01T00:00:00").getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return (
    <div className="adm-strip">
      <div className="container between" style={{ gap: 24 }}>
        <div className="row" style={{ alignItems: "center", gap: 14, flex: 1, minWidth: 0, overflow: "hidden" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600 }}>
            Counselling closes in
          </span>
          <span className="row" style={{ gap: 8, flexShrink: 0, alignItems: "center" }}>
            <Cell v={days} l="d" />
            <span className="adm-sep" />
            <Cell v={hours} l="h" />
            <span className="adm-sep" />
            <Cell v={mins} l="m" />
            <span className="adm-sep" />
            <Cell v={secs} l="s" />
          </span>
          <span style={{ width: 1, height: 14, background: "color-mix(in oklab, var(--paper) 18%, transparent)", margin: "0 4px" }} />
          <span style={{ fontSize: 13, color: "color-mix(in oklab, var(--paper) 78%, transparent)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} className="hide-md">
            Don&apos;t miss your branch — secure your seat for 2026-27
          </span>
        </div>
        <Link href="/apply" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--paper)", whiteSpace: "nowrap", textDecoration: "none", flexShrink: 0, padding: "5px 12px", borderRadius: 999, border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)", transition: "background .2s, border-color .2s" }}>
          Begin application
          <ArrowIcon size={12} />
        </Link>
      </div>
    </div>
  );
}

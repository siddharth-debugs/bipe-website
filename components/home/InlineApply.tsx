"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

export const InlineApply = () => {
  const [form, setForm] = useState({ name: "", phone: "", branch: "Computer Science & Engineering", mode: "visit" });
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", background: "var(--ink)", color: "var(--paper)", borderRadius: 24, padding: 48, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -100, top: -100, width: 340, height: 340, borderRadius: "50%", background: "color-mix(in oklab, var(--accent) 50%, transparent)", filter: "blur(80px)", opacity: 0.4 }} />
          <div style={{ position: "relative" }}>
            <div className="pill" style={{ background: "color-mix(in oklab, var(--paper) 12%, transparent)", color: "var(--paper)" }}>Quick Enquiry · 30 seconds</div>
            <h2 className="bipe-h2" style={{ color: "var(--paper)", marginTop: 18 }}>Two paths to BIPE.</h2>
            <p style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)", marginTop: 14, lineHeight: 1.55, maxWidth: "42ch" }}>
              <span className="serif" style={{ fontSize: 24, color: "var(--accent)" }}>Apply</span> via JEECUP code 4455 — or <span className="serif" style={{ fontSize: 24, color: "var(--accent)" }}>visit</span> the campus first. We&apos;ll guide you through both.
            </p>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, fontSize: 13, opacity: 0.8 }}>
              <div className="row" style={{ alignItems: "center", gap: 10 }}><span style={{ color: "var(--accent)" }}>✓</span> Free guidance call within 24 hours</div>
              <div className="row" style={{ alignItems: "center", gap: 10 }}><span style={{ color: "var(--accent)" }}>✓</span> Personal mentor introduction</div>
              <div className="row" style={{ alignItems: "center", gap: 10 }}><span style={{ color: "var(--accent)" }}>✓</span> Free transport from Varanasi Cantt for visits</div>
            </div>
          </div>
          {sent ? (
            <div style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", border: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)", borderRadius: 18, padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 48 }}>✉</div>
              <h3 className="bipe-h3" style={{ color: "var(--paper)", marginTop: 8 }}>Got it, {form.name.split(" ")[0] || "friend"}.</h3>
              <p style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)", marginTop: 8, fontSize: 14 }}>We&apos;ll call {form.phone || "you"} within 24 hours about {form.branch}.</p>
              <Link href="/apply" className="btn btn-primary" style={{ marginTop: 18 }}>Open full Apply form</Link>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: "color-mix(in oklab, var(--paper) 6%, transparent)", border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderRadius: 18, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="row" style={{ gap: 6 }}>
                {([["visit", "Book visit"], ["apply", "Apply now"]] as [string, string][]).map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setForm({ ...form, mode: v })}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid " + (form.mode === v ? "var(--accent)" : "transparent"), background: form.mode === v ? "color-mix(in oklab, var(--accent) 22%, transparent)" : "transparent", color: "var(--paper)", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>{l}</button>
                ))}
              </div>
              <div className="field">
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }} />
              </div>
              <div className="field">
                <input required type="tel" pattern="[0-9 +()-]{8,}" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number"
                  style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }} />
              </div>
              <div className="field">
                <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}
                  style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
                  {DATA.branches.map(b => <option key={b.code} style={{ color: "var(--ink)" }}>{b.name}</option>)}
                  <option style={{ color: "var(--ink)" }}>Other / Not sure yet</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: "center" }}>
                {form.mode === "visit" ? "Book my visit" : "Start application"} <ArrowIcon />
              </button>
              <div style={{ fontSize: 11, opacity: 0.6, textAlign: "center", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>No spam · We call within 24 hours</div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

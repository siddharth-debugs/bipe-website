"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";
import { Honeypot } from "@/components/shell/Honeypot";

type SendState = "idle" | "submitting" | "error";

export const InlineApply = () => {
  const [form, setForm] = useState({ name: "", phone: "", branch: "Computer Science & Engineering", mode: "visit" });
  const [sent, setSent] = useState(false);
  const [send, setSend] = useState<SendState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSend("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "contact",
          name: form.name.trim(),
          phone: form.phone.trim(),
          branch: form.branch,
          source: "Other",
          message:
            form.mode === "visit"
              ? "Quick enquiry · wants to book a campus visit"
              : "Quick enquiry · wants to start the application",
          consent: true,
          website: honeypotRef.current?.value ?? "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setSend("error");
        setErrorMsg(json.error ?? "Could not send. Please try again or WhatsApp us.");
        return;
      }
      setSent(true);
      setSend("idle");
    } catch {
      setSend("error");
      setErrorMsg("Network error. Try again or WhatsApp us.");
    }
  };
  return (
    <section className="section">
      <div className="container">
        <div className="bipe-split bipe-pad-box" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", background: "var(--ink)", color: "var(--paper)", borderRadius: 24, padding: 48, position: "relative", overflow: "hidden" }}>
          {/* Decorative glow — must not capture clicks; it stacks above
              the form's tab strip otherwise (positioned > static). */}
          <div aria-hidden="true" style={{ position: "absolute", right: -100, top: -100, width: 340, height: 340, borderRadius: "50%", background: "color-mix(in oklab, var(--accent) 50%, transparent)", filter: "blur(80px)", opacity: 0.4, pointerEvents: "none" }} />
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
              <Honeypot ref={honeypotRef} />
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
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter a 10-digit mobile number starting with 6-9"
                  value={form.phone}
                  onChange={e =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  placeholder="98XXXXXXXX"
                  style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}
                />
              </div>
              <div className="field">
                {/* aria-label on the select — Phase 1.5 a11y audit
                    (May 2026) caught this as an unlabelled form
                    control. The visible "Branch you're considering"
                    label is in the parent wrapper text but the select
                    itself has no associated <label>; aria-label is
                    the minimum-disruption fix that satisfies WCAG. */}
                <select
                  aria-label="Branch you're considering"
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}
                >
                  {DATA.branches.map(b => <option key={b.code} value={b.name} style={{ color: "var(--ink)" }}>{b.name}</option>)}
                  <option value="Not sure yet — guide me" style={{ color: "var(--ink)" }}>Not sure yet — guide me</option>
                </select>
              </div>
              <button type="submit" disabled={send === "submitting"} className="btn btn-primary btn-lg" style={{ justifyContent: "center" }}>
                {send === "submitting"
                  ? "Sending…"
                  : form.mode === "visit"
                    ? "Book my visit"
                    : "Start application"} <ArrowIcon />
              </button>
              {send === "error" && (
                <div role="alert" style={{ fontSize: 12, color: "color-mix(in oklab, var(--accent) 80%, #fff)", textAlign: "center" }}>
                  {errorMsg}
                </div>
              )}
              <div style={{ fontSize: 11, opacity: 0.6, textAlign: "center", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>No spam · We call within 24 hours</div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

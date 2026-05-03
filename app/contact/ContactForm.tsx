"use client";

import React, { useState } from "react";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

type FormState = {
  name: string;
  mobile: string;
  email: string;
  branch: string;
  source: string;
  message: string;
  consent: boolean;
};

const SOURCES = ["Friend / family", "Google search", "Newspaper / hoarding", "Visited the campus", "Social media", "Other"];

export function ContactForm() {
  const branchOptions = [
    ...DATA.branches.filter((b) => !b.lateral).map((b) => b.name),
    "Lateral entry / Other",
  ];

  const [data, setData] = useState<FormState>({
    name: "",
    mobile: "",
    email: "",
    branch: "",
    source: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setData({ ...data, [k]: v });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!data.name.trim()) next.name = "Required";
    if (!/^[0-9 +()-]{8,}$/.test(data.mobile)) next.mobile = "Enter a valid mobile";
    if (data.email && !/.+@.+\..+/.test(data.email)) next.email = "Invalid email";
    if (!data.consent) next.consent = "Please tick the consent box";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire to admissions backend / CRM endpoint
      setSent(true);
    }
  };

  if (sent) {
    const firstName = data.name.trim().split(/\s+/)[0] || "there";
    return (
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 22%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", textAlign: "center", padding: "32px 20px" }}>
          <span className="pill" style={{ background: "color-mix(in oklab, var(--success) 16%, transparent)", color: "var(--success)" }}>
            Received · we&apos;ll reply in &lt;24h
          </span>
          <p className="serif" style={{
            marginTop: 22,
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(36px, 4.6vw, 64px)",
            lineHeight: 1.05, letterSpacing: "-0.02em",
            maxWidth: "18ch", margin: "22px auto 0",
            color: "var(--ink)",
          }}>
            Thanks, <span style={{ color: "var(--brand)" }}>{firstName}.</span>
          </p>
          <p style={{ marginTop: 20, color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6, maxWidth: "52ch", margin: "20px auto 0" }}>
            Admissions has your message. We&apos;ll call <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)" }}>{data.mobile}</span> within 24 hours, Monday to Saturday — in Hindi or English.
          </p>
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              <WhatsAppIcon /> WhatsApp instead
            </a>
            <button type="button" onClick={() => { setSent(false); setData({ name: "", mobile: "", email: "", branch: "", source: "", message: "", consent: false }); }} className="btn btn-ghost">
              Send another <ArrowIcon size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const errClass = (k: keyof FormState) => (errors[k] ? "field field-error" : "field");

  return (
    <form onSubmit={submit} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className={errClass("name")}>
          <label htmlFor="cf-name">Full name <span style={{ color: "var(--danger)" }}>*</span></label>
          <input id="cf-name" type="text" value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name (or guardian's)" />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>
        <div className={errClass("mobile")}>
          <label htmlFor="cf-mobile">Mobile <span style={{ color: "var(--danger)" }}>*</span></label>
          <input id="cf-mobile" type="tel" value={data.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="+91 9XXX-XXXX-XX" />
          {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
        <div className={errClass("email")}>
          <label htmlFor="cf-email">Email <span className="muted" style={{ fontSize: 11 }}>(optional)</span></label>
          <input id="cf-email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="cf-branch">Branch interest</label>
          <select id="cf-branch" value={data.branch} onChange={(e) => update("branch", e.target.value)}>
            <option value="">Not sure yet — please advise</option>
            {branchOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="cf-source">How did you hear about BIPE?</label>
        <select id="cf-source" value={data.source} onChange={(e) => update("source", e.target.value)}>
          <option value="">Pick one (optional)</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="cf-message">Your message <span className="muted" style={{ fontSize: 11 }}>(optional)</span></label>
        <textarea id="cf-message" rows={4} value={data.message} onChange={(e) => update("message", e.target.value)} placeholder="Anything specific you'd like answered before we call back?" />
      </div>

      <label style={{
        marginTop: 18, display: "flex", gap: 12, alignItems: "flex-start",
        padding: "14px 16px",
        background: "color-mix(in oklab, var(--brand) 5%, var(--white))",
        border: errors.consent ? "1px solid var(--danger)" : "1px solid var(--line)",
        borderRadius: 12,
        cursor: "pointer",
      }}>
        <input type="checkbox" checked={data.consent} onChange={(e) => update("consent", e.target.checked)} style={{ marginTop: 4, accentColor: "var(--brand)" }} />
        <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
          I agree to be contacted by BIPE Admissions on the mobile number above for the purpose of this query. We&apos;ll never share your details with third parties.
        </span>
      </label>
      {errors.consent && <div className="error-msg" style={{ marginTop: 6 }}>{errors.consent}</div>}

      <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-primary btn-lg">
          Send to admissions <ArrowIcon size={14} />
        </button>
        <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: "var(--brand)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
          Or, just WhatsApp us instantly <ArrowIcon size={14} />
        </a>
      </div>
    </form>
  );
}

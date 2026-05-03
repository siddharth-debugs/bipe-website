"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

type FormState = {
  name: string; phone: string; email: string; parent: string;
  branch: string; category: string; marks: string; board: string;
  visit: "yes" | "maybe" | "no"; date: string; time: string;
  notes: string;
};

const STEP_TITLES: { title: string; sub: string }[] = [
  { title: "Your details", sub: "Name, phone, parent — basics so we can call back." },
  { title: "Branch interest", sub: "Pick a branch (or ask for guidance) and tell us about marks." },
  { title: "How you found us", sub: "Visit preference, slot, anything we should know." },
  { title: "Confirm", sub: "Review, then submit. No commitment — just a callback." },
];

export function ApplyView() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>({
    name: "", phone: "", email: "", parent: "",
    branch: "", category: "General", marks: "", board: "",
    visit: "yes", date: "", time: "10:00 AM",
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!data.name.trim()) e.name = "Required";
      if (!/^[0-9 +()-]{8,}$/.test(data.phone)) e.phone = "Enter a valid phone";
      if (data.email && !/.+@.+\..+/.test(data.email)) e.email = "Invalid email";
    } else if (s === 1) {
      if (!data.branch) e.branch = "Pick a branch";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(step + 1); };
  const submit = () => { if (validate(step)) setStep(step + 1); };

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setData({ ...data, [k]: v });

  // ============ SUCCESS STATE ============
  if (step === 4) {
    return (
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "20%", transform: "translateX(-50%)",
          width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 22%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", maxWidth: 720, textAlign: "center", padding: "60px 24px" }}>
          <div style={{
            width: 92, height: 92, borderRadius: 999,
            background: "var(--brand)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto", fontSize: 42, fontWeight: 600,
            boxShadow: "0 24px 60px -16px color-mix(in oklab, var(--brand) 50%, transparent)",
          }}>
            ✓
          </div>
          <div className="eyebrow" style={{ marginTop: 28, color: "var(--brand)" }}>§ Application received</div>
          <h2 className="bipe-h1" style={{ marginTop: 14 }}>
            Got it,{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              {data.name.split(" ")[0] || "friend"}.
            </span>
          </h2>
          <p className="lead" style={{ marginTop: 18, margin: "18px auto 0", maxWidth: "52ch" }}>
            Reference{" "}
            <b style={{ color: "var(--brand)", fontFamily: "var(--font-mono)" }}>
              BIPE-{Math.floor(Math.random() * 900000 + 100000)}
            </b>
            . Our admissions cell will call <b>{data.phone}</b> within 24 hours.{" "}
            {data.visit === "yes" && (
              <>We&apos;ve blocked your visit slot for <b>{data.date || "the date you chose"} at {data.time}</b>.</>
            )}
          </p>
          <div className="row" style={{ justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
              <WhatsAppIcon /> Continue on WhatsApp
            </a>
            <Link href="/" className="btn btn-ghost btn-lg">Back to home</Link>
          </div>
        </div>
      </section>
    );
  }

  // ============ FORM ============
  return (
    <section className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 32 }}>
      <div className="container">
        <div style={{
          position: "relative", overflow: "hidden",
          borderRadius: 28,
          border: "1px solid var(--line)",
          background: "color-mix(in oklab, var(--brand) 6%, var(--white))",
          padding: 4,
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

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "320px 1fr", gap: 0, borderRadius: 24, overflow: "hidden" }}>
            {/* LEFT RAIL — step indicator */}
            <aside style={{
              background: "var(--ink)", color: "var(--paper)",
              padding: "40px 32px",
              position: "relative", overflow: "hidden",
            }}>
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, opacity: 0.06,
                backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
                backgroundSize: "48px 48px", pointerEvents: "none",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", left: -80, bottom: -80, width: 240, height: 240, borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 50%, transparent)",
                filter: "blur(100px)", pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>§ Application form</div>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 36, lineHeight: 1, color: "var(--paper)",
                  marginTop: 12,
                }}>
                  Step{" "}
                  <span style={{ color: "var(--accent)" }}>{step + 1}</span>{" "}
                  of 4
                </div>

                <ol style={{ marginTop: 32, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                  {STEP_TITLES.map((s, i) => {
                    const state: "done" | "active" | "todo" = i < step ? "done" : i === step ? "active" : "todo";
                    return (
                      <li key={s.title} style={{
                        position: "relative",
                        padding: "14px 16px",
                        borderRadius: 12,
                        background: state === "active" ? "color-mix(in oklab, var(--accent) 18%, transparent)" : "transparent",
                        border: state === "active" ? "1px solid color-mix(in oklab, var(--accent) 36%, transparent)" : "1px solid transparent",
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
                          <span style={{
                            width: 30, height: 30, borderRadius: 999,
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                            background: state === "done" ? "var(--accent)" : state === "active" ? "var(--paper)" : "color-mix(in oklab, var(--paper) 12%, transparent)",
                            color: state === "done" ? "var(--ink)" : state === "active" ? "var(--ink)" : "color-mix(in oklab, var(--paper) 60%, transparent)",
                          }}>
                            {state === "done" ? "✓" : String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: state === "todo" ? "color-mix(in oklab, var(--paper) 60%, transparent)" : "var(--paper)" }}>
                              {s.title}
                            </div>
                            <div style={{ fontSize: 11.5, marginTop: 3, color: "color-mix(in oklab, var(--paper) 55%, transparent)", lineHeight: 1.4 }}>
                              {s.sub}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
                  <div className="eyebrow" style={{ color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                    Need help?
                  </div>
                  <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                    marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8,
                    color: "var(--accent)", fontWeight: 600, fontSize: 13,
                  }}>
                    <WhatsAppIcon /> Chat with admissions
                  </a>
                </div>
              </div>
            </aside>

            {/* RIGHT PANE — fields */}
            <div style={{ background: "var(--white)", padding: "40px 44px" }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>{`Step 0${step + 1}`}</div>
              <h3 className="bipe-h2" style={{ marginTop: 8, fontSize: 32 }}>
                {STEP_TITLES[step].title}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>.</span>
              </h3>
              <p className="muted" style={{ marginTop: 8, fontSize: 14, maxWidth: "52ch" }}>
                {STEP_TITLES[step].sub}
              </p>

              <div style={{ marginTop: 28 }}>
                {step === 0 && (
                  <div className="grid" style={{ gap: 18 }}>
                    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <div className={"field " + (errors.name ? "field-error" : "")}>
                        <label>Your full name</label>
                        <input value={data.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Aarav Yadav" />
                        {errors.name && <span className="error-msg">{errors.name}</span>}
                      </div>
                      <div className={"field " + (errors.phone ? "field-error" : "")}>
                        <label>Phone (we&apos;ll call you)</label>
                        <input type="tel" value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 9XXXX XXXXX" />
                        {errors.phone && <span className="error-msg">{errors.phone}</span>}
                      </div>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <div className={"field " + (errors.email ? "field-error" : "")}>
                        <label>Email <span style={{ color: "var(--ink-3)" }}>(optional)</span></label>
                        <input type="email" value={data.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" />
                        {errors.email && <span className="error-msg">{errors.email}</span>}
                      </div>
                      <div className="field">
                        <label>Parent / guardian name</label>
                        <input value={data.parent} onChange={e => update("parent", e.target.value)} placeholder="e.g. Mr. Yadav" />
                      </div>
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div className="grid" style={{ gap: 18 }}>
                    <div className={"field " + (errors.branch ? "field-error" : "")}>
                      <label>Preferred branch</label>
                      <select value={data.branch} onChange={e => update("branch", e.target.value)}>
                        <option value="">— Choose a branch —</option>
                        {DATA.branches.map(b => <option key={b.code} value={b.name}>{b.name} (Code {b.code})</option>)}
                        <option>Not sure yet — guide me</option>
                      </select>
                      {errors.branch && <span className="error-msg">{errors.branch}</span>}
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                      <div className="field">
                        <label>Category</label>
                        <select value={data.category} onChange={e => update("category", e.target.value)}>
                          {["General", "OBC", "SC", "ST", "EWS", "Minority"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>10th board</label>
                        <select value={data.board} onChange={e => update("board", e.target.value)}>
                          <option value="">— Select —</option>
                          {["UP Board", "CBSE", "ICSE", "Other"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>10th marks (%)</label>
                        <input value={data.marks} onChange={e => update("marks", e.target.value)} placeholder="e.g. 72" />
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="grid" style={{ gap: 18 }}>
                    <div className="field">
                      <label>Would you like to visit campus?</label>
                      <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                        {([["yes", "Yes — book a slot"], ["maybe", "Maybe — call me first"], ["no", "No — apply only"]] as [FormState["visit"], string][]).map(([v, l]) => (
                          <button key={v} type="button" onClick={() => update("visit", v)}
                            style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid " + (data.visit === v ? "var(--brand)" : "var(--line-2)"), background: data.visit === v ? "var(--brand-soft)" : "var(--white)", color: data.visit === v ? "var(--brand)" : "var(--ink-2)", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>{l}</button>
                        ))}
                      </div>
                    </div>
                    {data.visit === "yes" && (
                      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        <div className="field">
                          <label>Visit date</label>
                          <input type="date" value={data.date} onChange={e => update("date", e.target.value)} />
                        </div>
                        <div className="field">
                          <label>Slot</label>
                          <select value={data.time} onChange={e => update("time", e.target.value)}>
                            {["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="field">
                      <label>Anything you&apos;d like us to know?</label>
                      <textarea rows={3} value={data.notes} onChange={e => update("notes", e.target.value)} placeholder="Special requests, accessibility needs, transport preference…" />
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {([
                        ["Name", data.name],
                        ["Phone", data.phone],
                        ["Email", data.email || "—"],
                        ["Parent", data.parent || "—"],
                        ["Branch", data.branch],
                        ["Category", data.category],
                        ["10th board · marks", `${data.board || "—"} · ${data.marks || "—"}%`],
                        ["Campus visit", data.visit === "yes" ? `${data.date || "date TBD"} · ${data.time}` : data.visit],
                      ] as [string, string][]).map(([k, v]) => (
                        <div key={k} style={{ padding: 14, background: "var(--paper-2)", borderRadius: 10 }}>
                          <div className="eyebrow" style={{ fontSize: 10 }}>{k}</div>
                          <div style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>{v || "—"}</div>
                        </div>
                      ))}
                    </div>
                    {data.notes && (
                      <div style={{ marginTop: 14, padding: 14, background: "var(--paper-2)", borderRadius: 10 }}>
                        <div className="eyebrow" style={{ fontSize: 10 }}>Notes</div>
                        <div style={{ fontSize: 14, marginTop: 4 }}>{data.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="between" style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
                <button onClick={() => step > 0 ? setStep(step - 1) : null} className="btn btn-ghost" disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
                  ← Back
                </button>
                {step < 3 ? (
                  <button onClick={next} className="btn btn-primary">Continue <ArrowIcon /></button>
                ) : (
                  <button onClick={submit} className="btn btn-primary btn-lg">Submit application <ArrowIcon /></button>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="muted" style={{ marginTop: 18, fontSize: 12, textAlign: "center" }}>
          By submitting, you agree to be contacted by BIPE Admissions about 2026-27 admissions. We don&apos;t share your details.
        </p>
      </div>
    </section>
  );
}

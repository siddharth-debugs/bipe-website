"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Honeypot } from "@/components/shell/Honeypot";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { DATA } from "@/lib/data";
import { track } from "@/lib/analytics";
import { BRANCH_OPTIONS } from "@/lib/formOptions";

/**
 * Early Seat Registration form (JEECUP 2026 campaign).
 *
 * Submits as a standard `enquiry` (source = "early-registration") so the
 * lead lands in the admin Inbox via the existing backend ingest — the
 * JEECUP-specific fields (application no, group, parent phone) are packed
 * into the enquiry `message`, since the Django backend's ingest kinds are
 * fixed (apply | contact | enquiry | visit) and must not be migrated.
 */
type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; ref: string; name: string }
  | { state: "error"; message: string };

export function EarlyRegistrationForm() {
  const [name, setName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [appNo, setAppNo] = useState("");
  const [group, setGroup] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  const ten = (v: string) => v.replace(/\D/g, "").slice(0, 10);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.state === "sending") return;
    if (name.trim().length < 2)
      return setStatus({ state: "error", message: "Please enter the student's full name." });
    if (phone.length !== 10)
      return setStatus({ state: "error", message: "Enter a valid 10-digit student mobile number." });
    if (appNo.trim().length < 4)
      return setStatus({ state: "error", message: "Enter your JEECUP 2026 application number." });

    setStatus({ state: "sending" });
    const message =
      "EARLY SEAT REGISTRATION — JEECUP 2026\n" +
      `JEECUP application no: ${appNo.trim()}\n` +
      `JEECUP group: ${group.trim() || "—"}\n` +
      `Branch preference: ${branch || "Not specified"}\n` +
      `Parent/guardian phone: ${parentPhone || "—"}`;

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "enquiry",
          name: name.trim(),
          phone,
          branch,
          source: "early-registration",
          message,
          consent: true,
          website: honeypotRef.current?.value ?? "",
        }),
      });
      const json = (await res.json()) as { ok: boolean; id?: number | string; error?: string };
      if (!res.ok || !json.ok) {
        setStatus({ state: "error", message: json.error ?? "Couldn't register. Please try again or WhatsApp us." });
        return;
      }
      const ref = json.id ? `BIPE-ESR-${String(json.id).padStart(5, "0")}` : "BIPE-ESR";
      track("enquiry_submit", { branch: branch || undefined, source: "early-registration" });
      setStatus({ state: "success", ref, name: name.trim().split(" ")[0] });
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again or WhatsApp us." });
    }
  }

  // ── Success ──────────────────────────────────────────────────────────
  if (status.state === "success") {
    return (
      <div style={{ textAlign: "center", padding: "8px 4px" }}>
        <div
          aria-hidden="true"
          style={{
            width: 76, height: 76, borderRadius: 999, margin: "0 auto",
            background: "var(--brand)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 600,
          }}
        >
          ✓
        </div>
        <div className="eyebrow" style={{ marginTop: 20, color: "var(--brand)" }}>
          Registration received
          <span lang="hi" style={{ fontWeight: 400, opacity: 0.7, letterSpacing: "normal", textTransform: "none" }}> · रजिस्ट्रेशन मिल गया</span>
        </div>
        <h3 className="bipe-h3" style={{ marginTop: 8, fontSize: 24 }}>
          You&rsquo;re registered, {status.name}.
        </h3>
        <p lang="hi" style={{ marginTop: 6, color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.6 }}>
          {status.name}, आप रजिस्टर हो गए हैं।
        </p>
        <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7, maxWidth: "46ch", marginInline: "auto" }}>
          Reference <b style={{ color: "var(--brand)", fontFamily: "var(--font-mono)" }}>{status.ref}</b>. Your branch and the
          ₹1,200 scholarship are held for <b>7 days</b> — visit campus within a week to confirm. Our admissions team will also call you shortly.
        </p>
        <p lang="hi" style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.85, maxWidth: "48ch", marginInline: "auto" }}>
          आपकी पसंदीदा ब्रांच और <b>₹1,200 स्कॉलरशिप 7 दिन</b> के लिए सुरक्षित है — एक हफ़्ते के अंदर कैंपस आकर कन्फर्म करें। हमारी एडमिशन टीम जल्द ही आपको कॉल भी करेगी।
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 26, gap: 12, flexWrap: "wrap" }}>
          <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
            <WhatsAppIcon /> Confirm on WhatsApp
          </a>
          <Link href="/visit#book" className="btn btn-ghost btn-lg">
            Plan my campus visit <ArrowIcon size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} noValidate>
      <Honeypot ref={honeypotRef} />
      <div className="grid" style={{ gap: 16 }}>
        <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label htmlFor="esr-name">
              Student&rsquo;s full name
              <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· छात्र का नाम</span>
            </label>
            <input id="esr-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Yadav" autoComplete="name" maxLength={100} required />
          </div>
          <div className="field">
            <label htmlFor="esr-phone">
              Student mobile
              <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· मोबाइल</span>
            </label>
            <input id="esr-phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(ten(e.target.value))} placeholder="10-digit number" autoComplete="tel" maxLength={10} required />
          </div>
        </div>

        <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field">
            <label htmlFor="esr-parent">
              Parent / guardian mobile
              <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· अभिभावक</span>
            </label>
            <input id="esr-parent" type="tel" inputMode="numeric" value={parentPhone} onChange={(e) => setParentPhone(ten(e.target.value))} placeholder="Recommended for under-18" autoComplete="tel" maxLength={10} />
          </div>
          <div className="field">
            <label htmlFor="esr-appno">
              JEECUP 2026 application no.
              <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· आवेदन संख्या</span>
            </label>
            <input id="esr-appno" value={appNo} onChange={(e) => setAppNo(e.target.value)} placeholder="From your JEECUP form" maxLength={30} required />
          </div>
        </div>

        <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 2fr" }}>
          <div className="field">
            <label htmlFor="esr-group">
              JEECUP group
              <span style={{ color: "var(--ink-3)" }}> (e.g. A)</span>
            </label>
            <input id="esr-group" value={group} onChange={(e) => setGroup(e.target.value.toUpperCase().slice(0, 4))} placeholder="A" maxLength={4} />
          </div>
          <div className="field">
            <label htmlFor="esr-branch">
              Preferred branch
              <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· पसंदीदा ब्रांच</span>
            </label>
            <select id="esr-branch" value={branch} onChange={(e) => setBranch(e.target.value)} required>
              <option value="">Choose a branch…</option>
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {status.state === "error" && (
        <div role="alert" style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "color-mix(in oklab, var(--danger) 12%, var(--paper))", border: "1px solid color-mix(in oklab, var(--danger) 30%, transparent)", color: "var(--danger)", fontSize: 14 }}>
          {status.message}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={status.state === "sending"} style={{ marginTop: 22, width: "100%", justifyContent: "center" }}>
        {status.state === "sending" ? "Registering…" : <>Register free &amp; reserve my branch <ArrowIcon /></>}
      </button>

      <p className="muted" style={{ marginTop: 14, fontSize: 12, lineHeight: 1.6, textAlign: "center" }}>
        Free &amp; non-binding. By registering you agree to be contacted by BIPE Admissions about 2026-27. Students under 18 should
        register with a parent/guardian. We don&rsquo;t share your details with third parties — see our{" "}
        <Link href="/privacy" style={{ color: "var(--brand)" }}>Privacy Policy</Link>.
      </p>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { BRANCH_OPTIONS } from "@/lib/validation";

/**
 * Site-wide exit-intent prospectus popup. Captures name + phone + course
 * interest, persists the lead via /api/submit?formType=enquiry, then
 * forwards the visitor to WhatsApp as a bonus. Even if WhatsApp fails or
 * is blocked, the lead lands in the admin Inbox.
 *
 * Trigger logic mirrors the pattern from BITE Varanasi:
 *   - Desktop: mouse leaves through the top of the viewport (exit-intent)
 *   - Mobile fallback: 40s dwell time
 *   - Suppressed for the rest of the session once shown
 */

// Admissions WhatsApp line — matches WhatsAppFAB, not the general
// DATA.contact line. This routes leads to the same handset that takes
// the FAB chats so operators see one queue.
const WA_PHONE = "919415202879";
const SESSION_KEY = "bipe-inquiry-shown";

export function InquiryModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // ─── Trigger: exit-intent OR 40s fallback, once per session ────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // Safari private mode etc — fall through, the popup just shows once.
    }

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    const fallback = window.setTimeout(trigger, 40000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.clearTimeout(fallback);
    };
  }, []);

  // ─── Close on Escape ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    if (cleanName.length < 2 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg("Please enter your name and a valid 10-digit mobile number.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "enquiry",
          name: cleanName,
          phone: cleanPhone,
          branch: branch || "",
          source: "inquiry-modal",
          message: `Prospectus request via popup. Branch interest: ${branch || "not specified"}.`,
          consent: true,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Could not send your enquiry.");
      }
    } catch (err) {
      // Persisting failed — log and continue to WhatsApp anyway so the
      // visitor still gets help. The toast keeps it non-blocking.
      console.warn("[InquiryModal] persist failed", err);
    }

    setStatus("success");

    window.setTimeout(() => {
      const text = branch
        ? `Hi, I'm ${cleanName}. I'm interested in ${branch} at BIPE Varanasi. Please share prospectus & admission details. (Phone: ${cleanPhone})`
        : `Hi, I'm ${cleanName}. Please share BIPE Varanasi prospectus & admission details. (Phone: ${cleanPhone})`;
      const url = `https://api.whatsapp.com/send/?phone=${WA_PHONE}&text=${encodeURIComponent(
        text,
      )}&type=phone_number&app_absent=0`;
      window.open(url, "_blank", "noopener,noreferrer");
      setOpen(false);
    }, 1100);
  }

  if (!open) return null;

  return (
    <div
      className="inq-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inq-title"
        className="inq-card"
      >
        <button
          type="button"
          aria-label="Close enquiry popup"
          onClick={() => setOpen(false)}
          className="inq-close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="inq-head">
          <div className="inq-eyebrow">Admissions Open · 2026-27</div>
          <h2 id="inq-title" className="inq-title">
            Get the BIPE prospectus on WhatsApp
          </h2>
          <p className="inq-sub">
            Fees, branches, JEECUP cut-offs &amp; campus details — instantly.
          </p>
        </div>

        {status === "success" ? (
          <div className="inq-success">
            <div className="inq-success-badge" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Thank you, {name.trim().split(" ")[0]}!</h3>
            <p>Opening WhatsApp now so our team can share the prospectus…</p>
          </div>
        ) : (
          <form className="inq-form" onSubmit={handleSubmit}>
            <label className="inq-field">
              <span>Your name *</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                autoComplete="name"
                maxLength={100}
              />
            </label>

            <label className="inq-field">
              <span>Mobile number *</span>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit number"
                required
                pattern="[6-9][0-9]{9}"
                autoComplete="tel"
              />
            </label>

            <label className="inq-field">
              <span>Branch of interest</span>
              <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option value="">Select a branch (optional)</option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            {status === "error" && errorMsg && (
              <div className="inq-error" role="alert">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="inq-submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                <>
                  <span className="inq-spinner" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  Get prospectus on WhatsApp
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.45 0 .09 5.36.09 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.22-1.63a11.94 11.94 0 0 0 5.82 1.49h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.48-8.43Zm-8.47 18.38h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.24-.37a9.9 9.9 0 0 1-1.52-5.31c0-5.48 4.46-9.94 9.94-9.94 2.66 0 5.15 1.03 7.03 2.91a9.87 9.87 0 0 1 2.92 7.03c0 5.48-4.46 9.94-9.94 9.94Z" />
                  </svg>
                </>
              )}
            </button>

            <div className="inq-direct">
              Or call admissions:{" "}
              <a href="tel:+919415202879">+91 94152 02879</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

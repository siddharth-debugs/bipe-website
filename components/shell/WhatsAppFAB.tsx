"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  WhatsAppForm,
  type WhatsAppFormRenderProps,
} from "@/components/forms/WhatsAppForm";

/**
 * Floating WhatsApp action bubble — the persistent "BIPE Sampark"
 * chat affordance docked in the lower-right corner. Opens a mini
 * chat-style panel where the visitor drops a name + course interest
 * and is then handed off to a real WhatsApp chat with admissions.
 *
 * 28 May 2026 — submission logic factored out to the shared
 * <WhatsAppForm /> component + lib/whatsappHandoff utility module
 * per user direction "there should be only 2-3 format for form like
 * one for enquiry one for apply and one whatsapp format". This
 * surface keeps its floating-panel visual chrome (.wa-* CSS
 * classes); the WhatsApp-handoff orchestration lives in the shared
 * module.
 *
 * Persistence: FAB does NOT persist to /api/submit and does NOT ask
 * for a phone number — owner direction 17 Jul 2026, modeled on the
 * sibling institute's "BITE Sampark" bubble (bitevns.ac.in): name +
 * course only, course selection mandatory, visible inline errors,
 * then straight into the wa.me chat. (A brief same-day experiment
 * with phone + Double Tick persistence was reverted — the visitor's
 * own WhatsApp message IS the contact channel here; the InquiryModal
 * remains the persisted call-back surface.)
 */
export function WhatsAppFAB() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape and on outside click while the panel is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        aria-label={open ? "Close WhatsApp chat" : "Chat with BIPE on WhatsApp"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="wa-fab"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.45 0 .09 5.36.09 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.22-1.63a11.94 11.94 0 0 0 5.82 1.49h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.48-8.43ZM12.05 21.86h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.24-.37a9.9 9.9 0 0 1-1.52-5.31c0-5.48 4.46-9.94 9.94-9.94 2.66 0 5.15 1.03 7.03 2.91a9.87 9.87 0 0 1 2.92 7.03c0 5.48-4.46 9.94-9.94 9.94Zm5.45-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.19 5.07 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="wa-panel" role="dialog" aria-label="WhatsApp enquiry" ref={panelRef}>
          <div className="wa-panel-head">
            <div className="wa-avatar" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div>
              <div className="wa-panel-title">BIPE Sampark</div>
              <div className="wa-panel-sub">Admission Enquiry &amp; Assistance</div>
            </div>
          </div>

          <div className="wa-panel-body">
            <div className="wa-bubble">
              Namaste! Welcome to BIPE Varanasi. How can we help you today?
              <div className="wa-bubble-meta">BIPE Sampark</div>
            </div>
          </div>

          <WhatsAppForm
            source="whatsapp-fab"
            requireBranch
            gtagEvent="enquiry_submit"
            onSuccess={() => setOpen(false)}
            renderFields={({
              name,
              branch,
              setName,
              setBranch,
              status,
              errorMsg,
              branchOptions,
            }: WhatsAppFormRenderProps) => (
              <div className="wa-panel-form">
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Your name"
                />
                <select
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  aria-label="Course interest"
                >
                  <option value="" disabled>Select course interest…</option>
                  {branchOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {status === "error" && errorMsg && (
                  <div role="alert" style={{ color: "var(--danger)", fontSize: 12.5, lineHeight: 1.5 }}>
                    {errorMsg}
                  </div>
                )}
                <button type="submit" className="wa-submit" disabled={status === "sending"}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Chat on WhatsApp
                </button>
                <div className="wa-direct">
                  Or call directly: <a href="tel:+919415202879">+91 94152 02879</a>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </>
  );
}

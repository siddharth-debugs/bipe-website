"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FormSelect } from "@/components/ui/FormSelect";
import {
  WhatsAppForm,
  type WhatsAppFormRenderProps,
} from "@/components/forms/WhatsAppForm";

/**
 * Site-wide prospectus popup. Captures name + phone + branch interest,
 * persists the lead via /api/submit?formType=enquiry, then forwards
 * the visitor to WhatsApp as a bonus. Even if WhatsApp is blocked the
 * lead lands in the admin Inbox.
 *
 * Trigger: engagement-based — fires when the visitor scrolls past ~50% or
 * shows desktop exit-intent (35s fallback), NOT on a blind short timer.
 * Tuned down 8 Jun 2026 after Clarity showed the old full-screen 3s popup
 * interrupting blog readers before they'd read anything. Also gated:
 *   - NEVER on /blog/* — those are the Google-organic landing pages where
 *     a content-covering popup risks the mobile intrusive-interstitial
 *     ranking penalty. The in-content CTA + the WhatsApp FAB carry the ask
 *     there instead.
 *   - frequency-capped via localStorage — at most once per 7 days, and
 *     not for 90 days after the visitor has already submitted a lead.
 * Renders as a dismissible bottom-sheet on mobile (.inq-sheet), not a
 * full-screen takeover. `dismissedRef` also keeps it shut for the rest of
 * the current view once closed.
 *
 * 28 May 2026 — submission logic factored out to the shared
 * <WhatsAppForm /> component + lib/whatsappHandoff utility module
 * per user direction "there should be only 2-3 format for form like
 * one for enquiry one for apply and one whatsapp format". This
 * surface keeps its modal-card visual chrome (.inq-* CSS classes),
 * but the persist + analytics + WhatsApp-handoff orchestration now
 * lives in the shared module.
 */
export function InquiryModal() {
  const [open, setOpen] = useState(false);
  const [successName, setSuccessName] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  // Keeps the popup closed for the rest of this navigation once the
  // visitor has dismissed or submitted it — the 3s timer would
  // otherwise re-fire on rerenders that remount the component.
  const dismissedRef = useRef(false);
  const pathname = usePathname();

  // ─── Trigger: engagement (#3), gated by route (#1) + freq cap (#2) ──────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (dismissedRef.current) return;
    // #1 — never on blog posts: a content-covering interstitial on the
    // Google-organic landing pages risks the mobile ranking penalty.
    if (pathname?.startsWith("/blog")) return;
    // #2 — frequency cap: at most once / 7 days; 90 days after a lead.
    const DAY = 86_400_000;
    const now = Date.now();
    try {
      const lead = Number(localStorage.getItem("bipe_inq_lead") || 0);
      const shown = Number(localStorage.getItem("bipe_inq_shown") || 0);
      if (lead && now - lead < 90 * DAY) return;
      if (shown && now - shown < 7 * DAY) return;
    } catch {
      /* storage blocked (private mode) — fall through and show once */
    }
    // #3 — show on ENGAGEMENT, not a blind short timer: when the visitor
    // scrolls past ~50% (genuine interest) or shows desktop exit-intent. A
    // long 35s fallback still reaches readers who don't scroll (short
    // pages) without the old 3s interruption.
    let done = false;
    let timer = 0;
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onExitIntent);
    };
    const fire = () => {
      if (done || dismissedRef.current) return;
      done = true;
      cleanup();
      setOpen(true);
      try {
        localStorage.setItem("bipe_inq_shown", String(Date.now()));
      } catch {
        /* ignore */
      }
    };
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) fire();
    }
    function onExitIntent(e: MouseEvent) {
      if (e.clientY <= 0 && !e.relatedTarget) fire();
    }
    timer = window.setTimeout(fire, 35000);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onExitIntent);
    return cleanup;
    // Re-evaluate on SPA navigation so route + cap checks apply per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function close() {
    dismissedRef.current = true;
    setOpen(false);
  }

  // ─── Close on Escape ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="inq-backdrop inq-sheet"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inq-title"
        className="inq-card inq-sheet-card"
      >
        <button
          type="button"
          aria-label="Close enquiry popup"
          onClick={close}
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
            Talk to BIPE Admissions on WhatsApp
          </h2>
          <p className="inq-sub">
            Fees, branches, JEECUP cut-offs &amp; campus details — straight from the admissions team.
          </p>
        </div>

        {successName ? (
          <div className="inq-success">
            <div className="inq-success-badge" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Thank you, {successName}!</h3>
            <p>Opening WhatsApp now — our admissions team will reply shortly.</p>
          </div>
        ) : (
          <WhatsAppForm
            source="inquiry-modal"
            persist
            requirePhone
            gtagEvent="enquiry_submit"
            onSuccess={({ name }) => {
              setSuccessName(name.split(" ")[0]);
              dismissedRef.current = true;
              // They're a lead now — suppress the popup for 90 days (#2).
              try {
                localStorage.setItem("bipe_inq_lead", String(Date.now()));
              } catch {
                /* ignore */
              }
              // Close the modal shortly after the WhatsApp window opens
              // (handled inside WhatsAppForm). 1100 ms gives the success
              // state a beat to read before fading out.
              window.setTimeout(() => setOpen(false), 1100);
            }}
            renderFields={({
              name,
              phone,
              branch,
              setName,
              setPhone,
              setBranch,
              status,
              errorMsg,
              branchOptions,
            }: WhatsAppFormRenderProps) => (
              <div className="inq-form">
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
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    required
                    pattern="[6-9][0-9]{9}"
                    autoComplete="tel"
                  />
                </label>

                <div className="inq-field">
                  <span>
                    <label htmlFor="inq-branch">Branch of interest</label>
                  </span>
                  <FormSelect
                    id="inq-branch"
                    // Radix Select can't take "" as a value, so use a sentinel
                    // for "no branch picked" and translate back to "" on save.
                    value={branch || "__none"}
                    onValueChange={(v) => setBranch(v === "__none" ? "" : v)}
                    placeholder="Select a branch (optional)"
                    options={[
                      { value: "__none", label: "Select a branch (optional)" },
                      ...branchOptions.map((b) => ({ value: b, label: b })),
                    ]}
                  />
                </div>

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
                      Chat with admissions
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
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FormSelect } from "@/components/ui/FormSelect";
import {
  WhatsAppForm,
  type WhatsAppFormRenderProps,
} from "@/components/forms/WhatsAppForm";

/**
 * Site-wide prospectus popup. Captures name + phone + branch interest
 * and persists the lead via /api/submit?formType=enquiry so it lands
 * in the admin Inbox. Submission-only — it does NOT redirect to
 * WhatsApp (per owner, Jun 2026); the floating WhatsApp FAB already
 * offers chat for visitors who prefer it.
 *
 * Trigger: engagement-based — fires when the visitor scrolls past ~50% or
 * shows desktop exit-intent (35s fallback), NOT on a blind short timer.
 * Tuned down 8 Jun 2026 after Clarity showed the old full-screen 3s popup
 * interrupting blog readers before they'd read anything. Also gated:
 *   - NEVER on /blog/* — those are the Google-organic landing pages where
 *     a content-covering popup risks the mobile intrusive-interstitial
 *     ranking penalty. The in-content CTA + the WhatsApp FAB carry the ask
 *     there instead.
 *   - frequency-capped — at most once per browsing SESSION (so it
 *     returns on the visitor's next visit, not only after 7 days), and
 *     not for 90 days after they've already submitted a lead.
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
    // #1 — never on blog posts (a content-covering interstitial on the
    // Google-organic landing pages risks the mobile ranking penalty), nor
    // on pages built around their own primary form — /apply and
    // /early-registration — where the generic enquiry popup just competes
    // with the form the visitor came to fill (found in preview, Jun 2026).
    const NO_POPUP = ["/blog", "/apply", "/early-registration"];
    if (pathname && NO_POPUP.some((p) => pathname.startsWith(p))) return;
    // #2 — frequency cap: at most once per BROWSING SESSION (so a
    // visitor who closes it without enquiring sees it again on their
    // next visit), and not for 90 days after they've left a real lead.
    const DAY = 86_400_000;
    const now = Date.now();
    try {
      const lead = Number(localStorage.getItem("bipe_inq_lead") || 0);
      if (lead && now - lead < 90 * DAY) return;
      // Session-scoped, not 7-day: clears when the tab/session ends.
      if (sessionStorage.getItem("bipe_inq_shown")) return;
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
        // Per-session flag — shows once per visit, returns next session.
        sessionStorage.setItem("bipe_inq_shown", "1");
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
          <div className="inq-eyebrow">Enquiries Open · 2027-28</div>
          <h2 id="inq-title" className="inq-title">
            Have an admissions question?
          </h2>
          <p className="inq-sub">
            Admission for 2026-27 is closed. Ask about session 2027-28 — fees, branches, JEECUP cut-offs &amp; campus details. Leave your number and our admissions team calls you back.
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
            <p>Our admissions team will call you back shortly.</p>
          </div>
        ) : (
          <WhatsAppForm
            source="inquiry-modal"
            persist
            requirePhone
            gtagEvent="enquiry_submit"
            // Submission-only: save the lead to the Inbox, DON'T open
            // WhatsApp (the floating FAB already offers chat). Owner, Jun 2026.
            openOnSuccess={false}
            onSuccess={({ name }) => {
              setSuccessName(name.split(" ")[0]);
              dismissedRef.current = true;
              // They're a lead now — suppress the popup for 90 days (#2).
              try {
                localStorage.setItem("bipe_inq_lead", String(Date.now()));
              } catch {
                /* ignore */
              }
              // Give the success state a beat to read, then close.
              window.setTimeout(() => setOpen(false), 1600);
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
                      Request a callback
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
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

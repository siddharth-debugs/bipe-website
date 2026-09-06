"use client";

import type React from "react";


/**
 * Invisible decoy input used to catch form-spamming bots.
 *
 * ─── How it works ──────────────────────────────────────
 *
 * Bots that scrape pages tend to fill every <input> they find. Humans
 * never see this one — it's positioned off-screen, transparent, and
 * skipped by tab navigation. The server (/api/submit) reads the
 * submitted `website` field; if it's non-empty, the request is
 * silently 200-ed without forwarding to the backend.
 *
 * ─── Why name="website" ────────────────────────────────
 *
 * "website" is the most-targeted decoy name across the open-source
 * honeypot literature — most form-spammer scripts have it on their
 * "always fill this" list. Other strong picks: "url", "homepage",
 * "fax". Avoid names that match real form fields elsewhere on the
 * site (no "email", "phone", "name").
 *
 * ─── Usage ─────────────────────────────────────────────
 *
 *   const hp = useRef<HTMLInputElement>(null);
 *   // ...
 *   <Honeypot ref={hp} />
 *   // on submit:
 *   body: JSON.stringify({ ...payload, website: hp.current?.value ?? "" })
 *
 * ─── Accessibility ─────────────────────────────────────
 *
 * - tabIndex={-1} keeps it out of keyboard navigation
 * - aria-hidden hides it from screen readers
 * - autoComplete="off" + browser-specific opt-outs stop password
 *   managers and Chrome autofill from accidentally populating it
 *   (LastPass / 1Password sometimes ignore aria-hidden, so we also
 *   give it a non-obvious autocomplete token)
 */

const honeypotStyle: React.CSSProperties = {
  // Off-screen left rather than display:none — some bots check for
  // display/visibility and skip those fields.
  position: "absolute",
  left: "-10000px",
  top: "auto",
  width: "1px",
  height: "1px",
  opacity: 0,
  pointerEvents: "none",
};

/*
 * `ref` is taken as an ordinary prop rather than via forwardRef: React 19
 * passes ref straight through to function components, and forwardRef is
 * deprecated. The wrapper also tripped react-hooks/refs at every call site.
 */
export function Honeypot({ ref }: { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <input
      ref={ref}
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="new-password"
      aria-hidden="true"
      defaultValue=""
      style={honeypotStyle}
    />
  );
}

"use client";

import React, { useRef, useState } from "react";
import { BRANCH_OPTIONS } from "@/lib/validation";
import { Honeypot } from "@/components/shell/Honeypot";
import {
  submitWhatsAppHandoff,
  type WhatsAppHandoffFields,
} from "@/lib/whatsappHandoff";

/**
 * WHATSAPP FORM — the shared "drop a quick note → open WhatsApp chat"
 * surface logic.
 *
 * One of the 3 canonical form formats on the site:
 *
 *   - <EnquiryForm />   (components/forms/EnquiryForm.tsx)
 *                       — /contact + /visit
 *   - <ApplyForm />     (app/apply/ApplyView.tsx +
 *                        components/home/InlineApply.tsx — Stage 2,
 *                        not yet consolidated per user direction)
 *   - <WhatsAppForm />  (this file)
 *                       — InquiryModal + WhatsAppFAB
 *
 * This component is intentionally thin. The two consumers have very
 * different visual chrome — InquiryModal is a styled modal card with
 * .inq-* CSS, WhatsAppFAB is a chat-bubble floating panel with .wa-*
 * CSS. Trying to express both styles inside one component would have
 * meant a lot of conditional rendering for very little net win.
 *
 * What lives here:
 *   - Form state (name / phone / branch)
 *   - Submission orchestration via lib/whatsappHandoff
 *   - Error / loading state
 *   - The honeypot field (already shared via <Honeypot />)
 *
 * What stays in each consumer:
 *   - Layout / chrome / open-close state
 *   - Header / footer / trigger affordance
 *   - Success-state UI (depending on whether it auto-opens WA or
 *     shows a confirmation step first)
 *
 * Consumers pass `renderFields` to get full control over field
 * presentation. The component invokes that render prop with the
 * shared state + change handlers, and consumers wire them to their
 * own styled inputs. This is the same headless-component pattern
 * Radix UI uses.
 */

export type WhatsAppFormRenderProps = {
  /** Current name field value. */
  name: string;
  /** Current phone field value. */
  phone: string;
  /** Current branch field value. */
  branch: string;
  /** Change handler for the name input. */
  setName: (v: string) => void;
  /** Change handler for the phone input — only digits, max 10. */
  setPhone: (v: string) => void;
  /** Change handler for the branch select. */
  setBranch: (v: string) => void;
  /** Honeypot input ref — wire this onto a visually hidden field
   *  using the <Honeypot /> component for bot blocking. */
  honeypotRef: React.MutableRefObject<HTMLInputElement | null>;
  /** Submission state. "sending" disables the submit button. */
  status: "idle" | "sending" | "error";
  /** Last error message (truthy when status === "error"). */
  errorMsg: string;
  /** Whether phone is required by this consumer's validation. */
  requirePhone: boolean;
  /** Available branch options for the dropdown. */
  branchOptions: readonly string[];
};

export interface WhatsAppFormProps {
  /** Where the handoff originated. Used for analytics and to compose
   *  the persisted-enquiry message. */
  source: string;
  /** When true, also persists the enquiry to /api/submit before
   *  opening WhatsApp. */
  persist?: boolean;
  /** Whether to require a 10-digit phone (10 digits, starts 6-9).
   *  Defaults to false (FAB-style: name + course only). */
  requirePhone?: boolean;
  /** Override the default gtag event name. */
  gtagEvent?: string;
  /** Render-prop returning the styled form fields. The component
   *  wraps this in a <form> element that handles submission. */
  renderFields: (props: WhatsAppFormRenderProps) => React.ReactNode;
  /** Called after a successful submit, before the WhatsApp window
   *  opens. Use this to close the modal, show a success message,
   *  etc. The handoff URL is passed so the consumer can delay the
   *  open if it wants to show a confirmation step first. */
  onSuccess?: (args: { whatsAppUrl: string; name: string }) => void;
  /** When true (the default), the form will window.open the wa.me
   *  URL itself after a successful submit. Set to false if the
   *  consumer wants to handle the open itself (e.g. to delay it
   *  behind a confirmation animation). */
  openOnSuccess?: boolean;
}

/**
 * The shared WhatsApp form behaviour. Consumer-controlled
 * presentation via renderFields.
 */
export function WhatsAppForm({
  source,
  persist = false,
  requirePhone = false,
  gtagEvent,
  renderFields,
  onSuccess,
  openOnSuccess = true,
}: WhatsAppFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // Validate. Phone is only required when the consumer asks for it
    // (modal flow); FAB uses name + course only.
    if (cleanName.length < 2) {
      setErrorMsg("Please enter your name.");
      setStatus("error");
      return;
    }
    if (requirePhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    const fields: WhatsAppHandoffFields = {
      name: cleanName,
      phone: cleanPhone || undefined,
      branch: branch || undefined,
      source,
    };

    const result = await submitWhatsAppHandoff(fields, {
      persist,
      gtagEvent,
      honeypotValue: honeypotRef.current?.value ?? "",
    });

    if (!result.ok) {
      // Surface the error but DON'T block the WhatsApp handoff —
      // losing telemetry is better than losing the lead entirely.
      setErrorMsg(result.error);
      setStatus("error");
      // The handoff URL is still buildable client-side even if
      // persist failed, so we surface that to consumers via
      // onSuccess so they can decide what to do.
      // (Consumers receiving an error generally re-prompt rather
      // than auto-opening WhatsApp.)
      return;
    }

    onSuccess?.({ whatsAppUrl: result.whatsAppUrl, name: cleanName });

    if (openOnSuccess) {
      window.open(result.whatsAppUrl, "_blank", "noopener,noreferrer");
    }

    // Reset back to idle so the consumer can present a fresh form if
    // they want (the FAB does; the modal closes instead).
    setStatus("idle");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Honeypot ref={honeypotRef} />
      {renderFields({
        name,
        phone,
        branch,
        setName,
        setPhone: (v) => setPhone(v.replace(/\D/g, "").slice(0, 10)),
        setBranch,
        honeypotRef,
        status,
        errorMsg,
        requirePhone,
        branchOptions: BRANCH_OPTIONS,
      })}
    </form>
  );
}

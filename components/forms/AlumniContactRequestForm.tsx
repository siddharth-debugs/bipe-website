"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Honeypot } from "@/components/shell/Honeypot";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { DATA } from "@/lib/data";
import { track } from "@/lib/analytics";
import {
  alumniContactRequestSchema,
  ALUMNI_REQUEST_PURPOSES,
  type AlumniContactRequestData,
} from "@/lib/validation";

/**
 * Alumni Contact Request — modal form on /alumni.
 *
 * Visitor wants to talk to a specific alumnus. The site captures
 * intent + their own contact details; the placement cell verifies
 * the request out-of-band (calls visitor, asks alumnus for consent)
 * before sharing any number.
 *
 * Privacy posture:
 *   - Alumni phone numbers are never bundled into the public site
 *     (the TPO XLSX stays operator-only under data/source/).
 *   - This modal sends ONLY the alumnus identifier (id + descriptive
 *     fields) to the backend, never any contact details.
 *   - The success message makes the verification step explicit so
 *     visitors don't expect the number on the screen.
 *
 * Visual chrome reuses the .inq-* classes already wired by
 * InquiryModal — same modal card, same close affordance, same
 * spacing — so this slots into the site without new CSS surfaces.
 */

export type AlumniTarget = {
  id: number;
  name: string;
  branch?: string;
  year?: string | number;
  company?: string;
};

interface Props {
  alumnus: AlumniTarget;
  onClose: () => void;
}

type SubmitState =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; firstName: string }
  | { state: "error"; message: string };

export function AlumniContactRequestModal({ alumnus, onClose }: Props) {
  const honeypotRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<SubmitState>({ state: "idle" });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AlumniContactRequestData>({
    resolver: zodResolver(alumniContactRequestSchema),
    defaultValues: {
      formType: "alumni-contact",
      name: "",
      phone: "",
      email: "",
      purpose: undefined as unknown as AlumniContactRequestData["purpose"],
      purposeNote: "",
      alumniId: alumnus.id,
      alumniName: alumnus.name,
      alumniBranch: alumnus.branch ?? "",
      alumniYear: alumnus.year ? String(alumnus.year) : "",
      alumniCompany: alumnus.company ?? "",
      consent: false,
    },
    mode: "onTouched",
  });

  // Keep the hidden alumni fields matching the current target. This only
  // matters if the parent ever swaps `alumnus` without remounting; it costs
  // nothing if it does not.
  useEffect(() => {
    setValue("alumniId", alumnus.id);
    setValue("alumniName", alumnus.name);
    setValue("alumniBranch", alumnus.branch ?? "");
    setValue("alumniYear", alumnus.year ? String(alumnus.year) : "");
    setValue("alumniCompany", alumnus.company ?? "");
  }, [alumnus, setValue]);

  // NO dismiss-reset here, deliberately. AlumniView renders this as
  // `{requestedAlumni && <AlumniContactRequestModal …/>}`, so closing unmounts
  // the component and React discards every piece of its state — the form
  // values, the submit status, all of it. A reset would be unreachable code.
  //
  // This is a real dependency on the parent, not an accident: if the modal is
  // ever changed to stay mounted while closed (for an exit animation, say),
  // one visitor's answers would carry into the next visitor's form, and a
  // reset has to come back with that change. e2e/alumni.spec.ts covers the
  // behaviour end to end, so that regression fails a check rather than
  // reaching anyone.

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // useWatch rather than useForm's watch(): watch() returns a subscription
  // function the React Compiler cannot memoize safely, so it bails out of
  // optimising this whole component (react-hooks/incompatible-library).
  // useWatch is react-hook-form's hook form of the same read and subscribes
  // through `control`, which the compiler handles.
  const purpose = useWatch({ control, name: "purpose" });

  const onSubmit: SubmitHandler<AlumniContactRequestData> = async (data) => {
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value ?? "",
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        id?: number;
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) {
          for (const [field, msgs] of Object.entries(json.fieldErrors)) {
            if (msgs && msgs.length > 0) {
              setError(field as keyof AlumniContactRequestData, {
                message: msgs[0],
              });
            }
          }
        }
        setStatus({
          state: "error",
          message:
            json.error ?? "Could not send the request. Please try again.",
        });
        return;
      }
      track("alumni_contact_request", {
        alumniId: data.alumniId,
        purpose: data.purpose,
      });
      setStatus({
        state: "success",
        firstName: data.name.trim().split(/\s+/)[0] || "there",
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network error. Try again or WhatsApp the office.",
      });
    }
  };

  const fieldError = (k: keyof AlumniContactRequestData): string | undefined => {
    const e = errors[k as keyof typeof errors];
    return e?.message ? String(e.message) : undefined;
  };

  // Subtitle string — branch · year · company, falling back gracefully.
  const subtitleParts = [
    alumnus.branch,
    alumnus.year ? String(alumnus.year) : undefined,
    alumnus.company,
  ].filter((p): p is string => !!p && p.length > 0);

  return (
    <div
      className="inq-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alumni-req-title"
        className="inq-card"
      >
        <button
          type="button"
          aria-label="Close request form"
          onClick={onClose}
          className="inq-close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="inq-head">
          <div className="inq-eyebrow">Alumni introduction · request</div>
          <h2 id="alumni-req-title" className="inq-title">
            Talk to {alumnus.name.split(/\s+/)[0]}
          </h2>
          {subtitleParts.length > 0 && (
            <p className="inq-sub" style={{ marginTop: 4 }}>
              {subtitleParts.join(" · ")}
            </p>
          )}
          <p
            className="inq-sub"
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "var(--ink-3)",
              fontStyle: "italic",
            }}
          >
            Phone numbers are never shared automatically. The BIPE placement
            cell will call you to verify, then ask {alumnus.name.split(/\s+/)[0]}
            &apos;s permission before connecting you — usually within 48 hours.
          </p>
        </div>

        {status.state === "success" ? (
          <div className="inq-success">
            <div className="inq-success-badge" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Thanks, {status.firstName}!</h3>
            <p>
              Your request is in. The placement cell will reach you within 48
              hours to verify and connect you with {alumnus.name.split(/\s+/)[0]}.
            </p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={DATA.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon /> WhatsApp the office
              </a>
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Close
              </button>
            </div>
          </div>
        ) : (
          // False positive via react-hook-form. The rule sees a function that reads
          // a ref (onSubmit reads the honeypot's current value) being passed to
          // handleSubmit() during render, and cannot tell that handleSubmit RETURNS
          // a submit handler rather than calling it. onSubmit runs only on form
          // submission, never during render, so the stale-render hazard the rule
          // guards against cannot occur here. Surfaced once useWatch let the
          // compiler start optimising this component at all.
          // eslint-disable-next-line react-hooks/refs
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="inq-form">
            <Honeypot ref={honeypotRef} />

            {/* Hidden alumnus identifiers — react-hook-form holds these,
                the server re-validates that the visitor isn't tampering. */}
            <input type="hidden" {...register("alumniId", { valueAsNumber: true })} />
            <input type="hidden" {...register("alumniName")} />
            <input type="hidden" {...register("alumniBranch")} />
            <input type="hidden" {...register("alumniYear")} />
            <input type="hidden" {...register("alumniCompany")} />

            <label className="inq-field">
              <span>Your name *</span>
              <input
                type="text"
                placeholder="Full name"
                autoComplete="name"
                maxLength={100}
                {...register("name")}
                aria-invalid={!!fieldError("name") || undefined}
              />
              {fieldError("name") && (
                <span role="alert" className="error-msg">
                  {fieldError("name")}
                </span>
              )}
            </label>

            <label className="inq-field">
              <span>Your mobile *</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit number"
                autoComplete="tel"
                maxLength={10}
                {...register("phone", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  },
                })}
                aria-invalid={!!fieldError("phone") || undefined}
              />
              {fieldError("phone") && (
                <span role="alert" className="error-msg">
                  {fieldError("phone")}
                </span>
              )}
            </label>

            <label className="inq-field">
              <span>
                Email{" "}
                <span style={{ fontWeight: 400, opacity: 0.65, fontSize: 12 }}>
                  (optional)
                </span>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                aria-invalid={!!fieldError("email") || undefined}
              />
              {fieldError("email") && (
                <span role="alert" className="error-msg">
                  {fieldError("email")}
                </span>
              )}
            </label>

            <div className="inq-field">
              <span style={{ marginBottom: 8 }}>Why do you want to connect? *</span>
              <div
                role="radiogroup"
                aria-label="Reason for connecting"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {ALUMNI_REQUEST_PURPOSES.map((p) => {
                  const active = purpose === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setValue("purpose", p, { shouldValidate: true })}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: "1px solid",
                        borderColor: active ? "var(--brand)" : "var(--line)",
                        background: active ? "var(--brand)" : "var(--white)",
                        color: active ? "#fff" : "var(--ink)",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "background .15s, border-color .15s, color .15s",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              {fieldError("purpose") && (
                <span role="alert" className="error-msg" style={{ marginTop: 8 }}>
                  {fieldError("purpose")}
                </span>
              )}
            </div>

            {purpose && (
              <label className="inq-field">
                <span>
                  {purpose === "Other"
                    ? "One-line note *"
                    : "Add a one-liner so we can verify (optional)"}
                </span>
                <textarea
                  rows={2}
                  maxLength={500}
                  placeholder={
                    purpose === "Other"
                      ? "Tell us what this is about so we can verify."
                      : "Anything we should mention when we reach out?"
                  }
                  {...register("purposeNote")}
                  aria-invalid={!!fieldError("purposeNote") || undefined}
                />
                {fieldError("purposeNote") && (
                  <span role="alert" className="error-msg">
                    {fieldError("purposeNote")}
                  </span>
                )}
              </label>
            )}

            <label
              htmlFor="alumni-req-consent"
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginTop: 4,
                padding: "12px 14px",
                background: "color-mix(in oklab, var(--brand) 5%, var(--white))",
                border: fieldError("consent")
                  ? "1px solid var(--danger)"
                  : "1px solid var(--line)",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <input
                id="alumni-req-consent"
                type="checkbox"
                {...register("consent")}
                style={{ marginTop: 3, accentColor: "var(--brand)" }}
              />
              <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                I agree that BIPE may contact me on the mobile above to verify
                this request, and may share my name + reason with{" "}
                {alumnus.name.split(/\s+/)[0]} before introducing us.
              </span>
            </label>
            {fieldError("consent") && (
              <div role="alert" className="error-msg" style={{ marginTop: 6 }}>
                {fieldError("consent")}
              </div>
            )}

            {status.state === "error" && (
              <div
                role="alert"
                style={{
                  marginTop: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "color-mix(in oklab, var(--danger) 12%, var(--paper))",
                  border: "1px solid color-mix(in oklab, var(--danger) 30%, transparent)",
                  color: "var(--danger)",
                  fontSize: 13.5,
                }}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="inq-submit"
              disabled={isSubmitting || status.state === "submitting"}
            >
              {isSubmitting || status.state === "submitting" ? (
                <>
                  <span className="inq-spinner" aria-hidden="true" />
                  Sending request…
                </>
              ) : (
                <>
                  Send request <ArrowIcon size={16} />
                </>
              )}
            </button>

            <div className="inq-direct">
              Or call the placement cell:{" "}
              <a href="tel:+919415202879">+91 94152 02879</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";

/**
 * Light-weight admin UI primitives reused across Users / Roles / Content
 * pages so every tab feels native to the existing dashboard styling.
 */

// ─── Toast / banner ──────────────────────────────────────────────────

export function Banner({
  kind,
  children,
  onDismiss,
}: {
  kind: "error" | "ok" | "info";
  children: React.ReactNode;
  onDismiss?: () => void;
}) {
  const tone =
    kind === "error" ? "var(--danger, #c13b2b)" :
    kind === "ok" ? "var(--success, #2e7d52)" :
    "var(--brand)";
  return (
    <div
      className="admin-card"
      style={{
        padding: 12,
        marginBottom: 14,
        color: tone,
        borderColor: tone,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div>{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Empty + Loading ─────────────────────────────────────────────────

export function Loading() {
  return (
    <div className="admin-card" style={{ padding: 22, color: "var(--ink-3)" }}>
      Loading…
    </div>
  );
}

export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-card" style={{ padding: 28, textAlign: "center" }}>
      <h3 className="admin-h3">{title}</h3>
      {body && (
        <p style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 13.5 }}>{body}</p>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

// ─── Buttons ────────────────────────────────────────────────────────

export function PrimaryBtn({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className="admin-btn-primary-sm"
      disabled={disabled}
      onClick={onClick}
      style={{ padding: "10px 18px", fontSize: 13 }}
    >
      {children}
    </button>
  );
}

export function GhostBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="admin-btn-soft"
      disabled={disabled}
      onClick={onClick}
      style={{ padding: "9px 16px", fontSize: 13 }}
    >
      {children}
    </button>
  );
}

export function DangerBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="admin-btn-soft"
      disabled={disabled}
      onClick={onClick}
      style={{ padding: "9px 16px", fontSize: 13, color: "var(--danger, #c13b2b)" }}
    >
      {children}
    </button>
  );
}

// ─── Form bits ──────────────────────────────────────────────────────

export function Field({
  label,
  hint,
  full,
  children,
}: {
  label: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block", gridColumn: full ? "1 / -1" : undefined }}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && (
        <span
          style={{
            display: "block",
            marginTop: 4,
            fontSize: 11.5,
            color: "var(--ink-3)",
          }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 18,
      }}
    >
      {children}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="admin-card" style={{ padding: 22, marginBottom: 18 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <div>
          <h3 className="admin-h3">{title}</h3>
          {description && (
            <p style={{ marginTop: 6, color: "var(--ink-3)", fontSize: 13 }}>
              {description}
            </p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

// ─── Pill ───────────────────────────────────────────────────────────

export function Tag({
  tone = "default",
  children,
}: {
  tone?: "default" | "brand" | "accent" | "danger" | "success";
  children: React.ReactNode;
}) {
  const tones: Record<string, { bg: string; color: string; border: string }> = {
    default: { bg: "var(--paper-2)", color: "var(--ink-2)", border: "var(--line)" },
    brand:   { bg: "var(--brand-soft)", color: "var(--brand)", border: "var(--brand)" },
    accent:  { bg: "color-mix(in oklab, var(--accent) 14%, var(--white))", color: "var(--accent-deep, var(--accent))", border: "color-mix(in oklab, var(--accent) 30%, transparent)" },
    danger:  { bg: "color-mix(in oklab, var(--danger, #c13b2b) 10%, var(--white))", color: "var(--danger, #c13b2b)", border: "color-mix(in oklab, var(--danger, #c13b2b) 30%, transparent)" },
    success: { bg: "color-mix(in oklab, var(--success, #2e7d52) 12%, var(--white))", color: "var(--success, #2e7d52)", border: "color-mix(in oklab, var(--success, #2e7d52) 30%, transparent)" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        borderRadius: 999,
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// ─── Confirm modal ──────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "color-mix(in oklab, var(--ink) 60%, transparent)",
        backdropFilter: "blur(2px)",
        display: "grid",
        placeItems: "center",
        zIndex: 99,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="admin-card"
        style={{
          width: "100%",
          maxWidth: width,
          padding: 24,
          background: "var(--white)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            paddingBottom: 12,
            borderBottom: "1px solid var(--line)",
          }}
        >
          <h3 className="admin-h3">{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-3)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </header>
        {children}
        {footer && (
          <footer
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px solid var(--line)",
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

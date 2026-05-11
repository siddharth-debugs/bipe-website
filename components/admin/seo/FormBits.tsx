"use client";

import React from "react";

export function Banner({
  kind,
  children,
}: {
  kind: "error" | "ok";
  children: React.ReactNode;
}) {
  return (
    <div
      className="admin-card"
      style={{
        padding: 12,
        marginBottom: 14,
        color: kind === "error" ? "var(--danger)" : "var(--success)",
        borderColor: kind === "error" ? "var(--danger)" : "var(--success)",
      }}
    >
      {children}
    </div>
  );
}

export function Skeleton() {
  return (
    <div className="admin-card" style={{ padding: 22, color: "var(--ink-3)" }}>
      Loading…
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  textarea,
  full,
  children,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  full?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <label style={{ display: "block", gridColumn: full ? "1 / -1" : undefined }}>
      <span className="admin-label">{label}</span>
      {children ? (
        children
      ) : textarea ? (
        <textarea
          className="admin-textarea"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          rows={3}
          style={{ width: "100%" }}
        />
      ) : (
        <input
          className="admin-input"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          style={{ width: "100%" }}
        />
      )}
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

export function PrimaryButton({
  children,
  disabled,
  onClick,
  type,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type ?? "button"}
      className="admin-btn-primary-sm"
      disabled={disabled}
      onClick={onClick}
      style={{ padding: "10px 18px", fontSize: 13 }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
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
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-card" style={{ padding: 22, marginBottom: 18 }}>
      <header style={{ marginBottom: 16 }}>
        <h3 className="admin-h3">{title}</h3>
        {description && (
          <p style={{ marginTop: 6, color: "var(--ink-3)", fontSize: 13 }}>
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

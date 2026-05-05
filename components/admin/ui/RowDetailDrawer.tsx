"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/admin/utils";
import type { SubmissionStatus } from "@/lib/admin/api";
import { Pill } from "./Pill";
import { StatusDropdown, statusTone, statusLabel } from "./StatusDropdown";

export interface DetailField {
  label: string;
  value: React.ReactNode;
  /** Section grouping label (e.g. "Contact"). Untagged fields go into "Details". */
  section?: string;
  /** Visual kind. "note" → boxed quote block; "tech" → muted small text. */
  kind?: "default" | "note" | "tech";
  /** Wide rows take the full grid width — useful for long messages. */
  wide?: boolean;
  /** Render the value in monospace (good for IDs / phone). */
  mono?: boolean;
}

interface Props<T extends { id: number; status: SubmissionStatus; created_at: string; updated_at: string; phone?: string; email?: string }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: T | null;
  /** Eyebrow shown at the top of the drawer (e.g. "Apply submission"). */
  kind: string;
  /** Big title — usually the applicant name. */
  title: string;
  /** Field rows displayed in grouped sections. */
  fields: DetailField[];
  onStatusChange: (next: SubmissionStatus) => void;
}

/**
 * Slide-in drawer (Radix Dialog) showing the full row context plus
 * a status changer in the header.
 */
export function RowDetailDrawer<
  T extends { id: number; status: SubmissionStatus; created_at: string; updated_at: string; phone?: string; email?: string },
>({ open, onOpenChange, row, kind, title, fields, onStatusChange }: Props<T>) {
  const grouped = groupBySection(fields);
  const phone = row?.phone || pickField(fields, /phone|mobile/);
  const email = row?.email || pickField(fields, /email/);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="admin-drawer-overlay" />
        <Dialog.Content className="admin-drawer" aria-describedby={undefined}>
          {/* Header */}
          <div className="admin-drawer-head">
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="admin-eyebrow">§ {kind}</div>
              <Dialog.Title className="admin-h2" style={{ marginTop: 6 }}>
                {title}
              </Dialog.Title>
              {row && (
                <div className="admin-drawer-meta">
                  <Pill tone={statusTone(row.status)}>{statusLabel(row.status)}</Pill>
                  <span className="admin-meta">
                    <Clock size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />
                    {formatDate(row.created_at)}
                  </span>
                  <span className="admin-meta admin-meta-id">#{row.id}</span>
                </div>
              )}
            </div>

            <Dialog.Close asChild>
              <button type="button" className="admin-btn-icon" aria-label="Close">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {/* Status row */}
          {row && (
            <div className="admin-drawer-statusrow">
              <span className="admin-meta">Status</span>
              <StatusDropdown value={row.status} onChange={onStatusChange} />
              <span className="admin-meta admin-drawer-updated">
                Last updated · {formatDate(row.updated_at)}
              </span>
            </div>
          )}

          {/* Body */}
          <div className="admin-drawer-body">
            {grouped.map(({ section, items }) => (
              <Section key={section} title={section} items={items} />
            ))}
          </div>

          {/* Footer */}
          {row && (phone || email) && (
            <div className="admin-drawer-foot">
              {phone && (
                <a href={`tel:${phone}`} className="admin-btn-primary-sm">
                  <Phone size={14} />
                  Call
                </a>
              )}
              {phone && (
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-soft"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="admin-btn-soft">
                  <Mail size={14} />
                  Email
                </a>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// -------------------------------------------------------------------------
// Section — one labelled group inside the drawer body
// -------------------------------------------------------------------------

function Section({ title, items }: { title: string; items: DetailField[] }) {
  const isTech = items.every((f) => f.kind === "tech");
  return (
    <section className={"admin-drawer-section" + (isTech ? " is-tech" : "")}>
      <h3 className="admin-drawer-section-title">{title}</h3>
      <dl className="admin-drawer-grid">
        {items.map((f) => {
          if (f.kind === "note") {
            return (
              <div key={f.label} className="admin-drawer-note">
                <div className="admin-meta">{f.label}</div>
                <blockquote className="admin-drawer-quote">
                  {f.value || <span className="admin-drawer-empty">No note added.</span>}
                </blockquote>
              </div>
            );
          }
          const wide = f.wide || isTech;
          return (
            <div
              key={f.label}
              className={"admin-drawer-row" + (wide ? " is-wide" : "")}
            >
              <dt className="admin-drawer-label">{f.label}</dt>
              <dd
                className={
                  "admin-drawer-value" +
                  (f.mono ? " is-mono" : "") +
                  (f.kind === "tech" ? " is-tech" : "")
                }
              >
                {valueOrDash(f.value)}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

function valueOrDash(v: React.ReactNode): React.ReactNode {
  if (v === null || v === undefined) return <span className="admin-drawer-empty">—</span>;
  if (typeof v === "string" && v.trim() === "") return <span className="admin-drawer-empty">—</span>;
  return v;
}

function groupBySection(fields: DetailField[]): { section: string; items: DetailField[] }[] {
  const order: string[] = [];
  const buckets = new Map<string, DetailField[]>();
  for (const f of fields) {
    const key = f.section ?? "Details";
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(f);
  }
  return order.map((section) => ({ section, items: buckets.get(section)! }));
}

function pickField(fields: DetailField[], pattern: RegExp): string | undefined {
  for (const f of fields) {
    if (typeof f.value !== "string") continue;
    if (!f.value || f.value === "—") continue;
    if (pattern.test(f.label.toLowerCase())) return f.value;
  }
  return undefined;
}

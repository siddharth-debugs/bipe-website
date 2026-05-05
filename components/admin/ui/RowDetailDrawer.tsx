"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Phone, Mail, MapPin, Globe, Clock } from "lucide-react";
import { formatDate } from "@/lib/admin/utils";
import type { SubmissionStatus } from "@/lib/admin/api";
import { Pill } from "./Pill";
import { StatusDropdown, statusTone, statusLabel } from "./StatusDropdown";

export interface DetailField {
  label: string;
  value: React.ReactNode;
  /** When true, renders the value in monospace (good for IDs / phone). */
  mono?: boolean;
  /** Wide rows take the full grid width (used for long messages). */
  wide?: boolean;
}

interface Props<T extends { id: number; status: SubmissionStatus; created_at: string; updated_at: string }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The current row, or null when nothing is selected. */
  row: T | null;
  /** Eyebrow shown at the top of the drawer (e.g. "Apply submission"). */
  kind: string;
  /** Big title — usually the applicant name. */
  title: string;
  /** Field rows displayed in a definition grid. */
  fields: DetailField[];
  /** Status changer hook. */
  onStatusChange: (next: SubmissionStatus) => void;
}

/**
 * Slide-in drawer (Radix Dialog) showing the full row context plus
 * a status changer in the header. Used by the DataTable "View details"
 * action.
 */
export function RowDetailDrawer<
  T extends { id: number; status: SubmissionStatus; created_at: string; updated_at: string },
>({ open, onOpenChange, row, kind, title, fields, onStatusChange }: Props<T>) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="admin-drawer-overlay" />
        <Dialog.Content className="admin-drawer" aria-describedby={undefined}>
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--line)",
              background: "var(--white)",
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div className="admin-eyebrow">§ {kind}</div>
              <Dialog.Title className="admin-h2" style={{ marginTop: 6 }}>
                {title}
              </Dialog.Title>
              {row && (
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <Pill tone={statusTone(row.status)}>{statusLabel(row.status)}</Pill>
                  <span className="admin-meta">
                    <Clock size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} />
                    {formatDate(row.created_at)}
                  </span>
                </div>
              )}
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="admin-btn-icon"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {/* Status changer */}
          {row && (
            <div
              style={{
                padding: "14px 24px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "var(--paper-2)",
              }}
            >
              <span className="admin-meta">Status</span>
              <StatusDropdown value={row.status} onChange={onStatusChange} />
              <span style={{ marginLeft: "auto" }} className="admin-meta">
                Last updated · {formatDate(row.updated_at)}
              </span>
            </div>
          )}

          {/* Field grid */}
          <div style={{ padding: "20px 24px", overflow: "auto", flex: 1 }}>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 140px) minmax(0, 1fr)",
                rowGap: 14,
                columnGap: 18,
                margin: 0,
              }}
            >
              {fields.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "contents",
                  }}
                >
                  <dt
                    className="admin-meta"
                    style={{
                      paddingTop: 4,
                      gridColumn: f.wide ? "1 / -1" : "auto",
                      marginBottom: f.wide ? 6 : 0,
                    }}
                  >
                    {f.label}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      gridColumn: f.wide ? "1 / -1" : "auto",
                      color: "var(--ink)",
                      fontSize: 14,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                      ...(f.mono ? { fontFamily: "var(--font-mono)", fontSize: 13 } : {}),
                    }}
                  >
                    {f.value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Footer quick actions */}
          {row && (
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                background: "var(--white)",
              }}
            >
              {extractQuick(fields).phone && (
                <a
                  href={`tel:${extractQuick(fields).phone}`}
                  className="admin-btn-soft"
                >
                  <Phone size={14} />
                  Call
                </a>
              )}
              {extractQuick(fields).phone && (
                <a
                  href={`https://wa.me/${extractQuick(fields).phone!.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-soft"
                >
                  <Globe size={14} />
                  WhatsApp
                </a>
              )}
              {extractQuick(fields).email && (
                <a
                  href={`mailto:${extractQuick(fields).email}`}
                  className="admin-btn-soft"
                >
                  <Mail size={14} />
                  Email
                </a>
              )}
              {extractQuick(fields).address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(extractQuick(fields).address!)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-soft"
                >
                  <MapPin size={14} />
                  Map
                </a>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Pull phone/email/address out of the field array for the footer quick actions.
function extractQuick(fields: DetailField[]): {
  phone?: string;
  email?: string;
  address?: string;
} {
  const out: { phone?: string; email?: string; address?: string } = {};
  for (const f of fields) {
    const v = typeof f.value === "string" ? f.value : "";
    if (!v || v === "—") continue;
    const k = f.label.toLowerCase();
    if (!out.phone && /phone|mobile/.test(k)) out.phone = v;
    if (!out.email && /email/.test(k)) out.email = v;
    if (!out.address && /address|location/.test(k)) out.address = v;
  }
  return out;
}

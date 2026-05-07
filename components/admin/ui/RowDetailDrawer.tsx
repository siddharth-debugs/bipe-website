"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Phone, Mail, Clock, MessageCircle, Check, Loader2, Plus } from "lucide-react";
import { formatDate, appendRemark } from "@/lib/admin/utils";
import type { SubmissionStatus } from "@/lib/admin/api";
import { Pill } from "./Pill";
import { StatusDropdown, statusTone, statusLabel } from "./StatusDropdown";

/**
 * Common one-click remarks the admissions team logs frequently.
 * Clicking one appends a timestamped line to admin_notes and saves
 * immediately — no need to type the same phrase + date over and over.
 */
const QUICK_REMARKS: { label: string; line: string }[] = [
  { label: "Called — no answer", line: "Called — no answer" },
  { label: "Spoke to applicant", line: "Spoke to applicant" },
  { label: "Spoke to parent", line: "Spoke to parent" },
  { label: "Sent WhatsApp", line: "Sent WhatsApp follow-up" },
  { label: "Visit scheduled", line: "Campus visit scheduled" },
  { label: "Visit completed", line: "Campus visit completed" },
  { label: "Docs pending", line: "Documents pending from applicant" },
  { label: "Awaiting decision", line: "Awaiting applicant decision" },
];

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

interface Props<T extends { id: number; status: SubmissionStatus; created_at: string; updated_at: string; phone?: string; email?: string; admin_notes?: string }> {
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
  /** Persist admin remarks back to the row. */
  onSaveRemarks?: (remarks: string) => Promise<void>;
}

/**
 * Slide-in drawer (Radix Dialog) showing the full row context plus
 * a status changer in the header.
 */
export function RowDetailDrawer<
  T extends { id: number; status: SubmissionStatus; created_at: string; updated_at: string; phone?: string; email?: string; admin_notes?: string },
>({ open, onOpenChange, row, kind, title, fields, onStatusChange, onSaveRemarks }: Props<T>) {
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
              <div className="admin-eyebrow">{kind}</div>
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

            {row && onSaveRemarks && (
              <RemarksEditor
                rowId={row.id}
                value={row.admin_notes ?? ""}
                onSave={onSaveRemarks}
              />
            )}
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

// -------------------------------------------------------------------------
// RemarksEditor — admin-only internal note attached to the submission
// -------------------------------------------------------------------------

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

function RemarksEditor({
  rowId,
  value,
  onSave,
}: {
  rowId: number;
  value: string;
  onSave: (next: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  // Reset the draft whenever the user opens a different row.
  useEffect(() => {
    setDraft(value);
    setSave({ kind: "idle" });
  }, [rowId, value]);

  const dirty = draft !== value;

  async function handleSave() {
    setSave({ kind: "saving" });
    try {
      await onSave(draft);
      setSave({ kind: "saved" });
      setTimeout(
        () =>
          setSave((s) => (s.kind === "saved" ? { kind: "idle" } : s)),
        1800,
      );
    } catch (e) {
      setSave({
        kind: "error",
        message: e instanceof Error ? e.message : "Could not save.",
      });
    }
  }

  async function handleQuickRemark(line: string) {
    setSave({ kind: "saving" });
    const next = appendRemark(draft, line);
    setDraft(next);
    try {
      await onSave(next);
      setSave({ kind: "saved" });
      setTimeout(
        () =>
          setSave((s) => (s.kind === "saved" ? { kind: "idle" } : s)),
        1800,
      );
    } catch (e) {
      setSave({
        kind: "error",
        message: e instanceof Error ? e.message : "Could not save.",
      });
    }
  }

  return (
    <section className="admin-drawer-section">
      <h3 className="admin-drawer-section-title">Internal remarks</h3>
      <p className="admin-drawer-helper">
        Private notes for the admissions team. Not visible to the applicant.
      </p>

      <div className="admin-quick-remarks">
        <span className="admin-meta admin-quick-remarks-label">Quick log</span>
        {QUICK_REMARKS.map((q) => (
          <button
            key={q.label}
            type="button"
            className="admin-quick-remark"
            disabled={save.kind === "saving"}
            onClick={() => handleQuickRemark(q.line)}
            title={`Append "${q.line}" with the current time`}
          >
            <Plus size={11} />
            {q.label}
          </button>
        ))}
      </div>

      <textarea
        className="admin-textarea admin-drawer-remarks"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="e.g. Called on 5 May, parent will visit Wed; needs hostel info"
        rows={5}
        disabled={save.kind === "saving"}
      />
      <div className="admin-drawer-remarks-foot">
        <span className="admin-drawer-remarks-status">
          {save.kind === "saving" && (
            <>
              <Loader2 size={12} className="admin-spin" /> Saving…
            </>
          )}
          {save.kind === "saved" && (
            <>
              <Check size={12} /> Saved
            </>
          )}
          {save.kind === "error" && (
            <span style={{ color: "var(--danger)" }}>{save.message}</span>
          )}
          {save.kind === "idle" && dirty && "Unsaved changes"}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || save.kind === "saving"}
          className="admin-btn-primary-sm"
        >
          {save.kind === "saving" ? "Saving…" : "Save remarks"}
        </button>
      </div>
    </section>
  );
}

"use client";

/**
 * LeadDrawer — phone-deduped prospect view used by the admin inbox.
 *
 * Replaces the per-submission `RowDetailDrawer` for the Inbox flow.
 * Shows a hero header (gradient navy, avatar, contact chips, big
 * Call/WhatsApp/Email buttons) followed by the FollowUp timeline at
 * the top — that's the most-touched surface for the operator — and a
 * list of every submission this prospect ever made grouped by kind
 * underneath.
 */

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Clock,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  X,
  CalendarDays,
  Trash2,
} from "lucide-react";

import {
  api,
  type FollowUp,
  type LeadStatus,
} from "@/lib/admin/api";
import type { AnyRow, Kind, LeadGroup } from "@/lib/admin/leads";
import { formatDate } from "@/lib/admin/utils";
import { FollowUpSection } from "./FollowUpSection";

interface Props {
  group: LeadGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a follow-up changes the lead's derived status/interest. */
  onLeadUpdated?: (leadKey: string, followUps: FollowUp[]) => void;
  /** Called when an individual submission is deleted from the group. */
  onDeleteRow?: (row: AnyRow) => void | Promise<void>;
}

const STATUS_LABEL: Record<Exclude<LeadStatus, "">, string> = {
  new: "New",
  in_progress: "In progress",
  closed_win: "Closed win",
  closed_loss: "Closed loss",
  spam: "Spam",
};

const KIND_META: Record<Kind, { label: string; Icon: typeof GraduationCap }> = {
  apply: { label: "Apply", Icon: GraduationCap },
  contact: { label: "Contact", Icon: Mail },
  enquiry: { label: "Enquiry", Icon: MessageCircle },
  visit: { label: "Visit", Icon: CalendarDays },
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function primaryPhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function LeadDrawer({
  group,
  open,
  onOpenChange,
  onLeadUpdated,
  onDeleteRow,
}: Props) {
  const [derivedStatus, setDerivedStatus] = useState<LeadStatus>("new");
  const [derivedInterest, setDerivedInterest] = useState<string>("");

  useEffect(() => {
    if (group) {
      setDerivedStatus(group.status || "new");
      setDerivedInterest(group.interestCourse || "");
    }
  }, [group]);

  if (!group) return null;

  const phone = group.phones[0] ?? "";
  const email = group.emails[0] ?? "";
  const waPhone = phone ? primaryPhoneE164(phone) : "";

  function handleFollowUpsUpdated(followUps: FollowUp[]) {
    if (!group) return;
    const latest = followUps[0];
    const status = latest?.status || "new";
    setDerivedStatus(status);
    const firstInterest = followUps.find((f) => f.interestCourse)?.interestCourse ?? "";
    if (firstInterest) setDerivedInterest(firstInterest);
    onLeadUpdated?.(group.leadKey, followUps);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="admin-drawer-overlay" />
        <Dialog.Content
          className="admin-drawer"
          aria-describedby={undefined}
        >
          {/* Hero header */}
          <div className="lead-drawer-hero">
            <Dialog.Close asChild>
              <button
                type="button"
                className="lead-drawer-close"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </Dialog.Close>

            <div className="lead-drawer-hero-row">
              <div className="lead-drawer-avatar">{initials(group.name)}</div>
              <div className="lead-drawer-identity">
                <div className="lead-drawer-eyebrow">
                  Lead · {group.rows.length}{" "}
                  {group.rows.length === 1 ? "submission" : "submissions"}
                </div>
                <Dialog.Title className="lead-drawer-name">
                  {group.name}
                </Dialog.Title>
                <div className="lead-drawer-meta">
                  <span className={`lead-status-pill is-${derivedStatus}`}>
                    {STATUS_LABEL[derivedStatus as Exclude<LeadStatus, "">]}
                  </span>
                  {derivedInterest && (
                    <span className="lead-interest-chip">
                      <GraduationCap size={11} />
                      {derivedInterest}
                    </span>
                  )}
                  <span>
                    <Clock size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />
                    Latest {formatDate(group.latestAt)}
                  </span>
                </div>
              </div>
            </div>

            {(group.phones.length > 0 || group.emails.length > 0) && (
              <div className="lead-drawer-contacts">
                {group.phones.map((p) => (
                  <a key={p} href={`tel:${p}`} className="lead-contact-chip">
                    <Phone size={11} />
                    {p}
                  </a>
                ))}
                {group.emails.map((e) => (
                  <a key={e} href={`mailto:${e}`} className="lead-contact-chip">
                    <Mail size={11} />
                    {e}
                  </a>
                ))}
              </div>
            )}

            <div className="lead-drawer-actions">
              {phone && (
                <a href={`tel:${phone}`} className="lead-action-btn is-call">
                  <Phone size={14} />
                  Call
                </a>
              )}
              {waPhone && (
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lead-action-btn is-wa"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="lead-action-btn is-mail"
                >
                  <Mail size={14} />
                  Email
                </a>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="admin-drawer-body">
            <section className="admin-drawer-section">
              <FollowUpSection
                leadKey={group.leadKey}
                submitterName={group.name}
                onUpdated={handleFollowUpsUpdated}
              />
            </section>

            <section className="admin-drawer-section">
              <h3 className="admin-drawer-section-title">
                Submissions ({group.rows.length})
              </h3>
              <div className="lead-submissions-list">
                {group.rows.map((row) => (
                  <SubmissionCard
                    key={`${row.kind}:${row.id}`}
                    row={row}
                    onDelete={onDeleteRow}
                  />
                ))}
              </div>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── SubmissionCard ───────────────────────────────────────────────────

function SubmissionCard({
  row,
  onDelete,
}: {
  row: AnyRow;
  onDelete?: (row: AnyRow) => void | Promise<void>;
}) {
  const meta = KIND_META[row.kind];
  const Icon = meta.Icon;
  return (
    <div className="lead-submission-card">
      <div className="lead-submission-card-head">
        <span className={`lead-kind-chip is-${row.kind}`}>
          <Icon size={11} />
          {meta.label}
        </span>
        <div className="lead-submission-card-head-meta">
          {formatDate(row.created_at)} · #{row.id}
          {onDelete && (
            <button
              type="button"
              className="fup-delete"
              style={{ marginLeft: 6, verticalAlign: "-2px" }}
              onClick={() => onDelete(row)}
              title="Delete submission"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
      {renderKindGrid(row)}
      {renderMessage(row)}
    </div>
  );
}

function renderKindGrid(row: AnyRow): React.ReactNode {
  if (row.kind === "apply") {
    return (
      <dl className="lead-submission-card-grid">
        <div>
          <dt>Branch</dt>
          <dd>{row.branch || "—"}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{row.category || "—"}</dd>
        </div>
        <div>
          <dt>Board</dt>
          <dd>{row.board || "—"}</dd>
        </div>
        <div>
          <dt>Marks</dt>
          <dd>{row.marks ? `${row.marks}%` : "—"}</dd>
        </div>
        <div>
          <dt>Parent</dt>
          <dd>{row.parent || "—"}</dd>
        </div>
        <div>
          <dt>Visit</dt>
          <dd>
            {row.visit === "yes"
              ? `${row.visit_date || "?"} ${row.visit_time || ""}`.trim()
              : row.visit || "—"}
          </dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{row.source || "—"}</dd>
        </div>
      </dl>
    );
  }
  if (row.kind === "contact") {
    return (
      <dl className="lead-submission-card-grid">
        <div>
          <dt>Branch</dt>
          <dd>{row.branch || "—"}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{row.source || "—"}</dd>
        </div>
      </dl>
    );
  }
  if (row.kind === "enquiry") {
    return (
      <dl className="lead-submission-card-grid">
        <div>
          <dt>Branch</dt>
          <dd>{row.branch || "—"}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{row.source || "inquiry-modal"}</dd>
        </div>
      </dl>
    );
  }
  // visit
  return (
    <dl className="lead-submission-card-grid">
      <div>
        <dt>Branch interest</dt>
        <dd>{row.branch || "—"}</dd>
      </div>
      <div>
        <dt>Date</dt>
        <dd>{row.visit_date || "—"}</dd>
      </div>
      <div>
        <dt>Slot</dt>
        <dd>{row.visit_time || "—"}</dd>
      </div>
      <div>
        <dt>Party</dt>
        <dd>{row.party || "—"}</dd>
      </div>
      <div>
        <dt>Needs shuttle</dt>
        <dd>{row.needs_shuttle ? "Yes" : "No"}</dd>
      </div>
    </dl>
  );
}

function renderMessage(row: AnyRow): React.ReactNode {
  let msg = "";
  if (row.kind === "contact" || row.kind === "enquiry") msg = row.message ?? "";
  else if (row.kind === "apply" || row.kind === "visit") msg = row.notes ?? "";
  if (!msg.trim()) return null;
  return <div className="lead-submission-card-message">{msg}</div>;
}

"use client";

/**
 * FollowUpSection — timeline + inline form for logging operator contact
 * attempts against a phone-deduped lead group. Each entry persists via
 * /follow-ups/ on the backend; status auto-derives from outcome so
 * operators never set lead status manually.
 *
 * Lives at the top of the inbox detail drawer. Adapted from BITE's
 * design but built on BIPE's admin CSS tokens (no Tailwind here — the
 * admin styles in admin.css carry the visual language).
 */

import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  Check,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Save,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";

import {
  api,
  OUTCOME_TO_STATUS,
  type FollowUp,
  type FollowUpMedium,
  type FollowUpOutcome,
  type LeadStatus,
} from "@/lib/admin/api";
import { BRANCH_OPTIONS } from "@/lib/validation";

interface Props {
  leadKey: string;
  submitterName: string;
  onUpdated?: (followUps: FollowUp[]) => void;
}

const OUTCOME_PICKER_ORDER: Array<Exclude<FollowUpOutcome, "">> = [
  "left_message",
  "followup_needed",
  "no_answer",
  "busy",
  "switched_off",
  "not_reachable",
  "wrong_number",
  "interested",
  "converted",
  "not_interested",
  "spam",
  "other",
];

const OUTCOME_META: Record<
  Exclude<FollowUpOutcome, "">,
  { label: string; tone: "good" | "neutral" | "warn" | "bad" }
> = {
  interested: { label: "Interested", tone: "good" },
  converted: { label: "Converted / Enrolled", tone: "good" },
  left_message: { label: "Left message", tone: "neutral" },
  followup_needed: { label: "Follow-up needed", tone: "warn" },
  no_answer: { label: "No answer", tone: "warn" },
  busy: { label: "Busy", tone: "warn" },
  switched_off: { label: "Switched off", tone: "warn" },
  not_reachable: { label: "Not reachable", tone: "warn" },
  wrong_number: { label: "Wrong number", tone: "bad" },
  not_interested: { label: "Not interested", tone: "bad" },
  spam: { label: "Spam", tone: "bad" },
  other: { label: "Other", tone: "neutral" },
};

const MEDIUM_META: Record<
  FollowUpMedium,
  { label: string; icon: React.ReactNode }
> = {
  call: { label: "Call", icon: <Phone size={11} /> },
  whatsapp: { label: "WhatsApp", icon: <MessageCircle size={11} /> },
  sms: { label: "SMS", icon: <MessageSquare size={11} /> },
  email: { label: "Email", icon: <Mail size={11} /> },
  in_person: { label: "In Person", icon: <UserCheck size={11} /> },
  other: { label: "Other", icon: <MoreHorizontal size={11} /> },
};

const STATUS_META: Record<
  Exclude<LeadStatus, "" | "new">,
  { label: string }
> = {
  in_progress: { label: "In progress" },
  closed_win: { label: "Closed win" },
  closed_loss: { label: "Closed loss" },
  spam: { label: "Spam" },
};

export function FollowUpSection({ leadKey, submitterName, onUpdated }: Props) {
  const [items, setItems] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const notify = useCallback(
    (next: FollowUp[]) => {
      setItems(next);
      onUpdated?.(next);
    },
    [onUpdated],
  );

  const load = useCallback(async () => {
    if (!leadKey) return;
    setLoading(true);
    setErr(null);
    try {
      const data = await api<{ results: FollowUp[] } | FollowUp[]>(
        "/submissions/follow-ups/",
        { searchParams: { leadKey, page_size: 100, ordering: "-created_at" } },
      );
      const list = Array.isArray(data) ? data : data.results || [];
      notify(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load follow-ups.");
    } finally {
      setLoading(false);
    }
  }, [leadKey, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm("Delete this follow-up? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await api(`/submissions/follow-ups/${id}/`, { method: "DELETE" });
      notify(items.filter((p) => p.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleCreated(fu: FollowUp) {
    notify([fu, ...items]);
    setOpen(false);
  }

  return (
    <section className="fup-section">
      <header className="fup-head">
        <div className="fup-head-title">
          <span className="fup-head-icon" aria-hidden="true">
            <Clock size={14} />
          </span>
          <div>
            <h3>Follow-up history</h3>
            <p>
              {items.length === 0
                ? "Nothing logged yet"
                : `${items.length} ${items.length === 1 ? "entry" : "entries"}`}
            </p>
          </div>
        </div>
        {!open && (
          <button
            type="button"
            className="fup-add-btn"
            onClick={() => {
              setOpen(true);
              setErr(null);
            }}
          >
            <Plus size={13} /> Log follow-up
          </button>
        )}
      </header>

      {open && (
        <FollowUpForm
          leadKey={leadKey}
          submitterName={submitterName}
          onCancel={() => setOpen(false)}
          onSaved={handleCreated}
          onError={setErr}
        />
      )}

      {err && (
        <div className="fup-error" role="alert">
          {err}
        </div>
      )}

      {loading && !open && (
        <div className="fup-loading">
          <Loader2 size={13} className="fup-spin" /> Loading…
        </div>
      )}

      {!loading && items.length === 0 && !open && (
        <div className="fup-empty">
          <Clock size={20} className="fup-empty-icon" />
          <p>
            <strong>No follow-ups yet.</strong>
            <br />
            Log every call or WhatsApp here so the team has a paper trail.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <ol className="fup-timeline">
          <span className="fup-rail" aria-hidden="true" />
          {items.map((fu) => {
            const mm = MEDIUM_META[fu.medium] || MEDIUM_META.other;
            const om = fu.outcome ? OUTCOME_META[fu.outcome] : null;
            const sm = fu.status ? STATUS_META[fu.status] : null;
            return (
              <li key={fu.id} className="fup-item">
                <span
                  className={`fup-dot fup-dot-${fu.medium}`}
                  aria-hidden="true"
                />
                <div className="fup-card">
                  <div className="fup-card-head">
                    <div className="fup-chips">
                      <span className={`fup-chip fup-chip-medium-${fu.medium}`}>
                        {mm.icon}
                        {mm.label}
                      </span>
                      {om && (
                        <span className={`fup-chip fup-tone-${om.tone}`}>
                          {om.label}
                        </span>
                      )}
                      {sm && (
                        <span className="fup-chip fup-chip-status">
                          → {sm.label}
                        </span>
                      )}
                      {fu.interestCourse && (
                        <span className="fup-chip fup-chip-interest">
                          → {fu.interestCourse}
                        </span>
                      )}
                    </div>
                    <div className="fup-card-meta">
                      <span
                        className="fup-time"
                        title={fmtAbsolute(fu.createdAt)}
                      >
                        {fmtRelative(fu.createdAt)}
                      </span>
                      <button
                        type="button"
                        className="fup-delete"
                        onClick={() => remove(fu.id)}
                        disabled={deletingId === fu.id}
                        title="Delete"
                      >
                        {deletingId === fu.id ? (
                          <Loader2 size={11} className="fup-spin" />
                        ) : (
                          <Trash2 size={11} />
                        )}
                      </button>
                    </div>
                  </div>
                  {fu.remarks && <p className="fup-remarks">{fu.remarks}</p>}
                  <div className="fup-card-foot">
                    <span>
                      Logged by <strong>{fu.createdBy || "admin"}</strong>
                    </span>
                    {fu.nextActionAt && (
                      <span className="fup-reminder">
                        <CalendarClock size={10} /> Follow up by{" "}
                        {fmtAbsolute(fu.nextActionAt)}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

// ─── Inline form ───────────────────────────────────────────────────────

function FollowUpForm({
  leadKey,
  submitterName,
  onCancel,
  onSaved,
  onError,
}: {
  leadKey: string;
  submitterName: string;
  onCancel: () => void;
  onSaved: (fu: FollowUp) => void;
  onError: (msg: string | null) => void;
}) {
  const [medium, setMedium] = useState<FollowUpMedium>("call");
  const [outcome, setOutcome] = useState<FollowUpOutcome>("");
  const [interest, setInterest] = useState("");
  const [remarks, setRemarks] = useState("");
  const [nextAt, setNextAt] = useState<string>(""); // datetime-local string
  const [saving, setSaving] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (saving) return;
    if (!outcome) {
      onError("Pick an outcome — the lead status auto-derives from it.");
      return;
    }
    if (!remarks.trim()) {
      onError("Remarks are required — write a short note about this follow-up.");
      return;
    }
    onError(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        leadKey,
        medium,
        outcome,
        remarks: remarks.trim(),
      };
      if (interest) body.interestCourse = interest;
      if (nextAt) body.nextActionAt = new Date(nextAt).toISOString();
      const fu = await api<FollowUp>("/submissions/follow-ups/", {
        method: "POST",
        body,
      });
      onSaved(fu);
      setOutcome("");
      setInterest("");
      setRemarks("");
      setNextAt("");
    } catch (err) {
      onError(
        err instanceof Error ? `Save failed: ${err.message}` : "Save failed",
      );
    } finally {
      setSaving(false);
    }
  }

  const derived = outcome ? OUTCOME_TO_STATUS[outcome] : null;
  const derivedLabel = derived ? STATUS_META[derived].label : null;

  return (
    <form className="fup-form" onSubmit={submit}>
      <div className="fup-form-head">
        <div>
          <h4>New follow-up</h4>
          <p>Pick an outcome — status updates automatically.</p>
        </div>
        <button
          type="button"
          className="fup-form-close"
          onClick={onCancel}
          disabled={saving}
          aria-label="Cancel"
        >
          <X size={15} />
        </button>
      </div>

      <div className="fup-field">
        <label>Channel</label>
        <div className="fup-medium-row">
          {(Object.keys(MEDIUM_META) as FollowUpMedium[]).map((m) => {
            const meta = MEDIUM_META[m];
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMedium(m)}
                className={`fup-medium-btn${medium === m ? " is-active" : ""}`}
              >
                {meta.icon}
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fup-field">
        <label>
          Outcome <span className="fup-req">*</span>
        </label>
        <div className="fup-outcome-row">
          {OUTCOME_PICKER_ORDER.map((o) => {
            const om = OUTCOME_META[o];
            const active = outcome === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setOutcome(active ? "" : o)}
                className={`fup-chip fup-tone-${om.tone}${active ? " is-active" : ""}`}
              >
                {om.label}
                {active && <Check size={11} />}
              </button>
            );
          })}
        </div>
        {derivedLabel && (
          <div className="fup-derived">
            <span>Lead status will be set to</span>
            <span className="fup-derived-pill">{derivedLabel}</span>
          </div>
        )}
        {outcome === "followup_needed" && (
          <div className="fup-reminder-row">
            <label htmlFor="fup-next">
              <CalendarClock size={11} /> Remind me by
            </label>
            <input
              id="fup-next"
              type="datetime-local"
              value={nextAt}
              onChange={(e) => setNextAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>

      <div className="fup-field">
        <label htmlFor="fup-interest">
          Set branch interest <span className="fup-opt">(optional)</span>
        </label>
        <select
          id="fup-interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          <option value="">— no change —</option>
          {BRANCH_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="fup-field">
        <label htmlFor="fup-remarks">
          Remarks <span className="fup-req">*</span>
        </label>
        <textarea
          id="fup-remarks"
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder={
            submitterName
              ? `e.g. Spoke to ${submitterName}, discussed Civil eligibility, will send brochure on WhatsApp.`
              : "What did you discuss? What's the next step?"
          }
        />
      </div>

      <div className="fup-form-actions">
        <button
          type="button"
          className="admin-btn-soft"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="fup-save"
          disabled={saving || !outcome || !remarks.trim()}
        >
          {saving ? (
            <>
              <Loader2 size={13} className="fup-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={13} />
              Save follow-up
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────

function fmtRelative(iso: string): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

function fmtAbsolute(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

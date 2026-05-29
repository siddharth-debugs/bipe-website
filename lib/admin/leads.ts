/**
 * Lead grouping — collapse all of a prospect's submissions (Apply,
 * Contact, Enquiry, Visit) into a single inbox row keyed by normalised
 * 10-digit phone. One person who applied AND enquired AND booked a
 * visit shows as one row; the drawer reveals every submission they
 * made.
 *
 * Email is NOT used as a secondary key — too many prospects share a
 * single household email ("info@bipe.ac.in" pattern). Phone
 * is the operator-facing identifier anyway, since that's what they
 * call / WhatsApp.
 *
 * Lead status: derived from the latest FollowUp for the group (via
 * /follow-ups/?leadKey=...). Absent any follow-up the group is "new"
 * — that's the implicit state, never stored on the FollowUp.
 */

import type {
  ApplySubmission,
  ContactSubmission,
  EnquirySubmission,
  FollowUp,
  FollowUpMedium,
  FollowUpOutcome,
  LeadStatus,
  VisitSubmission,
} from "./api";

export type Kind = "apply" | "contact" | "enquiry" | "visit";

export type AnyRow =
  | (ApplySubmission & { kind: "apply" })
  | (ContactSubmission & { kind: "contact" })
  | (EnquirySubmission & { kind: "enquiry" })
  | (VisitSubmission & { kind: "visit" });

export interface LeadGroup {
  leadKey: string; // normalised 10-digit phone (or fallback "phone:<raw>" when no digits)
  name: string;
  phones: string[]; // distinct raw phones across submissions
  emails: string[]; // distinct non-empty emails across submissions
  branches: string[]; // distinct non-empty branches
  rows: AnyRow[]; // newest first
  kindCounts: Record<Kind, number>;
  latestAt: string; // ISO timestamp of newest submission in the group
  latestRow: AnyRow; // newest submission
  // From the most-recent FollowUp:
  status: LeadStatus; // "" / "new" if none recorded
  interestCourse: string; // operator-set course interest
  lastMedium: FollowUpMedium | null;
  lastOutcome: FollowUpOutcome | "";
  followUpCount: number;
}

const DIGITS = /\D+/g;

export function normalisePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const stripped = String(phone).replace(DIGITS, "");
  // Indian numbers may come prefixed (91, 0, +91). Keep the last 10 digits.
  if (stripped.length >= 10) return stripped.slice(-10);
  return stripped;
}

function pickName(rows: AnyRow[]): string {
  // Prefer the newest non-empty name. Operators sometimes leave the
  // popup empty but always fill the apply form, so newest-first is
  // usually the most reliable signal.
  for (const r of rows) {
    if (r.name && r.name.trim()) return r.name.trim();
  }
  return "Unknown";
}

function pushUnique(arr: string[], v: string | null | undefined): void {
  if (!v) return;
  const trimmed = v.trim();
  if (!trimmed) return;
  if (!arr.includes(trimmed)) arr.push(trimmed);
}

/**
 * Group a flat list of submissions into per-prospect lead groups.
 * Sort order: groups sorted by latestAt descending, rows inside each
 * group also newest first.
 */
export function buildLeadGroups(
  rows: AnyRow[],
  followUpsByLeadKey: Record<string, FollowUp[]> = {},
): LeadGroup[] {
  const map = new Map<string, AnyRow[]>();

  for (const row of rows) {
    const key = normalisePhone(row.phone);
    // Fallback key for submissions with no parseable phone — keep them
    // separate from each other (use the row id) so they don't collide.
    const realKey = key.length === 10 ? key : `unkeyed:${row.kind}:${row.id}`;
    const existing = map.get(realKey);
    if (existing) existing.push(row);
    else map.set(realKey, [row]);
  }

  const groups: LeadGroup[] = [];
  for (const [leadKey, groupRows] of map) {
    // newest first
    groupRows.sort((a, b) =>
      (b.created_at || "").localeCompare(a.created_at || ""),
    );

    const phones: string[] = [];
    const emails: string[] = [];
    const branches: string[] = [];
    const kindCounts: Record<Kind, number> = {
      apply: 0,
      contact: 0,
      enquiry: 0,
      visit: 0,
    };
    for (const r of groupRows) {
      pushUnique(phones, r.phone);
      pushUnique(emails, r.email);
      pushUnique(branches, r.branch);
      kindCounts[r.kind] += 1;
    }

    const followUps = followUpsByLeadKey[leadKey] ?? [];
    const latest = followUps[0]; // already newest-first from API
    const statusFromFu: LeadStatus = latest?.status || "";

    groups.push({
      leadKey,
      name: pickName(groupRows),
      phones,
      emails,
      branches,
      rows: groupRows,
      kindCounts,
      latestAt: groupRows[0]?.created_at ?? "",
      latestRow: groupRows[0],
      // Empty status === implicit "new"; the UI renders that as the new pill.
      status: statusFromFu || "new",
      interestCourse:
        followUps.find((f) => !!f.interestCourse)?.interestCourse ?? "",
      lastMedium: latest?.medium ?? null,
      lastOutcome: latest?.outcome ?? "",
      followUpCount: followUps.length,
    });
  }

  groups.sort((a, b) => b.latestAt.localeCompare(a.latestAt));
  return groups;
}

/** Cross-kind status bucket the inbox UI filters by. */
export type StatusBucket = "all" | "new" | "in_progress" | "closed_win" | "closed_loss" | "spam";

export function statusBucket(g: LeadGroup): Exclude<StatusBucket, "all"> {
  if (g.status === "in_progress") return "in_progress";
  if (g.status === "closed_win") return "closed_win";
  if (g.status === "closed_loss") return "closed_loss";
  if (g.status === "spam") return "spam";
  return "new";
}

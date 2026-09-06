/**
 * The one way to load the lead data, shared by the Inbox and the Overview.
 *
 * Both pages answer the same question — how many leads are there, and what
 * state are they in — so both must count from the same rows. They did not.
 * The Inbox walked every page of every endpoint; the Overview asked for
 * `page_size: 200` once and took whatever came back. The backend caps a list
 * response at about 25 rows regardless of what is requested, so the Overview
 * was counting leads from roughly a hundred submissions no matter how many
 * existed, and grouping them against 25 follow-ups no matter how many had
 * been logged.
 *
 * The visible result was a dashboard that under-reported total leads and
 * over-reported "new" ones — the same defect that was found and fixed in the
 * Inbox on 1 Jun 2026, still live one page across. Its own file header
 * claimed the two pages "never disagree". They did, and the more submissions
 * came in, the further apart they drifted.
 *
 * Keeping one copy here is the fix: there is no longer a second code path
 * that can fall behind this one.
 */

import {
  api,
  type ApplySubmission,
  type ContactSubmission,
  type EnquirySubmission,
  type FollowUp,
  type Paginated,
  type VisitSubmission,
} from "./api";
import { normalisePhone, type AnyRow } from "./leads";

/**
 * Fetch EVERY page of a paginated DRF list endpoint.
 *
 * The backend caps each list response at ~25 rows regardless of the
 * requested `page_size`, returning a `next` link for the remainder.
 * A single fetch therefore only sees the most-recent page. That
 * silently dropped follow-ups beyond the first 25 — so any lead whose
 * latest follow-up sat on page 2+ rendered as "New" even though its
 * status was saved (bug found 1 Jun 2026: 53 follow-ups, only 25
 * fetched). Walk `next` until the API runs out of pages.
 *
 * `page_size` is still sent at 500. The backend ignores it today, but it
 * costs nothing and the day the cap is raised this loop collapses to a
 * single request without a code change — which is the cheapest available
 * fix for how long this takes (Sep 2026 performance audit, finding F1).
 */
export async function fetchAllPages<T>(
  path: string,
  ordering = "-created_at",
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  // Hard stop so a misbehaving API can never loop forever.
  for (let guard = 0; guard < 100; guard++) {
    const res = await api<Paginated<T> | T[]>(path, {
      searchParams: { page, page_size: 500, ordering },
    });
    if (Array.isArray(res)) {
      all.push(...res);
      break;
    }
    all.push(...(res.results ?? []));
    if (!res.next) break;
    page += 1;
  }
  return all;
}

export interface InboxData {
  /** Every submission across the four forms, tagged with its kind. */
  merged: AnyRow[];
  /** Follow-ups grouped by normalised phone, newest first within each group. */
  byKey: Record<string, FollowUp[]>;
}

/**
 * Fetch every inbox endpoint and shape the result.
 *
 * Holds no state of its own, so a mount effect can call it directly without
 * dragging a caller's synchronous setLoading()/setErr() prologue into the
 * effect body — which is what react-hooks/set-state-in-effect flags.
 */
export async function fetchInbox(): Promise<InboxData> {
  // Every endpoint is fetched across ALL its pages — see fetchAllPages.
  const [a, c, e, v, fuList] = await Promise.all([
    fetchAllPages<ApplySubmission>("/submissions/apply/"),
    fetchAllPages<ContactSubmission>("/submissions/contact/"),
    fetchAllPages<EnquirySubmission>("/submissions/enquiry/"),
    fetchAllPages<VisitSubmission>("/submissions/visit/"),
    fetchAllPages<FollowUp>("/submissions/follow-ups/"),
  ]);
  const merged: AnyRow[] = [
    ...a.map((r) => ({ ...r, kind: "apply" as const })),
    ...c.map((r) => ({ ...r, kind: "contact" as const })),
    ...e.map((r) => ({ ...r, kind: "enquiry" as const })),
    ...v.map((r) => ({ ...r, kind: "visit" as const })),
  ];
  const byKey: Record<string, FollowUp[]> = {};
  for (const f of fuList) {
    const key = normalisePhone(f.leadKey);
    (byKey[key] ||= []).push(f);
  }
  // ensure newest-first inside each bucket
  for (const k of Object.keys(byKey)) {
    byKey[k].sort((x, y) => y.createdAt.localeCompare(x.createdAt));
  }
  return { merged, byKey };
}

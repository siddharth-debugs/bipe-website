"use client";

/**
 * Admin Inbox — phone-deduped lead view.
 *
 * One row per prospect (grouped by normalised 10-digit phone) instead
 * of one row per submission. Each row shows kind chips with per-kind
 * counts so a person who applied AND enquired AND booked a visit
 * appears once with three chips. Clicking opens the LeadDrawer which
 * surfaces the FollowUp timeline and every individual submission.
 *
 * Cross-kind status buckets (new / in progress / closed win / closed
 * loss / spam) come from the *latest* FollowUp recorded against the
 * lead's `lead_key`. Absent any follow-up the bucket is "new".
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  Inbox as InboxIcon,
  Mail,
  MessageCircle,
  RefreshCcw,
  Sparkles,
  Users,
} from "lucide-react";

import {
  api,
  type ApplySubmission,
  type ContactSubmission,
  type EnquirySubmission,
  type FollowUp,
  type Paginated,
  type VisitSubmission,
} from "@/lib/admin/api";
import {
  buildLeadGroups,
  normalisePhone,
  statusBucket,
  type AnyRow,
  type Kind,
  type LeadGroup,
  type StatusBucket,
} from "@/lib/admin/leads";
import { formatDate } from "@/lib/admin/utils";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { LeadDrawer } from "@/components/admin/inbox/LeadDrawer";

const KIND_META: Record<
  Kind,
  { label: string; Icon: typeof GraduationCap }
> = {
  apply: { label: "Apply", Icon: GraduationCap },
  contact: { label: "Contact", Icon: Mail },
  enquiry: { label: "Enquiry", Icon: MessageCircle },
  visit: { label: "Visit", Icon: CalendarDays },
};

// A lead counts as "Early Registration" if any of its enquiry submissions
// came from the /early-registration JEECUP campaign (source set by the
// Early Seat Registration form). Lets the Inbox badge + filter them out of
// the general enquiry stream.
const isEarlyReg = (g: LeadGroup): boolean =>
  g.rows.some((r) => r.kind === "enquiry" && r.source === "early-registration");

// An /alumni introduction request. Stored from 4 Sep 2026 on the "enquiry"
// kind with this source rather than a backend kind of its own. Unlike Early
// Reg these are NOT admissions leads — nobody should call them about a seat
// — so they are hidden from "All" and from the Enquiry chip and surface
// ONLY under their own chip. That is the 29 May direction ("don't show this
// as a new row in the backend dashboard") honoured while still keeping the
// record, which WhatsApp alone used to hold.
const isAlumniIntro = (g: LeadGroup): boolean =>
  g.rows.some((r) => r.kind === "enquiry" && r.source === "alumni-intro");

const STATUS_BUCKETS: { value: StatusBucket; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "closed_win", label: "Closed win" },
  { value: "closed_loss", label: "Closed loss" },
  { value: "spam", label: "Spam" },
];

const PAGE_SIZE = 25;

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
 */
async function fetchAllPages<T>(
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

export default function InboxPage() {
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [followUpsByKey, setFollowUpsByKey] = useState<
    Record<string, FollowUp[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Initial filters honour ?kind=… and ?bucket=… so the dashboard
  // overview cards / status pills can deep-link straight into a
  // pre-filtered view.
  const searchParams = useSearchParams();
  const initialKind = (() => {
    const k = searchParams.get("kind");
    return k === "apply" || k === "contact" || k === "enquiry" || k === "visit" ||
      k === "early" || k === "alumni"
      ? k
      : "all";
  })();
  const initialBucket = (() => {
    const b = searchParams.get("bucket");
    return b === "new" ||
      b === "in_progress" ||
      b === "closed_win" ||
      b === "closed_loss" ||
      b === "spam"
      ? (b as StatusBucket)
      : "all";
  })();
  const [kindFilter, setKindFilter] = useState<"all" | Kind | "early" | "alumni">(initialKind);
  const [bucket, setBucket] = useState<StatusBucket>(initialBucket);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [drawerKey, setDrawerKey] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // Every endpoint is fetched across ALL its pages — the backend
      // caps page size at ~25, so a single request would truncate the
      // follow-ups (53 of them) and the larger submission kinds.
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
      setRows(merged);
      setFollowUpsByKey(byKey);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not load the inbox.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups: LeadGroup[] = useMemo(
    () => buildLeadGroups(rows, followUpsByKey),
    [rows, followUpsByKey],
  );

  const bucketCounts = useMemo(() => {
    const out: Record<StatusBucket, number> = {
      all: groups.length,
      new: 0,
      in_progress: 0,
      closed_win: 0,
      closed_loss: 0,
      spam: 0,
    };
    for (const g of groups) out[statusBucket(g)]++;
    return out;
  }, [groups]);

  const kindCounts = useMemo(() => {
    const out: Record<Kind, number> = { apply: 0, contact: 0, enquiry: 0, visit: 0 };
    for (const g of groups) {
      for (const k of Object.keys(g.kindCounts) as Kind[]) {
        if (g.kindCounts[k] > 0) out[k]++;
      }
    }
    return out;
  }, [groups]);

  const earlyCount = useMemo(() => groups.filter(isEarlyReg).length, [groups]);
  const alumniCount = useMemo(() => groups.filter(isAlumniIntro).length, [groups]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups.filter((g) => {
      if (kindFilter === "alumni") {
        if (!isAlumniIntro(g)) return false;
      } else if (isAlumniIntro(g)) {
        // Never in the admissions stream — not even under "All".
        return false;
      } else if (kindFilter === "early") {
        if (!isEarlyReg(g)) return false;
      } else if (kindFilter !== "all" && g.kindCounts[kindFilter] === 0) return false;
      if (bucket !== "all" && statusBucket(g) !== bucket) return false;
      if (q) {
        const hay = [
          g.name,
          ...g.phones,
          ...g.emails,
          ...g.branches,
          ...g.rows.map((r) => {
            if (r.kind === "contact" || r.kind === "enquiry") return r.message ?? "";
            return r.notes ?? "";
          }),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [groups, kindFilter, bucket, search]);

  useEffect(() => {
    setPage(1);
  }, [kindFilter, bucket, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeGroup = useMemo(
    () => (drawerKey ? groups.find((g) => g.leadKey === drawerKey) ?? null : null),
    [drawerKey, groups],
  );

  // ─── Mutations ────────────────────────────────────────────────────────
  async function deleteRow(row: AnyRow) {
    if (!confirm("Delete this submission permanently? This can't be undone."))
      return;
    try {
      await api(`/submissions/${row.kind}/${row.id}/`, { method: "DELETE" });
      setRows((prev) =>
        prev.filter((x) => !(x.kind === row.kind && x.id === row.id)),
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete.");
    }
  }

  function handleLeadFollowUpsUpdated(leadKey: string, followUps: FollowUp[]) {
    setFollowUpsByKey((prev) => ({ ...prev, [leadKey]: followUps }));
  }

  // Dynamic import keeps the ~600kB exceljs bundle out of the
  // initial dashboard chunk; only ships when an operator actually
  // clicks Export.
  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    setErr(null);
    try {
      const { exportInboxToExcel } = await import("@/lib/admin/excel-export");
      await exportInboxToExcel({ rows, leadGroups: groups, followUpsByKey });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not generate the export.");
    } finally {
      setExporting(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        eyebrow="Submissions · Inbox"
        title="Inbox"
        accent="— one row per prospect."
        description="Apply, Contact, Enquiry and Visit submissions are grouped by phone so each prospect appears once. Click a row to open the full timeline + every submission they made."
        right={
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || loading || rows.length === 0}
            className="admin-btn-soft"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              fontWeight: 600,
              borderColor: "color-mix(in oklab, var(--brand) 35%, transparent)",
              background: "var(--brand)",
              color: "#fff",
            }}
            title="Download every lead + submission as a styled Excel workbook"
          >
            <Download size={14} />
            {exporting ? "Preparing…" : "Export to Excel"}
          </button>
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Kind chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <KindChip
            label="All"
            count={groups.length - alumniCount}
            Icon={InboxIcon}
            active={kindFilter === "all"}
            onClick={() => setKindFilter("all")}
          />
          {(Object.keys(KIND_META) as Kind[]).map((k) => {
            const meta = KIND_META[k];
            return (
              <KindChip
                key={k}
                label={meta.label}
                count={kindCounts[k]}
                Icon={meta.Icon}
                active={kindFilter === k}
                onClick={() => setKindFilter(k)}
              />
            );
          })}
          <KindChip
            label="Early Reg"
            count={earlyCount}
            Icon={Sparkles}
            active={kindFilter === "early"}
            onClick={() => setKindFilter("early")}
          />
          <KindChip
            label="Alumni Intro"
            count={alumniCount}
            Icon={Users}
            active={kindFilter === "alumni"}
            onClick={() => setKindFilter("alumni")}
          />
        </div>

        {/* Status bucket chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STATUS_BUCKETS.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBucket(b.value)}
              className="admin-btn-soft"
              style={{
                padding: "6px 12px",
                fontSize: 12,
                ...(bucket === b.value
                  ? {
                      borderColor: "color-mix(in oklab, var(--brand) 35%, transparent)",
                      background: "var(--brand-tint)",
                      color: "var(--brand)",
                    }
                  : {}),
              }}
            >
              {b.label}
              <span
                style={{
                  marginLeft: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: 999,
                  background:
                    bucket === b.value
                      ? "color-mix(in oklab, var(--brand) 18%, transparent)"
                      : "var(--paper-2)",
                  color:
                    bucket === b.value ? "var(--brand)" : "var(--ink-3)",
                }}
              >
                {bucketCounts[b.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search name, phone, email, message…"
          />

          <button
            type="button"
            onClick={load}
            className="admin-btn-soft"
            disabled={loading}
          >
            <RefreshCcw size={14} />
            Refresh
          </button>

          <span style={{ marginLeft: "auto" }} className="admin-meta">
            {loading
              ? "Loading…"
              : `${filtered.length} of ${groups.length} ${
                  groups.length === 1 ? "lead" : "leads"
                }`}
          </span>
        </div>

        {err && (
          <div
            className="admin-card"
            style={{ padding: 14, color: "var(--danger)", fontSize: 13 }}
          >
            {err}
          </div>
        )}

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 150 }}>Latest</th>
                <th>Submitter</th>
                <th style={{ width: 180 }}>Phone</th>
                <th>Submissions</th>
                <th style={{ width: 200 }}>Status / interest</th>
                <th style={{ width: 48 }} />
              </tr>
            </thead>
            <tbody>
              {loading && groups.length === 0 && <SkeletonRows />}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <EmptyState />
                  </td>
                </tr>
              )}
              {pageRows.map((g) => (
                <LeadRow
                  key={g.leadKey}
                  group={g}
                  onClick={() => setDrawerKey(g.leadKey)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 4,
            }}
          >
            <div className="admin-meta">
              Page {page} / {totalPages}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="admin-btn-soft"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                type="button"
                className="admin-btn-soft"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        <LeadDrawer
          group={activeGroup}
          open={drawerKey !== null}
          onOpenChange={(o) => !o && setDrawerKey(null)}
          onLeadUpdated={handleLeadFollowUpsUpdated}
          onDeleteRow={deleteRow}
        />
      </div>
    </>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────

function LeadRow({ group, onClick }: { group: LeadGroup; onClick: () => void }) {
  const bucket = statusBucket(group);
  const statusLabels: Record<typeof bucket, string> = {
    new: "New",
    in_progress: "In progress",
    closed_win: "Closed win",
    closed_loss: "Closed loss",
    spam: "Spam",
  };
  return (
    <tr onClick={onClick} style={{ cursor: "pointer" }}>
      <td
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ink-3)",
        }}
      >
        {formatDate(group.latestAt)}
      </td>
      <td>
        <div className="lead-row-name">{group.name}</div>
        {group.emails[0] && (
          <div className="lead-row-sub" style={{ fontFamily: "inherit" }}>
            {group.emails[0]}
            {group.emails.length > 1 && (
              <span style={{ marginLeft: 4, color: "var(--ink-3)" }}>
                +{group.emails.length - 1}
              </span>
            )}
          </div>
        )}
      </td>
      <td>
        <div className="lead-row-sub">{group.phones[0] || "—"}</div>
        {group.phones.length > 1 && (
          <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2 }}>
            +{group.phones.length - 1} more
          </div>
        )}
      </td>
      <td>
        <div className="lead-row-kinds">
          {(Object.keys(group.kindCounts) as Kind[])
            .filter((k) => group.kindCounts[k] > 0)
            .map((k) => {
              const meta = KIND_META[k];
              const Icon = meta.Icon;
              return (
                <span key={k} className={`lead-kind-chip is-${k}`}>
                  <Icon size={11} />
                  {meta.label}
                  <strong>×{group.kindCounts[k]}</strong>
                </span>
              );
            })}
        </div>
        {isEarlyReg(group) && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6,
            padding: "2px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 700,
            background: "color-mix(in oklab, var(--accent) 24%, transparent)",
            color: "var(--ink)", border: "1px solid color-mix(in oklab, var(--accent) 45%, transparent)",
          }}>
            <Sparkles size={11} /> Early Registration
          </span>
        )}
        {group.followUpCount > 0 && (
          <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 4 }}>
            {group.followUpCount} follow-up
            {group.followUpCount === 1 ? "" : "s"} logged
          </div>
        )}
      </td>
      <td>
        <span className={`lead-status-pill is-${bucket}`} style={{ color: "var(--ink)" }}>
          {statusLabels[bucket]}
        </span>
        {group.interestCourse && (
          <div
            style={{
              fontSize: 11,
              color: "var(--ink-2)",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            ↪ {group.interestCourse}
          </div>
        )}
      </td>
      <td style={{ textAlign: "right" }}>
        <ChevronRight size={16} style={{ color: "var(--ink-3)" }} />
      </td>
    </tr>
  );
}

function KindChip({
  label,
  count,
  Icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  Icon: typeof InboxIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="admin-btn-soft"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        ...(active
          ? {
              borderColor: "color-mix(in oklab, var(--brand) 35%, transparent)",
              background: "var(--brand-tint)",
              color: "var(--brand)",
            }
          : {}),
      }}
    >
      <Icon size={14} />
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          padding: "1px 6px",
          borderRadius: 999,
          background: active
            ? "color-mix(in oklab, var(--brand) 18%, transparent)"
            : "var(--paper-2)",
          color: active ? "var(--brand)" : "var(--ink-3)",
        }}
      >
        {count}
      </span>
    </button>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j}>
              <span
                className="admin-skel"
                style={{ height: 12, width: `${50 + ((j * 11) % 40)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

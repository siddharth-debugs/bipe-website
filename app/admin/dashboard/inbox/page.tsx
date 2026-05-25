"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  GraduationCap,
  Mail,
  CalendarDays,
  MessageCircle,
  Inbox as InboxIcon,
} from "lucide-react";

import {
  api,
  type ApplySubmission,
  type ContactSubmission,
  type EnquirySubmission,
  type VisitSubmission,
  type Paginated,
  type SubmissionStatus,
} from "@/lib/admin/api";
import { formatDate, appendRemark } from "@/lib/admin/utils";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Pill } from "@/components/admin/ui/Pill";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import {
  StatusDropdown,
  statusLabel,
  statusTone,
} from "@/components/admin/ui/StatusDropdown";
import { ActionMenu } from "@/components/admin/ui/ActionMenu";
import {
  RowDetailDrawer,
  type DetailField,
} from "@/components/admin/ui/RowDetailDrawer";

// ─── Types ────────────────────────────────────────────────────────────────

type Kind = "apply" | "contact" | "enquiry" | "visit";

type AnyRow =
  | (ApplySubmission & { kind: "apply" })
  | (ContactSubmission & { kind: "contact" })
  | (EnquirySubmission & { kind: "enquiry" })
  | (VisitSubmission & { kind: "visit" });

const KIND_META: Record<
  Kind,
  { label: string; Icon: typeof GraduationCap; tone: "brand" | "accent" | "warning" | "success" }
> = {
  apply: { label: "Apply", Icon: GraduationCap, tone: "brand" },
  contact: { label: "Contact", Icon: Mail, tone: "accent" },
  enquiry: { label: "Enquiry", Icon: MessageCircle, tone: "success" },
  visit: { label: "Visit", Icon: CalendarDays, tone: "warning" },
};

const STATUSES: SubmissionStatus[] = [
  "new",
  "contacted",
  "qualified",
  "enrolled",
  "rejected",
  "spam",
];

const BRANCHES = [
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering (Production)",
  "Computer Science & Engineering",
  "Dairy Engineering",
  "Not sure yet — guide me",
];

const PAGE_SIZE = 25;
const PER_KIND_FETCH = 200; // each backend page; client merges & paginates

// ─── Helpers ──────────────────────────────────────────────────────────────

function appendStatusAudit(existing: string, next: SubmissionStatus): string {
  return appendRemark(existing, `Status changed to ${statusLabel(next)}`);
}

function detailFor(row: AnyRow): DetailField[] {
  if (row.kind === "apply") {
    return [
      { section: "Contact", label: "Phone", value: row.phone, mono: true },
      { section: "Contact", label: "Email", value: row.email },
      { section: "Contact", label: "Parent / guardian", value: row.parent },

      { section: "Application", label: "Branch", value: row.branch },
      { section: "Application", label: "Category", value: row.category },
      { section: "Application", label: "Class 10 board", value: row.board },
      {
        section: "Application",
        label: "Marks",
        value: row.marks ? `${row.marks}%` : "",
        mono: true,
      },
      { section: "Application", label: "Heard about us via", value: row.source },

      { section: "Campus visit", label: "Wants visit", value: row.visit },
      { section: "Campus visit", label: "Preferred date", value: row.visit_date },
      { section: "Campus visit", label: "Preferred slot", value: row.visit_time },

      { section: "Notes", label: "Notes from applicant", value: row.notes, kind: "note" },
      { section: "Technical", label: "Source IP", value: row.source_ip, kind: "tech" },
      { section: "Technical", label: "User agent", value: row.user_agent, kind: "tech" },
    ];
  }
  if (row.kind === "contact") {
    return [
      { section: "Contact", label: "Phone", value: row.phone, mono: true },
      { section: "Contact", label: "Email", value: row.email },

      { section: "Enquiry", label: "Branch interest", value: row.branch },
      { section: "Enquiry", label: "Heard about us via", value: row.source },

      { section: "Message", label: "Message", value: row.message, kind: "note" },

      { section: "Technical", label: "Source IP", value: row.source_ip, kind: "tech" },
      { section: "Technical", label: "User agent", value: row.user_agent, kind: "tech" },
    ];
  }
  if (row.kind === "enquiry") {
    return [
      { section: "Contact", label: "Phone", value: row.phone, mono: true },
      { section: "Contact", label: "Email", value: row.email },

      { section: "Enquiry", label: "Branch interest", value: row.branch || "Not specified" },
      { section: "Enquiry", label: "Source", value: row.source || "inquiry-modal" },

      { section: "Message", label: "Message", value: row.message, kind: "note" },

      { section: "Technical", label: "Source IP", value: row.source_ip, kind: "tech" },
      { section: "Technical", label: "User agent", value: row.user_agent, kind: "tech" },
    ];
  }
  // visit
  return [
    { section: "Contact", label: "Phone", value: row.phone, mono: true },
    { section: "Contact", label: "Email", value: row.email },

    { section: "Visit", label: "Branch interest", value: row.branch },
    { section: "Visit", label: "Date", value: row.visit_date },
    { section: "Visit", label: "Slot", value: row.visit_time },
    { section: "Visit", label: "Party", value: row.party },
    {
      section: "Visit",
      label: "Needs shuttle",
      value: row.needs_shuttle ? "Yes" : "No",
    },

    { section: "Notes", label: "Notes from visitor", value: row.notes, kind: "note" },
    { section: "Technical", label: "Source IP", value: row.source_ip, kind: "tech" },
    { section: "Technical", label: "User agent", value: row.user_agent, kind: "tech" },
  ];
}

function detailSnippet(row: AnyRow): React.ReactNode {
  if (row.kind === "apply") {
    return (
      <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
        <div>
          {row.board || "—"}
          {row.marks ? (
            <span style={{ color: "var(--ink-3)", marginLeft: 6 }}>· {row.marks}%</span>
          ) : null}
        </div>
        {row.visit === "yes" && row.visit_date ? (
          <div style={{ marginTop: 2 }}>
            <Pill tone="accent" noDot>
              Visit · {row.visit_date}
            </Pill>
          </div>
        ) : null}
      </div>
    );
  }
  if (row.kind === "contact" || row.kind === "enquiry") {
    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--ink-2)",
          maxWidth: 360,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        title={row.message}
      >
        {row.message || "—"}
      </div>
    );
  }
  return (
    <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
      <div style={{ fontWeight: 600, color: "var(--ink)" }}>{row.visit_date || "—"}</div>
      <div style={{ color: "var(--ink-3)" }}>{row.visit_time || "—"}</div>
      {row.needs_shuttle && (
        <div style={{ marginTop: 2 }}>
          <Pill tone="accent" noDot>
            Shuttle
          </Pill>
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────

export default function InboxPage() {
  const searchParams = useSearchParams();
  const initialKind = (() => {
    const k = searchParams.get("kind");
    if (k === "apply" || k === "contact" || k === "enquiry" || k === "visit") return k;
    return "all" as const;
  })();

  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [kind, setKind] = useState<"all" | Kind>(initialKind);
  const [status, setStatus] = useState<"all" | SubmissionStatus>("all");
  const [branch, setBranch] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [drawerRow, setDrawerRow] = useState<AnyRow | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // Always pull all four kinds so we can flip filters instantly
      // without refetching. Submissions volume is small (a polytechnic).
      const [a, c, e, v] = await Promise.all([
        api<Paginated<ApplySubmission>>("/submissions/apply/", {
          searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
        }),
        api<Paginated<ContactSubmission>>("/submissions/contact/", {
          searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
        }),
        api<Paginated<EnquirySubmission>>("/submissions/enquiry/", {
          searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
        }),
        api<Paginated<VisitSubmission>>("/submissions/visit/", {
          searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
        }),
      ]);
      const merged: AnyRow[] = [
        ...a.results.map((r) => ({ ...r, kind: "apply" as const })),
        ...c.results.map((r) => ({ ...r, kind: "contact" as const })),
        ...e.results.map((r) => ({ ...r, kind: "enquiry" as const })),
        ...v.results.map((r) => ({ ...r, kind: "visit" as const })),
      ];
      merged.sort((x, y) => (y.created_at || "").localeCompare(x.created_at || ""));
      setRows(merged);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load the inbox.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived: per-kind counts (unfiltered, for chip badges) ─────────────
  const kindCounts = useMemo(() => {
    const out: Record<Kind, number> = { apply: 0, contact: 0, enquiry: 0, visit: 0 };
    for (const r of rows) out[r.kind]++;
    return out;
  }, [rows]);

  // ─── Client-side filter pipeline ────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (kind !== "all" && r.kind !== kind) return false;
      if (status !== "all" && r.status !== status) return false;
      if (branch && r.branch !== branch) return false;
      if (q) {
        const hay = [
          r.name,
          r.phone,
          r.email,
          r.branch,
          (r as ContactSubmission | EnquirySubmission).message ?? "",
          (r as ApplySubmission).parent ?? "",
          r.notes,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, kind, status, branch, search]);

  // Reset paging when filters change
  useEffect(() => {
    setPage(1);
  }, [kind, status, branch, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ─── Row mutations ──────────────────────────────────────────────────────
  async function changeStatus(row: AnyRow, next: SubmissionStatus) {
    if (row.status === next) return;
    const admin_notes = appendStatusAudit(row.admin_notes ?? "", next);
    try {
      const updated = await api<AnyRow>(`/submissions/${row.kind}/${row.id}/`, {
        method: "PATCH",
        body: { status: next, admin_notes },
      });
      const tagged = { ...updated, kind: row.kind } as AnyRow;
      setRows((prev) => prev.map((x) => (x.kind === row.kind && x.id === row.id ? tagged : x)));
      if (drawerRow && drawerRow.kind === row.kind && drawerRow.id === row.id) {
        setDrawerRow(tagged);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not update.");
    }
  }

  async function deleteRow(row: AnyRow) {
    if (!confirm("Delete this submission permanently? This can't be undone.")) return;
    try {
      await api(`/submissions/${row.kind}/${row.id}/`, { method: "DELETE" });
      setRows((prev) => prev.filter((x) => !(x.kind === row.kind && x.id === row.id)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete.");
    }
  }

  async function saveRemarks(row: AnyRow, admin_notes: string) {
    const updated = await api<AnyRow>(`/submissions/${row.kind}/${row.id}/`, {
      method: "PATCH",
      body: { admin_notes },
    });
    const tagged = { ...updated, kind: row.kind } as AnyRow;
    setRows((prev) => prev.map((x) => (x.kind === row.kind && x.id === row.id ? tagged : x)));
    if (drawerRow && drawerRow.kind === row.kind && drawerRow.id === row.id) {
      setDrawerRow(tagged);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        eyebrow="Submissions · Inbox"
        title="Inbox"
        accent="— all form submissions."
        description="Every Apply, Contact and Visit submission in one place. Filter by kind, status, branch or search by name, phone or email."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Kind chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <KindChip
            label="All"
            count={rows.length}
            Icon={InboxIcon}
            active={kind === "all"}
            onClick={() => setKind("all")}
          />
          {(Object.keys(KIND_META) as Kind[]).map((k) => {
            const meta = KIND_META[k];
            return (
              <KindChip
                key={k}
                label={meta.label}
                count={kindCounts[k]}
                Icon={meta.Icon}
                active={kind === k}
                onClick={() => setKind(k)}
              />
            );
          })}
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search name, phone, email…"
          />

          <SelectFilter
            label="Status"
            value={status}
            onChange={(v) => setStatus(v as "all" | SubmissionStatus)}
            options={[
              { value: "all", label: "All statuses" },
              ...STATUSES.map((s) => ({ value: s, label: statusLabel(s) })),
            ]}
          />

          <SelectFilter
            label="Branch"
            value={branch || "_all"}
            onChange={(v) => setBranch(v === "_all" ? "" : v)}
            options={[
              { value: "_all", label: "All branches" },
              ...BRANCHES.map((b) => ({ value: b, label: b })),
            ]}
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
              : `${filtered.length} of ${rows.length} ${rows.length === 1 ? "row" : "rows"}`}
          </span>
        </div>

        {err && (
          <div className="admin-card" style={{ padding: 14, color: "var(--danger)", fontSize: 13 }}>
            {err}
          </div>
        )}

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 150 }}>Submitted</th>
                <th style={{ width: 110 }}>Kind</th>
                <th>Name</th>
                <th style={{ width: 140 }}>Phone</th>
                <th style={{ width: 220 }}>Branch</th>
                <th>Detail</th>
                <th style={{ width: 160 }}>Status</th>
                <th style={{ width: 56 }} />
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 && <SkeletonRows />}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <EmptyState />
                  </td>
                </tr>
              )}
              {pageRows.map((row) => {
                const meta = KIND_META[row.kind];
                const Icon = meta.Icon;
                return (
                  <tr
                    key={`${row.kind}:${row.id}`}
                    onClick={() => setDrawerRow(row)}
                    style={{ cursor: "pointer" }}
                  >
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--ink-3)",
                      }}
                    >
                      {formatDate(row.created_at)}
                    </td>
                    <td>
                      <Pill tone={meta.tone}>
                        <Icon size={11} style={{ marginRight: 4 }} />
                        {meta.label}
                      </Pill>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--ink)" }}>{row.name}</div>
                      {row.email && (
                        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                          {row.email}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                        {row.phone}
                      </span>
                    </td>
                    <td>
                      <Pill>{row.branch || "—"}</Pill>
                    </td>
                    <td>{detailSnippet(row)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <StatusDropdown
                        value={row.status}
                        onChange={(s) => changeStatus(row, s)}
                      />
                    </td>
                    <td
                      style={{ textAlign: "right" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionMenu
                        phone={row.phone}
                        email={row.email}
                        onView={() => setDrawerRow(row)}
                        onMarkSpam={
                          row.status !== "spam"
                            ? () => changeStatus(row, "spam")
                            : undefined
                        }
                        onDelete={() => deleteRow(row)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

        {/* Drawer */}
        <RowDetailDrawer
          open={drawerRow !== null}
          onOpenChange={(o) => !o && setDrawerRow(null)}
          row={drawerRow}
          kind={drawerRow ? `${KIND_META[drawerRow.kind].label} submission` : ""}
          title={drawerRow?.name || ""}
          fields={drawerRow ? detailFor(drawerRow) : []}
          onStatusChange={(s) => {
            if (drawerRow) changeStatus(drawerRow, s);
          }}
          onSaveRemarks={async (admin_notes) => {
            if (drawerRow) await saveRemarks(drawerRow, admin_notes);
          }}
        />
      </div>
    </>
  );
}

// ─── Bits ─────────────────────────────────────────────────────────────────

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

function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label
      className="admin-btn-soft"
      style={{
        position: "relative",
        padding: 0,
        display: "inline-flex",
        alignItems: "stretch",
      }}
    >
      <span
        style={{
          padding: "8px 4px 8px 12px",
          color: "var(--ink-3)",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none",
          background: "transparent",
          padding: "8px 12px 8px 6px",
          font: "inherit",
          color: "var(--ink)",
          cursor: "pointer",
          appearance: "none",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 8 }).map((__, j) => (
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

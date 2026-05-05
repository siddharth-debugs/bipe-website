"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  api,
  type Paginated,
  type SubmissionStatus,
} from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/utils";

import { Pill } from "./ui/Pill";
import { SearchInput } from "./ui/SearchInput";
import { EmptyState } from "./ui/EmptyState";
import { StatusDropdown, statusLabel, statusTone } from "./ui/StatusDropdown";
import { ActionMenu } from "./ui/ActionMenu";
import { RowDetailDrawer, type DetailField } from "./ui/RowDetailDrawer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const STATUSES: SubmissionStatus[] = [
  "new",
  "contacted",
  "qualified",
  "enrolled",
  "rejected",
  "spam",
];

export interface ColumnDef<T> {
  /** React key — also used as the searchParam ordering key when sortable. */
  key: string;
  /** Header label (mono caps). */
  header: string;
  /** Renderer for the cell. */
  cell: (row: T) => React.ReactNode;
  /** Sortable on this column. Maps to DRF `?ordering=key`. */
  sortable?: boolean;
  /** Pixel width hint. */
  width?: number;
}

export interface FilterDef {
  /** DRF query param name (e.g. "branch"). */
  field: string;
  /** Human-facing label, used in the dropdown trigger. */
  label: string;
  options: string[];
}

interface BaseRow {
  id: number;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  email: string;
}

interface DataTableProps<T extends BaseRow> {
  /** Resource path under /api/v1/submissions/ — "apply" / "contact" / "visit". */
  resource: string;
  /** Human-facing kind label for the drawer eyebrow. */
  kindLabel: string;
  /** Column definitions. */
  columns: ColumnDef<T>[];
  /** Optional non-status filters (e.g. branch). */
  filters?: FilterDef[];
  /** Build the DetailField list for the row drawer from a row. */
  detailFields: (row: T) => DetailField[];
  /** Page size for the API. Defaults to 25 (matches DRF default). */
  pageSize?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataTable<T extends BaseRow>({
  resource,
  kindLabel,
  columns,
  filters = [],
  detailFields,
  pageSize = 25,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "all">("all");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState<string>("-created_at");

  const [data, setData] = useState<Paginated<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [drawerRow, setDrawerRow] = useState<T | null>(null);

  // ---- Load --------------------------------------------------------------
  const params = useMemo(() => {
    const p: Record<string, string | number | undefined> = {
      page,
      ordering,
    };
    if (search.trim()) p.search = search.trim();
    if (status !== "all") p.status = status;
    for (const [k, v] of Object.entries(extra)) {
      if (v) p[k] = v;
    }
    return p;
  }, [search, status, extra, page, ordering]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const d = await api<Paginated<T>>(`/submissions/${resource}/`, {
        searchParams: params,
      });
      setData(d);
      // If the current selection is no longer in view, clear it.
      const ids = new Set(d.results.map((r) => r.id));
      setSelected((prev) => new Set([...prev].filter((id) => ids.has(id))));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, resource]);

  // ---- Helpers -----------------------------------------------------------
  async function patchRow(id: number, patch: Partial<{ status: SubmissionStatus }>) {
    try {
      await api(`/submissions/${resource}/${id}/`, {
        method: "PATCH",
        body: patch,
      });
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not update row.");
    }
  }

  async function deleteRow(id: number) {
    if (!confirm("Delete this submission permanently? This can't be undone.")) return;
    try {
      await api(`/submissions/${resource}/${id}/`, { method: "DELETE" });
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete row.");
    }
  }

  async function bulkSetStatus(s: SubmissionStatus) {
    if (selected.size === 0) return;
    setLoading(true);
    try {
      await Promise.all(
        [...selected].map((id) =>
          api(`/submissions/${resource}/${id}/`, {
            method: "PATCH",
            body: { status: s },
          }),
        ),
      );
      setSelected(new Set());
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Bulk update failed.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSort(key: string) {
    setOrdering((prev) => {
      if (prev === key) return `-${key}`;
      if (prev === `-${key}`) return "-created_at";
      return key;
    });
  }
  function sortIcon(key: string) {
    if (ordering === key) return "↑";
    if (ordering === `-${key}`) return "↓";
    return null;
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.count / pageSize)) : 1;
  const allChecked = !!data && data.results.length > 0 && data.results.every((r) => selected.has(r.id));
  const someChecked = !!data && data.results.some((r) => selected.has(r.id));

  function toggleAll() {
    if (!data) return;
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(data.results.map((r) => r.id)));
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const drawerOpen = drawerRow !== null;

  // ---- Render ------------------------------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search name, phone, email…"
        />

        <FilterDropdown
          label="Status"
          value={status === "all" ? null : statusLabel(status)}
          options={[
            { value: "all", label: "All statuses" },
            ...STATUSES.map((s) => ({ value: s, label: statusLabel(s) })),
          ]}
          onSelect={(v) => {
            setStatus(v as SubmissionStatus | "all");
            setPage(1);
          }}
        />

        {filters.map((f) => (
          <FilterDropdown
            key={f.field}
            label={f.label}
            value={extra[f.field] || null}
            options={[
              { value: "", label: `All ${f.label.toLowerCase()}` },
              ...f.options.map((o) => ({ value: o, label: o })),
            ]}
            onSelect={(v) => {
              setExtra((x) => ({ ...x, [f.field]: v }));
              setPage(1);
            }}
          />
        ))}

        <button
          type="button"
          onClick={() => load()}
          className="admin-btn-soft"
          disabled={loading}
        >
          <RefreshCcw size={14} />
          Refresh
        </button>

        <span style={{ marginLeft: "auto" }} className="admin-meta">
          {data ? `${data.count} ${data.count === 1 ? "row" : "rows"}` : "—"}
        </span>
      </div>

      {/* Bulk-action strip — only when rows are selected */}
      {selected.size > 0 && (
        <div
          className="admin-card"
          style={{
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--brand-tint)",
            borderColor: "color-mix(in oklab, var(--brand) 22%, transparent)",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--brand)", fontSize: 13 }}>
            {selected.size} selected
          </span>
          <span style={{ color: "var(--ink-3)", fontSize: 12 }}>
            Bulk update status →
          </span>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => bulkSetStatus(s)}
              style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
              title={`Set ${selected.size} to ${statusLabel(s)}`}
            >
              <Pill tone={statusTone(s)}>{statusLabel(s)}</Pill>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="admin-btn-icon"
            style={{ marginLeft: "auto" }}
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  className="admin-check"
                  aria-label="Select all rows on this page"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = !allChecked && someChecked;
                  }}
                  onChange={toggleAll}
                />
              </th>
              <th
                style={{ width: 150, cursor: "pointer", userSelect: "none" }}
                onClick={() => toggleSort("created_at")}
              >
                <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                  Submitted
                  <ArrowUpDown size={11} opacity={0.4} />
                  {sortIcon("created_at") && <span>{sortIcon("created_at")}</span>}
                </span>
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    width: c.width,
                    cursor: c.sortable ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={() => c.sortable && toggleSort(c.key)}
                >
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                    {c.header}
                    {c.sortable && <ArrowUpDown size={11} opacity={0.4} />}
                    {c.sortable && sortIcon(c.key) && <span>{sortIcon(c.key)}</span>}
                  </span>
                </th>
              ))}
              <th style={{ width: 160 }}>Status</th>
              <th style={{ width: 56 }} />
            </tr>
          </thead>
          <tbody>
            {loading && !data && (
              <SkeletonRows columns={columns.length + 3} />
            )}
            {!loading && data && data.results.length === 0 && (
              <tr>
                <td colSpan={columns.length + 4} style={{ padding: 0 }}>
                  <EmptyState />
                </td>
              </tr>
            )}
            {data?.results.map((row) => {
              const checked = selected.has(row.id);
              return (
                <tr key={row.id} className={checked ? "is-selected" : ""}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="admin-check"
                      aria-label={`Select row ${row.id}`}
                      checked={checked}
                      onChange={() => toggleOne(row.id)}
                    />
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--ink-3)",
                      cursor: "pointer",
                    }}
                    onClick={() => setDrawerRow(row)}
                  >
                    {formatDate(row.created_at)}
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} onClick={() => setDrawerRow(row)} style={{ cursor: "pointer" }}>
                      {c.cell(row)}
                    </td>
                  ))}
                  <td>
                    <StatusDropdown
                      value={row.status}
                      onChange={(s) => patchRow(row.id, { status: s })}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <ActionMenu
                      phone={row.phone}
                      email={row.email}
                      onView={() => setDrawerRow(row)}
                      onMarkSpam={
                        row.status !== "spam"
                          ? () => patchRow(row.id, { status: "spam" })
                          : undefined
                      }
                      onDelete={() => deleteRow(row.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.count > pageSize && (
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
              disabled={!data.previous}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              type="button"
              className="admin-btn-soft"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      <RowDetailDrawer
        open={drawerOpen}
        onOpenChange={(o) => !o && setDrawerRow(null)}
        row={drawerRow}
        kind={kindLabel}
        title={drawerRow?.name || ""}
        fields={drawerRow ? detailFields(drawerRow) : []}
        onStatusChange={(s) => {
          if (drawerRow) patchRow(drawerRow.id, { status: s });
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterDropdown — small Radix dropdown for a single-value filter
// ---------------------------------------------------------------------------

interface FilterOption {
  value: string;
  label: string;
}
interface FilterDropdownProps {
  label: string;
  value: string | null;
  options: FilterOption[];
  onSelect: (value: string) => void;
}

function FilterDropdown({ label, value, options, onSelect }: FilterDropdownProps) {
  const display = value || `All ${label.toLowerCase()}`;
  const active = !!value;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="admin-btn-soft"
          style={
            active
              ? {
                  borderColor: "color-mix(in oklab, var(--brand) 30%, transparent)",
                  background: "var(--brand-tint)",
                  color: "var(--brand)",
                }
              : undefined
          }
        >
          <Filter size={14} />
          {display}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="admin-menu-content" align="start" sideOffset={6}>
          <div className="admin-menu-label">Filter by {label.toLowerCase()}</div>
          {options.map((o) => (
            <DropdownMenu.Item
              key={o.value}
              className="admin-menu-item"
              data-state={
                (value ?? "") === (o.value === "all" ? "" : o.value)
                  ? "checked"
                  : undefined
              }
              onSelect={() =>
                onSelect(o.value === "all" || o.value === "" ? "" : o.value)
              }
            >
              {o.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// ---------------------------------------------------------------------------
// SkeletonRows — loader placeholders
// ---------------------------------------------------------------------------

function SkeletonRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: columns }).map((__, j) => (
            <td key={j}>
              <span className="admin-skel" style={{ height: 12, width: j === 0 ? 18 : `${60 + ((j * 7) % 30)}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

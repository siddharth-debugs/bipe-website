"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type Paginated, type SubmissionStatus } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/utils";
import { Search, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";

const STATUSES: SubmissionStatus[] = [
  "new",
  "contacted",
  "qualified",
  "enrolled",
  "rejected",
  "spam",
];

const STATUS_PILL: Record<SubmissionStatus, string> = {
  new: "admin-pill-brand",
  contacted: "admin-pill-accent",
  qualified: "admin-pill-warning",
  enrolled: "admin-pill-success",
  rejected: "admin-pill-danger",
  spam: "admin-pill-danger",
};

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  width?: number;
}

interface SubmissionsTableProps<T extends { id: number; status: SubmissionStatus; created_at: string }> {
  /** Resource path under /api/v1/submissions/ — e.g. "apply" / "contact" / "visit". */
  resource: string;
  columns: ColumnDef<T>[];
  /** Optional extra filter chip values (e.g. branch). */
  extraFilters?: { label: string; field: string; options: string[] }[];
}

export function SubmissionsTable<
  T extends { id: number; status: SubmissionStatus; created_at: string },
>({ resource, columns, extraFilters = [] }: SubmissionsTableProps<T>) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "all">("all");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const params = useMemo(() => {
    const p: Record<string, string | number | undefined> = {
      page,
      ordering: "-created_at",
    };
    if (search) p.search = search;
    if (status !== "all") p.status = status;
    for (const [k, v] of Object.entries(extra)) {
      if (v) p[k] = v;
    }
    return p;
  }, [search, status, extra, page]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const d = await api<Paginated<T>>(`/submissions/${resource}/`, { searchParams: params });
      setData(d);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function setRowStatus(id: number, next: SubmissionStatus) {
    setUpdatingId(id);
    try {
      await api(`/submissions/${resource}/${id}/`, {
        method: "PATCH",
        body: { status: next },
      });
      await load();
    } catch {
      // ignore — UI just won't update
    } finally {
      setUpdatingId(null);
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.count / 25)) : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 340 }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-3)",
            }}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, phone, email…"
            className="admin-input"
            style={{ paddingLeft: 34 }}
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as SubmissionStatus | "all");
            setPage(1);
          }}
          className="admin-select"
          style={{ width: "auto" }}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {extraFilters.map((f) => (
          <select
            key={f.field}
            value={extra[f.field] ?? ""}
            onChange={(e) => {
              setExtra((x) => ({ ...x, [f.field]: e.target.value }));
              setPage(1);
            }}
            className="admin-select"
            style={{ width: "auto" }}
          >
            <option value="">All {f.label.toLowerCase()}</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}

        <button
          type="button"
          onClick={() => load()}
          className="btn btn-ghost"
          aria-label="Refresh"
          title="Refresh"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>

        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--ink-3)",
            textTransform: "uppercase",
          }}
        >
          {data ? `${data.count} ${data.count === 1 ? "row" : "rows"}` : "—"}
        </span>
      </div>

      {err && (
        <div className="card" style={{ padding: 14, color: "var(--danger)", fontSize: 13 }}>
          {err}
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 130 }}>Submitted</th>
              {columns.map((c) => (
                <th key={c.key} style={{ width: c.width }}>
                  {c.header}
                </th>
              ))}
              <th style={{ width: 160 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length + 2} style={{ color: "var(--ink-3)", textAlign: "center", padding: 26 }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && data && data.results.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} style={{ color: "var(--ink-3)", textAlign: "center", padding: 26 }}>
                  No submissions match these filters.
                </td>
              </tr>
            )}
            {!loading &&
              data?.results.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
                    {formatDate(row.created_at)}
                  </td>
                  {columns.map((c) => (
                    <td key={c.key}>{c.cell(row)}</td>
                  ))}
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => setRowStatus(row.id, e.target.value as SubmissionStatus)}
                      disabled={updatingId === row.id}
                      className="admin-select"
                      style={{ padding: "5px 8px", fontSize: 12 }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s[0].toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <span
                      className={`admin-pill ${STATUS_PILL[row.status]}`}
                      style={{ marginLeft: 6 }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.count > 25 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 4,
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
            PAGE {page} / {totalPages}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!data.previous}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

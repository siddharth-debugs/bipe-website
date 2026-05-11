"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Pill } from "@/components/admin/ui/Pill";
import { Banner, PrimaryButton, Skeleton } from "@/components/admin/seo/FormBits";
import {
  createPage,
  deletePage,
  listPages,
  type PageSEO,
} from "@/lib/admin/seo";

export default function PagesListPage() {
  const [rows, setRows] = useState<PageSEO[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);

  function refresh() {
    setRows(null);
    listPages()
      .then(setRows)
      .catch((e) => setErr(e?.message ?? "Failed to load"));
  }

  useEffect(refresh, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.path.toLowerCase().includes(s) ||
        (r.label ?? "").toLowerCase().includes(s) ||
        (r.title ?? "").toLowerCase().includes(s),
    );
  }, [rows, q]);

  async function onCreate() {
    if (!newPath.trim().startsWith("/")) {
      setErr("Path must start with a slash, e.g. /new-page");
      return;
    }
    setCreating(true);
    setErr(null);
    try {
      await createPage({ path: newPath.trim(), label: newLabel.trim() });
      setNewPath("");
      setNewLabel("");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: number, path: string) {
    if (!confirm(`Delete SEO entry for ${path}? Page will fall back to site defaults.`)) return;
    await deletePage(id);
    refresh();
  }

  return (
    <>
      <PageHeader
        eyebrow="SEO · Pages"
        title="Per-page"
        accent="overrides."
        description="Every public route can have its own meta, OG, Twitter card, and JSON-LD. Pages not listed inherit the site defaults."
      />
      {err && <Banner kind="error">{err}</Banner>}

      <div
        className="admin-card"
        style={{
          padding: 16,
          marginBottom: 18,
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: 12,
          alignItems: "end",
        }}
      >
        <label>
          <span className="admin-label">New path</span>
          <input
            className="admin-input"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="/new-page"
            style={{ width: "100%" }}
          />
        </label>
        <label>
          <span className="admin-label">Label (admin-only)</span>
          <input
            className="admin-input"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New page"
            style={{ width: "100%" }}
          />
        </label>
        <PrimaryButton disabled={creating || !newPath.trim()} onClick={onCreate}>
          {creating ? "Creating…" : "Add page"}
        </PrimaryButton>
      </div>

      <div style={{ marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          className="admin-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by path, label or title"
          style={{ maxWidth: 360 }}
        />
        <span style={{ color: "var(--ink-3)", fontSize: 12 }}>
          {filtered ? `${filtered.length} of ${rows?.length ?? 0}` : ""}
        </span>
      </div>

      {!rows ? (
        <Skeleton />
      ) : filtered && filtered.length === 0 ? (
        <div className="admin-card" style={{ padding: 22, color: "var(--ink-3)" }}>
          No pages match. Add one above.
        </div>
      ) : (
        <div
          className="admin-card"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--paper-2)", textAlign: "left" }}>
                <Th>Path</Th>
                <Th>Label</Th>
                <Th>Title</Th>
                <Th>Status</Th>
                <Th>Updated</Th>
                <Th>{""}</Th>
              </tr>
            </thead>
            <tbody>
              {(filtered ?? rows).map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <Td>
                    <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.path}</code>
                  </Td>
                  <Td>{r.label || <span style={{ color: "var(--ink-4)" }}>—</span>}</Td>
                  <Td style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.title || <span style={{ color: "var(--ink-4)" }}>(none)</span>}
                  </Td>
                  <Td>
                    <Pill tone={r.enabled ? "success" : "ghost"}>{r.enabled ? "enabled" : "disabled"}</Pill>
                  </Td>
                  <Td style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>
                    {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "—"}
                  </Td>
                  <Td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <Link
                      href={`/admin/dashboard/seo/pages/${r.id}`}
                      className="admin-btn-soft"
                      style={{ padding: "6px 12px", fontSize: 12, textDecoration: "none" }}
                    >
                      Edit
                    </Link>
                    <button
                      className="admin-btn-soft"
                      style={{ padding: "6px 12px", fontSize: 12, marginLeft: 6, color: "var(--danger)" }}
                      onClick={() => r.id && onDelete(r.id, r.path)}
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: "10px 14px",
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--ink-3)",
        fontWeight: 500,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--ink-2)", ...style }}>
      {children}
    </td>
  );
}

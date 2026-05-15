"use client";

import React from "react";

import { Tag } from "@/components/admin/common/Toolkit";

export interface ContentRow {
  id: number;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
}

export interface Column<R extends ContentRow> {
  key: string;
  header: string;
  render: (row: R) => React.ReactNode;
  width?: string;
}

export function ContentTable<R extends ContentRow>({
  rows,
  columns,
  onEdit,
  onTogglePublished,
  onDelete,
}: {
  rows: R[];
  columns: Column<R>[];
  onEdit: (row: R) => void;
  onTogglePublished?: (row: R) => void;
  onDelete?: (row: R) => void;
}) {
  return (
    <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--paper-2)", textAlign: "left" }}>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  padding: "10px 14px",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--ink-3)",
                  fontWeight: 500,
                  width: c.width,
                }}
              >
                {c.header}
              </th>
            ))}
            <th
              style={{
                padding: "10px 14px",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--ink-3)",
                fontWeight: 500,
                width: 90,
              }}
            >
              Status
            </th>
            <th style={{ padding: "10px 14px", width: 220 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderTop: "1px solid var(--line)" }}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--ink-2)" }}
                >
                  {c.render(row)}
                </td>
              ))}
              <td style={{ padding: "12px 14px" }}>
                {row.is_published ? <Tag tone="success">live</Tag> : <Tag>draft</Tag>}
              </td>
              <td style={{ padding: "12px 14px", textAlign: "right", whiteSpace: "nowrap" }}>
                <button
                  className="admin-btn-soft"
                  style={{ padding: "6px 12px", fontSize: 12 }}
                  onClick={() => onEdit(row)}
                >
                  Edit
                </button>
                {onTogglePublished && (
                  <button
                    className="admin-btn-soft"
                    style={{ padding: "6px 12px", fontSize: 12, marginLeft: 6 }}
                    onClick={() => onTogglePublished(row)}
                  >
                    {row.is_published ? "Unpublish" : "Publish"}
                  </button>
                )}
                {onDelete && (
                  <button
                    className="admin-btn-soft"
                    style={{ padding: "6px 12px", fontSize: 12, marginLeft: 6, color: "var(--danger, #c13b2b)" }}
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

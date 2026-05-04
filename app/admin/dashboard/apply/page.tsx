"use client";

import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import type { ApplySubmission } from "@/lib/admin/api";

const BRANCHES = [
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering (Production)",
  "Computer Science & Engineering",
  "Dairy Engineering",
  "Not sure yet — guide me",
];

export default function ApplyListPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <header
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "1px solid var(--line)",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <div className="eyebrow">§ Submissions · Apply</div>
          <h1 className="admin-h1" style={{ marginTop: 8 }}>
            Apply form
          </h1>
          <p style={{ color: "var(--ink-3)", marginTop: 6 }}>
            Multi-step admission applications submitted via /apply on bipevns.org.
          </p>
        </div>
      </header>

      <SubmissionsTable<ApplySubmission>
        resource="apply"
        extraFilters={[{ label: "Branch", field: "branch", options: BRANCHES }]}
        columns={[
          {
            key: "name",
            header: "Applicant",
            cell: (r) => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  {r.email || "—"}
                </div>
              </div>
            ),
          },
          {
            key: "phone",
            header: "Phone",
            cell: (r) => (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{r.phone}</span>
            ),
          },
          {
            key: "branch",
            header: "Branch",
            cell: (r) => <span className="admin-pill">{r.branch}</span>,
          },
          {
            key: "details",
            header: "Class 10",
            cell: (r) => (
              <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
                <div>{r.board || "—"}</div>
                <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
                  {r.marks ? `${r.marks}%` : "—"}
                </div>
              </div>
            ),
          },
          {
            key: "visit",
            header: "Wants visit",
            cell: (r) =>
              r.visit === "yes" ? (
                <span className="admin-pill admin-pill-accent">{r.visit_date} · {r.visit_time}</span>
              ) : (
                <span className="admin-pill">{r.visit || "—"}</span>
              ),
          },
        ]}
      />
    </div>
  );
}

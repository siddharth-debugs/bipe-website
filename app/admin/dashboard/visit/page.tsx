"use client";

import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import type { VisitSubmission } from "@/lib/admin/api";

const BRANCHES = [
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering (Production)",
  "Computer Science & Engineering",
  "Dairy Engineering",
  "Not sure yet — guide me",
];

export default function VisitListPage() {
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
          <div className="eyebrow">§ Submissions · Visit</div>
          <h1 className="admin-h1" style={{ marginTop: 8 }}>
            Visit bookings
          </h1>
          <p style={{ color: "var(--ink-3)", marginTop: 6 }}>
            Campus visit bookings submitted via /visit on bipevns.org.
          </p>
        </div>
      </header>

      <SubmissionsTable<VisitSubmission>
        resource="visit"
        extraFilters={[{ label: "Branch", field: "branch", options: BRANCHES }]}
        columns={[
          {
            key: "name",
            header: "Visitor",
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
            key: "when",
            header: "Slot",
            cell: (r) => (
              <div>
                <div style={{ fontWeight: 600 }}>{r.visit_date}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{r.visit_time}</div>
              </div>
            ),
          },
          {
            key: "branch",
            header: "Branch",
            cell: (r) => <span className="admin-pill">{r.branch}</span>,
          },
          {
            key: "party",
            header: "Party",
            cell: (r) => (
              <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                <div>{r.party || "—"}</div>
                {r.needs_shuttle && (
                  <span className="admin-pill admin-pill-accent" style={{ marginTop: 4 }}>Needs shuttle</span>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

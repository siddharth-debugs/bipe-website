"use client";

import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import type { ContactSubmission } from "@/lib/admin/api";

const BRANCHES = [
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering (Production)",
  "Computer Science & Engineering",
  "Dairy Engineering",
  "Not sure yet — guide me",
];

export default function ContactListPage() {
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
          <div className="eyebrow">§ Submissions · Contact</div>
          <h1 className="admin-h1" style={{ marginTop: 8 }}>
            Contact form
          </h1>
          <p style={{ color: "var(--ink-3)", marginTop: 6 }}>
            Single-page enquiries submitted via /contact on bipevns.org.
          </p>
        </div>
      </header>

      <SubmissionsTable<ContactSubmission>
        resource="contact"
        extraFilters={[{ label: "Branch", field: "branch", options: BRANCHES }]}
        columns={[
          {
            key: "name",
            header: "From",
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
            key: "message",
            header: "Message",
            cell: (r) => (
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
              >
                {r.message || "—"}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

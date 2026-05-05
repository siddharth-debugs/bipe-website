"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Pill } from "@/components/admin/ui/Pill";
import { PageHeader } from "@/components/admin/ui/PageHeader";
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
    <>
      <PageHeader
        eyebrow="Submissions · Visit"
        title="Visit"
        accent="bookings."
        description="Campus visit bookings submitted via /visit on bipevns.org."
      />

      <DataTable<VisitSubmission>
        resource="visit"
        kindLabel="Visit booking"
        filters={[{ label: "Branch", field: "branch", options: BRANCHES }]}
        columns={[
          {
            key: "name",
            header: "Visitor",
            sortable: true,
            cell: (r) => (
              <div>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>{r.name}</div>
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
            key: "visit_date",
            header: "Slot",
            sortable: true,
            cell: (r) => (
              <div>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>{r.visit_date}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{r.visit_time}</div>
              </div>
            ),
          },
          {
            key: "branch",
            header: "Branch",
            sortable: true,
            cell: (r) => <Pill>{r.branch}</Pill>,
          },
          {
            key: "party",
            header: "Party",
            cell: (r) => (
              <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                <div>{r.party || "—"}</div>
                {r.needs_shuttle && (
                  <Pill tone="accent" noDot>
                    Needs shuttle
                  </Pill>
                )}
              </div>
            ),
          },
        ]}
        detailFields={(r) => [
          { section: "Contact", label: "Phone", value: r.phone, mono: true },
          { section: "Contact", label: "Email", value: r.email },

          { section: "Visit", label: "Branch interest", value: r.branch },
          { section: "Visit", label: "Date", value: r.visit_date },
          { section: "Visit", label: "Slot", value: r.visit_time },
          { section: "Visit", label: "Party", value: r.party },
          { section: "Visit", label: "Needs shuttle", value: r.needs_shuttle ? "Yes" : "No" },

          { section: "Notes", label: "Notes from visitor", value: r.notes, kind: "note" },

          { section: "Technical", label: "Source IP", value: r.source_ip, kind: "tech" },
          { section: "Technical", label: "User agent", value: r.user_agent, kind: "tech" },
        ]}
      />
    </>
  );
}

"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Pill } from "@/components/admin/ui/Pill";
import { PageHeader } from "@/components/admin/ui/PageHeader";
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
    <>
      <PageHeader
        eyebrow="Submissions · Apply"
        title="Apply form"
        accent="submissions."
        description="Multi-step admission applications submitted via /apply on bipevns.org."
      />

      <DataTable<ApplySubmission>
        resource="apply"
        kindLabel="Apply submission"
        filters={[{ label: "Branch", field: "branch", options: BRANCHES }]}
        columns={[
          {
            key: "name",
            header: "Applicant",
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
            key: "branch",
            header: "Branch",
            sortable: true,
            cell: (r) => <Pill>{r.branch}</Pill>,
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
                <Pill tone="accent">
                  {r.visit_date} · {r.visit_time}
                </Pill>
              ) : (
                <Pill>{r.visit || "—"}</Pill>
              ),
          },
        ]}
        detailFields={(r) => [
          { label: "Phone", value: r.phone, mono: true },
          { label: "Email", value: r.email },
          { label: "Branch", value: r.branch },
          { label: "Parent / guardian", value: r.parent },
          { label: "Category", value: r.category },
          { label: "Class 10 board", value: r.board },
          { label: "Marks (%)", value: r.marks, mono: true },
          { label: "Heard about us via", value: r.source },
          { label: "Wants campus visit", value: r.visit },
          { label: "Preferred visit date", value: r.visit_date },
          { label: "Preferred slot", value: r.visit_time },
          { label: "Notes", value: r.notes, wide: true },
          { label: "Source IP", value: r.source_ip, mono: true },
          { label: "User agent", value: r.user_agent, mono: true, wide: true },
        ]}
      />
    </>
  );
}

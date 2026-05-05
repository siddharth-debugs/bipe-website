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
          { section: "Contact", label: "Phone", value: r.phone, mono: true },
          { section: "Contact", label: "Email", value: r.email },
          { section: "Contact", label: "Parent / guardian", value: r.parent },

          { section: "Application", label: "Branch", value: r.branch },
          { section: "Application", label: "Category", value: r.category },
          { section: "Application", label: "Class 10 board", value: r.board },
          { section: "Application", label: "Marks", value: r.marks ? `${r.marks}%` : "", mono: true },
          { section: "Application", label: "Heard about us via", value: r.source },

          { section: "Campus visit", label: "Wants visit", value: r.visit },
          { section: "Campus visit", label: "Preferred date", value: r.visit_date },
          { section: "Campus visit", label: "Preferred slot", value: r.visit_time },

          { section: "Notes", label: "Notes from applicant", value: r.notes, kind: "note" },

          { section: "Technical", label: "Source IP", value: r.source_ip, kind: "tech" },
          { section: "Technical", label: "User agent", value: r.user_agent, kind: "tech" },
        ]}
      />
    </>
  );
}

"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Pill } from "@/components/admin/ui/Pill";
import { PageHeader } from "@/components/admin/ui/PageHeader";
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
    <>
      <PageHeader
        eyebrow="Submissions · Contact"
        title="Contact form"
        accent="enquiries."
        description="Single-page enquiries submitted via /contact on bipevns.org."
      />

      <DataTable<ContactSubmission>
        resource="contact"
        kindLabel="Contact enquiry"
        filters={[{ label: "Branch", field: "branch", options: BRANCHES }]}
        columns={[
          {
            key: "name",
            header: "From",
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
                title={r.message}
              >
                {r.message || "—"}
              </div>
            ),
          },
        ]}
        detailFields={(r) => [
          { section: "Contact", label: "Phone", value: r.phone, mono: true },
          { section: "Contact", label: "Email", value: r.email },

          { section: "Enquiry", label: "Branch interest", value: r.branch },
          { section: "Enquiry", label: "Heard about us via", value: r.source },

          { section: "Message", label: "Message", value: r.message, kind: "note" },

          { section: "Technical", label: "Source IP", value: r.source_ip, kind: "tech" },
          { section: "Technical", label: "User agent", value: r.user_agent, kind: "tech" },
        ]}
      />
    </>
  );
}

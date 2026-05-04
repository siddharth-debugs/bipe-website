"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Summary } from "@/lib/admin/api";
import { GraduationCap, Mail, CalendarDays, ArrowRight } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  enrolled: "Enrolled",
  rejected: "Rejected",
  spam: "Spam",
};

export default function OverviewPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Summary>("/submissions/summary/")
      .then(setSummary)
      .catch((e) => setErr(e?.message ?? "Could not load summary."));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
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
          <div className="eyebrow">§ Overview</div>
          <h1 className="admin-h1" style={{ marginTop: 8 }}>
            Submissions at a glance
          </h1>
          <p style={{ color: "var(--ink-3)", marginTop: 6 }}>
            Live counts across the three website forms.
          </p>
        </div>
      </header>

      {err && (
        <div className="card" style={{ padding: 16, color: "var(--danger)", fontSize: 13 }}>
          {err}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        <SummaryCard
          href="/admin/dashboard/apply"
          Icon={GraduationCap}
          label="Apply submissions"
          summary={summary?.apply}
        />
        <SummaryCard
          href="/admin/dashboard/contact"
          Icon={Mail}
          label="Contact submissions"
          summary={summary?.contact}
        />
        <SummaryCard
          href="/admin/dashboard/visit"
          Icon={CalendarDays}
          label="Visit bookings"
          summary={summary?.visit}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  href,
  Icon,
  label,
  summary,
}: {
  href: string;
  Icon: React.ComponentType<{ size?: number }>;
  label: string;
  summary: Summary["apply"] | undefined;
}) {
  return (
    <Link
      href={href}
      className="card"
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        textDecoration: "none",
        color: "inherit",
        transition: "border-color .2s, transform .2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--brand-tint)",
            color: "var(--brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} />
        </div>
        <ArrowRight size={16} color="var(--ink-3)" />
      </div>

      <div>
        <div className="eyebrow">{label}</div>
        <div
          style={{
            marginTop: 6,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: "var(--ink)",
          }}
        >
          {summary?.total ?? "—"}
        </div>
        <div style={{ marginTop: 4, color: "var(--ink-3)", fontSize: 12 }}>total</div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          paddingTop: 10,
          borderTop: "1px solid var(--line)",
        }}
      >
        {summary
          ? Object.entries(summary)
              .filter(([k, v]) => k !== "total" && (v ?? 0) > 0)
              .map(([k, v]) => (
                <span key={k} className={`admin-pill admin-pill-${k === "new" ? "brand" : k === "enrolled" ? "success" : k === "spam" || k === "rejected" ? "danger" : k === "contacted" ? "accent" : "warning"}`}>
                  {STATUS_LABELS[k] ?? k} · {v}
                </span>
              ))
          : null}
      </div>
    </Link>
  );
}

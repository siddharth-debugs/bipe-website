"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Mail, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api, type Summary, type SummaryByForm } from "@/lib/admin/api";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Pill, type PillTone } from "@/components/admin/ui/Pill";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  enrolled: "Enrolled",
  rejected: "Rejected",
  spam: "Spam",
};

const STATUS_TONE: Record<string, PillTone> = {
  new: "brand",
  contacted: "accent",
  qualified: "warning",
  enrolled: "success",
  rejected: "danger",
  spam: "danger",
};

export default function OverviewPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Summary>("/submissions/summary/")
      .then(setSummary)
      .catch((e) => setErr(e?.message ?? "Could not load summary."));
  }, []);

  const total = summary
    ? summary.apply.total + summary.contact.total + summary.visit.total
    : null;
  const newCount = summary
    ? summary.apply.new + summary.contact.new + summary.visit.new
    : null;

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Submissions"
        accent="at a glance."
        description="Live counts across the three forms on bipevns.org. Click a card to drill in."
        right={
          <>
            <Pill tone="brand" noDot>
              {newCount ?? "—"} new
            </Pill>
            <Pill tone="ghost" noDot>
              {total ?? "—"} total
            </Pill>
          </>
        }
      />

      {err && (
        <div className="admin-card" style={{ padding: 16, color: "var(--danger)", fontSize: 13, marginBottom: 18 }}>
          {err}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <SummaryCard
          href="/admin/dashboard/apply"
          Icon={GraduationCap}
          eyebrow="Apply form"
          subtitle="JEECUP candidates · 4-step form"
          summary={summary?.apply}
        />
        <SummaryCard
          href="/admin/dashboard/contact"
          Icon={Mail}
          eyebrow="Contact form"
          subtitle="General enquiries · /contact"
          summary={summary?.contact}
        />
        <SummaryCard
          href="/admin/dashboard/visit"
          Icon={CalendarDays}
          eyebrow="Visit bookings"
          subtitle="Campus visits · /visit"
          summary={summary?.visit}
        />
      </div>

      <div className="admin-card" style={{ marginTop: 22, padding: 22 }}>
        <div className="admin-eyebrow" style={{ color: "var(--ink-3)" }}>
          / Tips
        </div>
        <div className="admin-h3" style={{ marginTop: 6 }}>
          Working with submissions
        </div>
        <ul style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
          <li>Click any row to open a detail drawer with full context (parent, board, marks, IP, UA).</li>
          <li>Use the row checkbox + bulk strip to update multiple submissions at once.</li>
          <li>The kebab menu carries quick actions — call, WhatsApp, copy, mark spam, delete.</li>
          <li>Status changes save immediately; the table refreshes after each action.</li>
        </ul>
      </div>
    </>
  );
}

interface SummaryCardProps {
  href: string;
  Icon: LucideIcon;
  eyebrow: string;
  subtitle: string;
  summary: SummaryByForm | undefined;
}

function SummaryCard({ href, Icon, eyebrow, subtitle, summary }: SummaryCardProps) {
  return (
    <Link
      href={href}
      className="admin-card admin-card-glow"
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
            width: 38,
            height: 38,
            borderRadius: 11,
            background: "var(--brand-tint)",
            color: "var(--brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid color-mix(in oklab, var(--brand) 20%, transparent)",
          }}
        >
          <Icon size={18} />
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          OPEN <ArrowUpRight size={12} />
        </span>
      </div>

      <div>
        <div className="admin-eyebrow">{eyebrow}</div>
        <div className="admin-h-display" style={{ marginTop: 2 }}>
          {summary?.total ?? "—"}
        </div>
        <div style={{ marginTop: 4, color: "var(--ink-3)", fontSize: 12 }}>{subtitle}</div>
      </div>

      {summary && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            paddingTop: 14,
            borderTop: "1px dashed var(--line-2)",
          }}
        >
          {Object.entries(summary)
            .filter(([k, v]) => k !== "total" && (v ?? 0) > 0)
            .map(([k, v]) => (
              <Pill key={k} tone={STATUS_TONE[k] ?? "default"}>
                {STATUS_LABEL[k] ?? k} · {v}
              </Pill>
            ))}
          {summary.total === 0 && (
            <Pill tone="ghost" noDot>
              No submissions yet
            </Pill>
          )}
        </div>
      )}
    </Link>
  );
}

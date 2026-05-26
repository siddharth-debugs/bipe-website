"use client";

/**
 * Admin Overview — dashboard landing page.
 *
 * The KPIs here mirror what the Inbox shows so the two pages never
 * disagree: the top-right "X new / Y total" and the status-bucket row
 * both count *leads* (phone-deduped prospects), not raw submissions.
 * Per-kind cards keep the raw submission counts so the operator can
 * still see "we got 7 Apply form fills".
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  GraduationCap,
  Mail,
  MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  api,
  type ApplySubmission,
  type ContactSubmission,
  type EnquirySubmission,
  type FollowUp,
  type Paginated,
  type Summary,
  type SummaryByForm,
  type VisitSubmission,
} from "@/lib/admin/api";
import {
  buildLeadGroups,
  normalisePhone,
  statusBucket,
  type AnyRow,
  type StatusBucket,
} from "@/lib/admin/leads";
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

const BUCKET_META: Record<
  StatusBucket,
  { label: string; tone: PillTone }
> = {
  all: { label: "All leads", tone: "ghost" },
  new: { label: "New", tone: "brand" },
  in_progress: { label: "In progress", tone: "warning" },
  closed_win: { label: "Closed win", tone: "success" },
  closed_loss: { label: "Closed loss", tone: "danger" },
  spam: { label: "Spam", tone: "danger" },
};

const PER_KIND_FETCH = 200;

export default function OverviewPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [followUpsByKey, setFollowUpsByKey] = useState<
    Record<string, FollowUp[]>
  >({});
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, a, c, e, v, fu] = await Promise.all([
          api<Summary>("/submissions/summary/"),
          api<Paginated<ApplySubmission>>("/submissions/apply/", {
            searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
          }),
          api<Paginated<ContactSubmission>>("/submissions/contact/", {
            searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
          }),
          api<Paginated<EnquirySubmission>>("/submissions/enquiry/", {
            searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
          }),
          api<Paginated<VisitSubmission>>("/submissions/visit/", {
            searchParams: { page_size: PER_KIND_FETCH, ordering: "-created_at" },
          }),
          api<Paginated<FollowUp> | FollowUp[]>("/submissions/follow-ups/", {
            searchParams: { page_size: 500, ordering: "-created_at" },
          }),
        ]);
        setSummary(s);
        const merged: AnyRow[] = [
          ...a.results.map((r) => ({ ...r, kind: "apply" as const })),
          ...c.results.map((r) => ({ ...r, kind: "contact" as const })),
          ...e.results.map((r) => ({ ...r, kind: "enquiry" as const })),
          ...v.results.map((r) => ({ ...r, kind: "visit" as const })),
        ];
        const fuList = Array.isArray(fu) ? fu : fu.results ?? [];
        const byKey: Record<string, FollowUp[]> = {};
        for (const f of fuList) {
          const key = normalisePhone(f.leadKey);
          (byKey[key] ||= []).push(f);
        }
        for (const k of Object.keys(byKey)) {
          byKey[k].sort((x, y) => y.createdAt.localeCompare(x.createdAt));
        }
        setRows(merged);
        setFollowUpsByKey(byKey);
      } catch (e2) {
        setErr(e2 instanceof Error ? e2.message : "Could not load summary.");
      }
    }
    void load();
  }, []);

  const groups = useMemo(
    () => buildLeadGroups(rows, followUpsByKey),
    [rows, followUpsByKey],
  );

  const bucketCounts = useMemo(() => {
    const out: Record<StatusBucket, number> = {
      all: groups.length,
      new: 0,
      in_progress: 0,
      closed_win: 0,
      closed_loss: 0,
      spam: 0,
    };
    for (const g of groups) out[statusBucket(g)]++;
    return out;
  }, [groups]);

  const totalLeads = groups.length;
  const newLeads = bucketCounts.new;

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Submissions"
        accent="at a glance."
        description="Live counts across the four forms on bipevns.org. Leads are deduplicated by phone — the same prospect across Apply / Contact / Enquiry / Visit counts as one."
        right={
          <>
            <Pill tone="brand" noDot>
              {newLeads} new
            </Pill>
            <Pill tone="ghost" noDot>
              {totalLeads} leads
            </Pill>
          </>
        }
      />

      {err && (
        <div
          className="admin-card"
          style={{
            padding: 16,
            color: "var(--danger)",
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          {err}
        </div>
      )}

      {/* Status bucket strip — same buckets the Inbox filters by. */}
      <div
        className="admin-card"
        style={{
          padding: "14px 18px",
          marginBottom: 18,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--ink-3)",
            fontWeight: 700,
            marginRight: 4,
          }}
        >
          By status
        </span>
        {(Object.keys(BUCKET_META) as StatusBucket[]).map((b) => {
          const meta = BUCKET_META[b];
          return (
            <Link
              key={b}
              href={
                b === "all"
                  ? "/admin/dashboard/inbox"
                  : `/admin/dashboard/inbox?bucket=${b}`
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
              }}
            >
              <Pill tone={meta.tone}>
                {meta.label} · {bucketCounts[b]}
              </Pill>
            </Link>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <SummaryCard
          href="/admin/dashboard/inbox?kind=apply"
          Icon={GraduationCap}
          eyebrow="Apply form"
          subtitle="JEECUP candidates · 4-step form"
          summary={summary?.apply}
        />
        <SummaryCard
          href="/admin/dashboard/inbox?kind=contact"
          Icon={Mail}
          eyebrow="Contact form"
          subtitle="General enquiries · /contact"
          summary={summary?.contact}
        />
        <SummaryCard
          href="/admin/dashboard/inbox?kind=enquiry"
          Icon={MessageCircle}
          eyebrow="Enquiry popup"
          subtitle="WhatsApp leads · sitewide"
          summary={summary?.enquiry}
        />
        <SummaryCard
          href="/admin/dashboard/inbox?kind=visit"
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
        <ul
          style={{
            margin: "12px 0 0",
            paddingLeft: 18,
            fontSize: 13.5,
            color: "var(--ink-2)",
            lineHeight: 1.7,
          }}
        >
          <li>
            The inbox groups submissions by phone — one row per prospect, with
            every form they filled out collapsed inside.
          </li>
          <li>
            Click a row to open the timeline drawer and log call outcomes;
            status auto-derives from the outcome.
          </li>
          <li>
            Per-kind cards above show raw submission counts; the bucket row
            and header pills count <em>leads</em>.
          </li>
          <li>
            Status changes save immediately; the table refreshes after each
            action.
          </li>
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

function SummaryCard({
  href,
  Icon,
  eyebrow,
  subtitle,
  summary,
}: SummaryCardProps) {
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
            border:
              "1px solid color-mix(in oklab, var(--brand) 20%, transparent)",
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
        <div style={{ marginTop: 4, color: "var(--ink-3)", fontSize: 12 }}>
          {subtitle}
        </div>
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

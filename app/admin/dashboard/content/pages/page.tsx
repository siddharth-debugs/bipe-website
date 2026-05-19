"use client";

import Link from "next/link";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { PAGES } from "@/lib/admin/pages-registry";
import { ArrowIcon } from "@/components/shell/Icons";

export default function PagesIndex() {
  return (
    <>
      <PageHeader eyebrow="Content · Pages" title="Pages" accent="overview."
        description="Each tile is a public page. Open one to edit its sections — hero, intro blurbs, image lists, stats. Everything here drives what visitors see; nothing here needs a code deploy." />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 14,
      }}>
        {PAGES.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/dashboard/content/pages/${p.slug}`}
            style={{
              display: "block",
              padding: "18px 18px 16px",
              borderRadius: 14,
              border: "1px solid var(--line)",
              background: "var(--white)",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color .15s, transform .15s, box-shadow .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--line-2, #c4c8d2)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px -4px rgba(10,26,63,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}>
                {p.publicPath}
              </span>
              <ArrowIcon size={12} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              {p.label}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.45 }}>
              {p.description}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--ink-3)" }}>
              {p.sections.length} section{p.sections.length === 1 ? "" : "s"}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

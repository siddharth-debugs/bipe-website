import React from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/shell/Icons";

/**
 * BIPE Trust merit-scholarship strip.
 *
 * Surfaces the top-2,000 / 50% scholarship as a homepage banner, per
 * user direction 28 May 2026. The full policy lives on /scholarships
 * (and a worked example is in the /fees Scenario card 02); this strip
 * is the at-a-glance prompt that gets a strong JEECUP candidate to
 * click through during the admissions window.
 *
 * Anchored to a concrete number — top 2,000 All-India JEECUP 2026
 * rank — rather than a vague "for high-rank candidates" band. That
 * lets a student know in three seconds whether the offer applies to
 * them.
 */
export const ScholarshipStrip = () => (
  <section className="section-tight" style={{ paddingTop: 32, paddingBottom: 32 }}>
    <div className="container">
      <Link
        href="/scholarships"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 28,
          alignItems: "center",
          padding: "26px 32px",
          borderRadius: 20,
          background: "var(--ink)",
          color: "var(--paper)",
          textDecoration: "none",
          overflow: "hidden",
          border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
        }}
      >
        <div aria-hidden="true" style={{
          position: "absolute",
          right: -120, top: -120, width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Big italic 50% */}
        <div
          className="serif"
          style={{
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(56px, 7vw, 92px)",
            lineHeight: 0.85,
            color: "var(--accent)",
            letterSpacing: "-0.02em",
            position: "relative",
          }}
        >
          50%
        </div>

        {/* Copy block */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            BIPE Trust scholarship · 2026-27
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: "clamp(18px, 2.1vw, 24px)",
              lineHeight: 1.25,
              fontWeight: 600,
              maxWidth: "48ch",
              color: "var(--paper)",
            }}
          >
            Top 2,000 JEECUP 2026 rank gets a{" "}
            <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
              50% tuition waiver
            </span>{" "}
            on the published ₹30,150 fee.
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 13.5,
              color: "color-mix(in oklab, var(--paper) 72%, transparent)",
              maxWidth: "56ch",
              lineHeight: 1.55,
            }}
          >
            Applied directly at fee deposit on production of the JEECUP rank card. Stackable on top of UP Govt post-matric reimbursement.
          </div>
        </div>

        {/* CTA arrow */}
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 20px",
            borderRadius: 12,
            background: "var(--accent)",
            color: "var(--ink)",
            fontWeight: 700,
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          Read the policy <ArrowIcon size={14} />
        </div>
      </Link>
    </div>
  </section>
);

import React from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/shell/Icons";

export const FeeCallout = () => (
  <section className="section">
    <div className="container">
      <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <div className="eyebrow">Fee Transparency</div>
          <h2 className="bipe-h1" style={{ marginTop: 14 }}>Every rupee, on the <span className="serif">record.</span></h2>
          <p className="lead" style={{ marginTop: 18 }}>
            Tuition is AFRC-approved at ₹30,150 per year. No capitation, no surprise charges, no &quot;donation&quot; line items. We publish the full break-up — and you&apos;ll get receipts for every payment.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <Link href="/fees" className="btn btn-primary">See full break-up <ArrowIcon /></Link>
            <Link href="/scholarships" className="btn btn-ghost">Scholarships</Link>
          </div>
        </div>
        <div style={{ background: "var(--white)", border: "1px solid var(--line)", borderRadius: 18, padding: 28 }}>
          <div className="between" style={{ marginBottom: 18 }}>
            <span className="eyebrow">2026-27 · Per Year</span>
            <span className="pill">AFRC ✓</span>
          </div>
          {([
            ["Tuition fee", "₹30,150"],
            ["Caution money (refundable)", "₹3,000"],
            ["Exam & registration (BTEUP)", "Pass-through"],
            ["Hostel + Mess", "Optional · separate"],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--line)", fontSize: 15 }}>
              <span style={{ color: "var(--ink-2)" }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 18, padding: 14, background: "var(--brand-soft)", borderRadius: 12, fontSize: 13, color: "var(--brand)" }}>
            ★ SC/ST/OBC/Minority/EWS — full UP Govt. post-matric scholarship covers tuition.
          </div>
        </div>
      </div>
    </div>
  </section>
);

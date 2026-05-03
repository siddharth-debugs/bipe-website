import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Global skeleton fallback for route segment transitions.
 *
 * Mimics the typical page rhythm seen across BIPE pages:
 *  - editorial hero (eyebrow + headline + lead + CTA row + side card)
 *  - one supporting section (eyebrow + heading + 3-card grid)
 *  - one secondary band (heading + horizontal stat strip)
 *
 * Skeletons render server-side, no JS needed. Shimmer animation runs
 * via the `.skeleton` keyframes in globals.css.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      {/* Editorial hero — paper bg */}
      <section className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <Skeleton width={160} height={12} variant="pill" />
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
                <Skeleton width="92%" height={48} radius={10} />
                <Skeleton width="74%" height={48} radius={10} />
              </div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                <Skeleton width="100%" height={14} />
                <Skeleton width="96%" height={14} />
                <Skeleton width="60%" height={14} />
              </div>
              <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
                <Skeleton width={180} height={48} variant="pill" />
                <Skeleton width={140} height={48} variant="pill" />
              </div>
              <div
                style={{
                  marginTop: 36,
                  paddingTop: 22,
                  borderTop: "1px solid var(--line)",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 18,
                }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton width="60%" height={28} radius={6} />
                    <div style={{ marginTop: 10 }}>
                      <Skeleton width="80%" height={10} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side card placeholder */}
            <div
              style={{
                borderRadius: 22,
                padding: 28,
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <Skeleton width={120} height={11} variant="pill" />
              <Skeleton width="80%" height={28} />
              <Skeleton width="100%" height={210} radius={14} />
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 8 }}>
                <Skeleton width="92%" height={10} />
                <Skeleton width="88%" height={10} />
                <Skeleton width="70%" height={10} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Light secondary section — heading + 3-card grid */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36, maxWidth: 720 }}>
            <Skeleton width={140} height={11} variant="pill" />
            <Skeleton width="68%" height={40} radius={10} />
            <Skeleton width="92%" height={14} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: 18,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minHeight: 220,
                }}
              >
                <Skeleton width={42} height={42} variant="circle" />
                <Skeleton width="80%" height={20} radius={6} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  <Skeleton width="100%" height={11} />
                  <Skeleton width="92%" height={11} />
                  <Skeleton width="60%" height={11} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark stat band */}
      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: 56, paddingBottom: 56 }}
      >
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28, maxWidth: 720 }}>
            <Skeleton dark width={140} height={11} variant="pill" />
            <Skeleton dark width="56%" height={36} radius={10} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                  borderRadius: 14,
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <Skeleton dark width="70%" height={32} radius={6} />
                <Skeleton dark width="55%" height={10} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

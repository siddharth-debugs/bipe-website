import React from "react";
import { DATA } from "@/lib/data";

export const Recruiters = () => (
  <section className="section-tight">
    <div className="container" style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ textAlign: "center" }}>
        1,000+ alumni placed at
      </div>
    </div>
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: "55s" }}>
        {[0, 1].flatMap((cycle) =>
          DATA.recruiters.map((r, j) => (
            <span
              key={`${cycle}-${j}`}
              className="bipe-recruiter"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 48,
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 38,
                lineHeight: 1,
                color: "var(--ink-3)",
                whiteSpace: "nowrap",
              }}
            >
              {r}
              <span
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-sans)",
                  fontStyle: "normal",
                  fontSize: 8,
                }}
              >
                ●
              </span>
            </span>
          )),
        )}
      </div>
    </div>
  </section>
);

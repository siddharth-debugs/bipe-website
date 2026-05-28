import React from "react";
import { DATA } from "@/lib/data";

export const Recruiters = () => {
  // Pinned to DATA.recruiters as of 28 May 2026.
  //
  // We used to call getRecruiters() (backend-first, static fallback),
  // but the backend kept serving the OLD recruiter list that still
  // included Parag, NDDB, Amul, Mother Dairy etc. The static fallback
  // was already curated to drop those (see lib/data.ts:281-290 — the
  // post-Overall.docx curation) but the dynamic fetch kept overriding.
  // Until the admin record is brought in line, the static list wins.
  const recruiters = DATA.recruiters;
  return (
  <section className="section-tight">
    <div className="container" style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ textAlign: "center" }}>
        1,331 alumni placed at
      </div>
    </div>
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: "55s" }}>
        {[0, 1].flatMap((cycle) =>
          recruiters.map((r, j) => (
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
};

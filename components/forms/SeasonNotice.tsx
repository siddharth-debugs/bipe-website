import { FORM_SEASON_NOTICE } from "@/lib/admissionSeason";

/**
 * The one-line admission-cycle notice that sits above the first field of
 * every lead form.
 *
 * Separate from AdmissionSeasonBar on purpose. The bar can be dismissed and
 * is easy to scroll past; this cannot be dismissed and appears at the moment
 * the visitor is about to hand over a phone number. Before this existed, the
 * homepage form invited people to "Apply now" with no indication that the
 * session had closed six weeks earlier.
 *
 * `tone="dark"` is for forms sitting on the ink-coloured panels (the
 * homepage inline form, the WhatsApp FAB) where the default amber-on-paper
 * treatment would not have enough contrast.
 */
export function SeasonNotice({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <p
      className="season-note"
      style={
        tone === "dark"
          ? {
              background: "color-mix(in oklab, var(--accent) 18%, transparent)",
              borderColor: "color-mix(in oklab, var(--accent) 55%, transparent)",
              color: "var(--paper)",
            }
          : undefined
      }
    >
      <span className="season-note-mark" aria-hidden="true">
        !
      </span>
      <span>{FORM_SEASON_NOTICE}</span>
    </p>
  );
}

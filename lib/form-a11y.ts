/**
 * Accessibility helper for form fields.
 *
 * Returns the four attributes every text/select input on this site
 * should carry for screen-reader users:
 *
 *   id                  Required for the `htmlFor` <label> association.
 *   aria-required       Announces "required" before the label when true.
 *                       Omitted (undefined) for optional fields — better
 *                       than aria-required="false" which some screen
 *                       readers misread.
 *   aria-invalid        Announces "invalid entry" after the label when
 *                       the field has a validation error. Omitted when
 *                       valid — same rationale.
 *   aria-describedby    Points at the error message's element ID so
 *                       screen readers read the error after the label.
 *                       Convention: `${id}-err`. Omitted when no error,
 *                       so screen readers don't try to read a missing
 *                       element.
 *
 * Pair it with an error span that uses `errorAriaId(id)` for its id
 * AND `role="alert"` so the message is announced dynamically when it
 * first appears (e.g. after a failed submit).
 *
 * Usage:
 *
 *   <input
 *     {...fieldAria({ id: "vf-name", required: true,
 *                     hasError: hasError("name") })}
 *     type="text"
 *     {...register("name")}
 *   />
 *   {fieldError("name") && (
 *     <span id={errorAriaId("vf-name")} role="alert" className="field-msg">
 *       {fieldError("name")}
 *     </span>
 *   )}
 */

export function fieldAria(opts: {
  id: string;
  required?: boolean;
  hasError: boolean;
}): {
  id: string;
  "aria-required"?: true;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
} {
  return {
    id: opts.id,
    "aria-required": opts.required ? true : undefined,
    "aria-invalid": opts.hasError ? true : undefined,
    "aria-describedby": opts.hasError ? `${opts.id}-err` : undefined,
  };
}

/** Element id convention for the error message span paired with a field. */
export function errorAriaId(fieldId: string): string {
  return `${fieldId}-err`;
}

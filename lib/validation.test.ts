import { describe, it, expect } from "vitest";
import {
  applyFormSchema,
  alumniContactRequestSchema,
  applyDefaults,
  ALUMNI_REQUEST_PURPOSES,
} from "./validation";

/**
 * These schemas are the gate on every enquiry the site takes. A rule that is
 * too strict silently loses a real prospect; one that is too loose lets junk
 * into the admissions inbox. Both failures are quiet, so they are worth
 * pinning down.
 */
const validApply = {
  ...applyDefaults,
  formType: "apply" as const,
  name: "Ramesh Kumar Yadav",
  phone: "9415202879",
  branch: "Civil Engineering",
  visit: "no" as const,
  consent: true,
};

describe("applyFormSchema", () => {
  it("accepts a minimal, realistic enquiry", () => {
    expect(applyFormSchema.safeParse(validApply).success).toBe(true);
  });

  it("accepts every live mobile series, including numbers beginning 91", () => {
    for (const phone of ["9415202879", "9174567890", "9198646464", "8000000000", "7000000000", "6000000000"]) {
      const r = applyFormSchema.safeParse({ ...validApply, phone });
      expect(r.success, `${phone} should be accepted`).toBe(true);
    }
  });

  it("rejects phone numbers that are not 10 digits starting 6-9", () => {
    for (const phone of ["941520287", "94152028791", "5415202879", "0415202879", ""]) {
      const r = applyFormSchema.safeParse({ ...validApply, phone });
      expect(r.success, `${phone || "(empty)"} should be rejected`).toBe(false);
    }
  });

  it("accepts Indian names with spaces, dots and apostrophes", () => {
    for (const name of ["Ramesh Kumar", "R. K. Yadav", "D'Souza", "Aarav Singh-Rathore"]) {
      const r = applyFormSchema.safeParse({ ...validApply, name });
      expect(r.success, `${name} should be accepted`).toBe(true);
    }
  });

  it("rejects a name that is too short or numeric", () => {
    expect(applyFormSchema.safeParse({ ...validApply, name: "R" }).success).toBe(false);
    expect(applyFormSchema.safeParse({ ...validApply, name: "12345" }).success).toBe(false);
  });

  it("treats email as optional but validates it when present", () => {
    expect(applyFormSchema.safeParse({ ...validApply, email: "" }).success).toBe(true);
    expect(applyFormSchema.safeParse({ ...validApply, email: "a@b.co" }).success).toBe(true);
    expect(applyFormSchema.safeParse({ ...validApply, email: "not-an-email" }).success).toBe(false);
  });

  it("does not require category or board, which were made optional to stop drop-off", () => {
    const { category, board, ...withoutOptionals } = validApply as Record<string, unknown>;
    void category; void board;
    expect(applyFormSchema.safeParse(withoutOptionals).success).toBe(true);
  });
});

describe("alumniContactRequestSchema", () => {
  const validAlumni = {
    formType: "alumni-contact" as const,
    alumniId: 42,
    alumniName: "Rajan",
    name: "Ramesh Kumar",
    phone: "9415202879",
    purpose: ALUMNI_REQUEST_PURPOSES[0],
    consent: true,
  };

  it("accepts a request naming a known purpose", () => {
    const r = alumniContactRequestSchema.safeParse(validAlumni);
    expect(r.success, JSON.stringify(r.success ? {} : r.error.issues)).toBe(true);
  });

  it("requires a purpose to be chosen", () => {
    const { purpose, ...noPurpose } = validAlumni as Record<string, unknown>;
    void purpose;
    expect(alumniContactRequestSchema.safeParse(noPurpose).success).toBe(false);
  });

  it("rejects a purpose outside the offered list", () => {
    const r = alumniContactRequestSchema.safeParse({ ...validAlumni, purpose: "Something else" });
    expect(r.success).toBe(false);
  });
});

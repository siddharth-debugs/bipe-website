import { describe, it, expect } from "vitest";
import { normalisePhone, buildLeadGroups, statusBucket } from "./leads";
import type { AnyRow, LeadGroup } from "./leads";

const row = (over: Partial<AnyRow> & { id: number }): AnyRow =>
  ({
    kind: "enquiry",
    name: "Test",
    phone: "9415202879",
    email: "",
    branch: "",
    created_at: "2026-09-01T10:00:00Z",
    ...over,
  }) as AnyRow;

describe("normalisePhone", () => {
  it("keeps the last 10 digits, so prefixed and bare forms group together", () => {
    expect(normalisePhone("9415202879")).toBe("9415202879");
    expect(normalisePhone("919415202879")).toBe("9415202879");
    expect(normalisePhone("+91 94152-02879")).toBe("9415202879");
  });

  it("does not truncate a 10-digit number that begins 91", () => {
    // Same class of bug as lib/crm-forward.ts: 9174/9198/9199 are live series.
    expect(normalisePhone("9174567890")).toBe("9174567890");
  });

  it("is safe on absent input", () => {
    expect(normalisePhone("")).toBe("");
    expect(normalisePhone(null)).toBe("");
    expect(normalisePhone(undefined)).toBe("");
  });
});

describe("buildLeadGroups", () => {
  it("groups submissions from one person even when the phone is written differently", () => {
    const groups = buildLeadGroups([
      row({ id: 1, phone: "9415202879", kind: "enquiry" }),
      row({ id: 2, phone: "+91 94152 02879", kind: "apply" }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].kindCounts.enquiry).toBe(1);
    expect(groups[0].kindCounts.apply).toBe(1);
  });

  it("keeps different people apart", () => {
    const groups = buildLeadGroups([
      row({ id: 1, phone: "9415202879" }),
      row({ id: 2, phone: "9174567890" }),
    ]);
    expect(groups).toHaveLength(2);
  });

  it("does not merge unrelated submissions that have no usable phone", () => {
    // The fallback key must stay per-row, or every phone-less submission
    // would collapse into a single fake prospect.
    const groups = buildLeadGroups([
      row({ id: 1, phone: "", name: "First" }),
      row({ id: 2, phone: "", name: "Second" }),
    ]);
    expect(groups).toHaveLength(2);
  });

  it("orders each group newest first", () => {
    const groups = buildLeadGroups([
      row({ id: 1, created_at: "2026-01-01T00:00:00Z" }),
      row({ id: 2, created_at: "2026-09-01T00:00:00Z" }),
    ]);
    expect(groups[0].rows.map((r) => r.id)).toEqual([2, 1]);
  });
});

describe("statusBucket", () => {
  const g = (status: string) => ({ status }) as unknown as LeadGroup;

  it("maps an explicit status to its own bucket", () => {
    expect(statusBucket(g("in_progress"))).toBe("in_progress");
    expect(statusBucket(g("closed_win"))).toBe("closed_win");
    expect(statusBucket(g("closed_loss"))).toBe("closed_loss");
    expect(statusBucket(g("spam"))).toBe("spam");
  });

  it("treats anything else as new, including an empty status", () => {
    expect(statusBucket(g(""))).toBe("new");
    expect(statusBucket(g("something_unknown"))).toBe("new");
  });
});

import { describe, it, expect } from "vitest";
import { normaliseCrmPhone, isDeliverableMobile, readCrmAck } from "./crm-forward";

/**
 * These exist because of a real incident, not for coverage.
 *
 * The phone was normalised with `.replace(/^91/, "")` applied unconditionally,
 * so a valid 10-digit mobile that merely BEGINS 91 lost its first two digits,
 * failed the 10-digit check, and the lead was rejected as invalid_phone. It
 * never reached the CRM, and because the CRM forward is what fires the
 * visitor's WhatsApp acknowledgement, the student was never contacted — while
 * still seeing a success screen and a reference number.
 *
 * The 9174 / 9198 / 9199 series are live Indian mobile prefixes, so this was
 * not a theoretical case. The first block below is the regression guard.
 */
describe("normaliseCrmPhone", () => {
  it("keeps a valid 10-digit mobile that begins 91 intact", () => {
    // The exact shape of the bug: these must NOT lose their leading 91.
    expect(normaliseCrmPhone("9174567890")).toBe("9174567890");
    expect(normaliseCrmPhone("9198646464")).toBe("9198646464");
    expect(normaliseCrmPhone("9199123456")).toBe("9199123456");
  });

  it("strips a country code only when the length says there is one", () => {
    expect(normaliseCrmPhone("919415202879")).toBe("9415202879"); // 12 digits
    expect(normaliseCrmPhone("+91 94152 02879")).toBe("9415202879");
    expect(normaliseCrmPhone("0091-9415202879")).toBe("9415202879");
  });

  it("drops separators and other non-digits", () => {
    expect(normaliseCrmPhone("94152-02879")).toBe("9415202879");
    expect(normaliseCrmPhone(" (94152) 02879 ")).toBe("9415202879");
  });

  it("returns an empty string for absent input rather than throwing", () => {
    expect(normaliseCrmPhone("")).toBe("");
    expect(normaliseCrmPhone(null)).toBe("");
    expect(normaliseCrmPhone(undefined)).toBe("");
  });

  it("leaves a short number short, so the caller can reject it", () => {
    expect(normaliseCrmPhone("12345")).toBe("12345");
  });
});

describe("isDeliverableMobile", () => {
  it("accepts 10 digits starting 6-9, including the 91 series", () => {
    for (const p of ["9415202879", "9174567890", "8000000000", "7000000000", "6000000000"]) {
      expect(isDeliverableMobile(p), p).toBe(true);
    }
  });

  it("rejects the wrong length", () => {
    expect(isDeliverableMobile("941520287")).toBe(false);  // 9 — the old bug's output shape
    expect(isDeliverableMobile("94152028791")).toBe(false); // 11
    expect(isDeliverableMobile("")).toBe(false);
  });

  it("rejects a first digit that is not a mobile prefix", () => {
    expect(isDeliverableMobile("5415202879")).toBe(false);
    expect(isDeliverableMobile("0415202879")).toBe(false);
  });

  it("does not throw on an empty string (phone[0] is undefined)", () => {
    expect(() => isDeliverableMobile("")).not.toThrow();
  });
});

/**
 * The second way a lead can vanish without anyone noticing.
 *
 * Sampark's webhook answers HTTP 200 for BOTH outcomes: a lead it ingested,
 * and a lead it declined ({success: true, skipped: true, reason: "..."}). The
 * site used to return {ok: true} on any 2xx without reading the body, so a
 * declined lead was recorded as a delivered one — no consultant would ever see
 * it, and the visitor would get no WhatsApp, because the CRM sends that ack on
 * ingest.
 *
 * Contract mirrored from BiteLeadWebhookView in the CRM repo,
 * integrations/bite_leads/views.py.
 */
describe("readCrmAck", () => {
  it("treats a skipped lead as NOT delivered", () => {
    const v = readCrmAck({ success: true, skipped: true, reason: "invalid_phone" });
    expect(v.delivered).toBe(false);
    if (!v.delivered) expect(v.reason).toBe("crm_skipped_invalid_phone");
  });

  it("still reports a skip that gives no reason", () => {
    const v = readCrmAck({ success: true, skipped: true });
    expect(v.delivered).toBe(false);
    if (!v.delivered) expect(v.reason).toBe("crm_skipped_unspecified");
  });

  it("carries the CRM's own confirmation through on delivery", () => {
    const v = readCrmAck({
      success: true,
      inquiry_code: "SMP-2026-0912",
      created: true,
      assigned_consultant_id: 7,
    });
    expect(v.delivered).toBe(true);
    if (v.delivered) {
      expect(v.inquiryCode).toBe("SMP-2026-0912");
      expect(v.created).toBe(true);
      expect(v.assignedConsultantId).toBe(7);
    }
  });

  it("reports an unassigned lead as delivered, not failed", () => {
    // Colleges running in POOL mode land leads unassigned on purpose (ADR
    // 0007) — consultants claim them. That is delivery, not a failure.
    const v = readCrmAck({ success: true, inquiry_code: "SMP-1", assigned_consultant_id: null });
    expect(v.delivered).toBe(true);
    if (v.delivered) expect(v.assignedConsultantId).toBeNull();
  });

  it("believes a 2xx whose body is missing or unparseable", () => {
    // Only an explicit skipped:true means "not taken". Disbelieving a bare 2xx
    // would fire the alarm on every lead.
    for (const ack of [null, {}, { success: true }]) {
      expect(readCrmAck(ack).delivered, JSON.stringify(ack)).toBe(true);
    }
  });
});

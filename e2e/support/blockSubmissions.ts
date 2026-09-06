import type { Page } from "@playwright/test";

/**
 * Make it impossible for a test to create a real lead.
 *
 * Both forms POST to /api/submit, which writes to the backend, creates a
 * Sampark CRM lead and fires a WhatsApp acknowledgement to the visitor. A test
 * that submitted for real would put fake prospects in front of the admissions
 * team — the exact mess the inbox's spam/test toggle exists to clear up.
 *
 * Two layers, deliberately:
 *   1. /api/submit is fulfilled locally with the success shape the forms
 *      expect, so the success path can still be exercised.
 *   2. every other non-local request is aborted, so nothing can reach the
 *      backend, the CRM, the WhatsApp sender or any analytics host even if a
 *      future change adds a call. It also makes the tests hermetic and fast.
 *
 * Returns a counter so a spec can assert the submission actually happened
 * (apply) or definitely did not (alumni, which never submits).
 */
export async function blockSubmissions(page: Page) {
  let submitCount = 0;

  await page.route("**/api/submit", async (route) => {
    submitCount += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      // The shape ApplyView/AlumniContactRequestForm read back: { ok, id }.
      body: JSON.stringify({ ok: true, id: 999999 }),
    });
  });

  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url) || url.startsWith("data:")) {
      return route.fallback();
    }
    return route.abort();
  });

  return { submitCount: () => submitCount };
}

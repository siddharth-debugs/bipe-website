import { test, expect } from "@playwright/test";

/**
 * The dashboard shell must not wait for /auth/me/ before it draws.
 *
 * It used to: the layout returned a bare skeleton until the permission check
 * came back, which also meant the page inside had not mounted and so had not
 * started loading its own data — two waits back to back, both spent staring
 * at a blank screen (Sep 2026 performance audit, finding F2).
 *
 * These tests hold /auth/me/ open and assert what is on screen while it is
 * still in flight. Against the old layout the first one fails: with `ready`
 * false, nothing but the skeleton existed to find.
 *
 * SAFETY: as with the form specs, every request that is not the local server
 * is aborted, and every /api/admin/ call is answered locally. Nothing reaches
 * the real Django backend, so no test can read or write live admissions data.
 */

/** How long /auth/me/ is held open. Long enough that a layout which waited
 *  for it could not possibly have painted inside the assertion timeout. */
const ME_DELAY_MS = 4000;

test.beforeEach(async ({ page }) => {
  // A token has to be present before the app's first render, or the layout
  // correctly bounces us to the login screen.
  await page.addInitScript(() => {
    localStorage.setItem("bipe.access", "e2e-fake-access-token");
    localStorage.setItem("bipe.refresh", "e2e-fake-refresh-token");
  });

  // Registration order matters and is the reverse of what it looks like:
  // Playwright checks the MOST RECENTLY registered route first. So the broad
  // handlers go in before the narrow ones that must win. Getting this
  // backwards is silent — the catch-all answers /auth/me/ with the wrong
  // shape, the delay never happens, and the tests below pass against a
  // layout that still blocks.

  // Least specific: everything the dashboard asks for comes back empty and
  // instantly, so pages render their zero states rather than an error.
  await page.route("**/api/admin/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0, next: null, previous: null, results: [] }),
    });
  });

  // More specific, so registered later: hold the permission check open.
  await page.route("**/api/admin/auth/me/**", async (route) => {
    await new Promise((r) => setTimeout(r, ME_DELAY_MS));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        phone: "9000000001",
        name: "E2E Operator",
        email: "",
        is_staff: true,
        is_superuser: true,
        last_login: null,
        roles: [],
        permissions: ["*"],
      }),
    });
  });

  // Highest priority, but it defers: local requests fall through to the two
  // handlers above; anything else is aborted so no test can reach the real
  // backend, the CRM or an analytics host.
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url) || url.startsWith("data:")) {
      return route.fallback();
    }
    return route.abort();
  });
});

test.describe("/admin/dashboard — shell rendering", () => {
  test("draws the sidebar while the permission check is still in flight", async ({ page }) => {
    await page.goto("/admin/dashboard");

    // Both of these are in the shell and depend on no data at all. They must
    // be on screen well before ME_DELAY_MS is up.
    await expect(page.getByText("BIPE · Admin")).toBeVisible({ timeout: 2500 });
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible({ timeout: 2500 });
  });

  test("reveals the permission-gated links only once the check returns", async ({ page }) => {
    await page.goto("/admin/dashboard");

    // Inbox is gated on submission permissions, so it stays hidden until the
    // answer lands. This is what makes drawing early safe.
    await expect(page.getByRole("link", { name: "Inbox" })).toBeHidden({ timeout: 2500 });
    await expect(page.getByRole("link", { name: "Inbox" })).toBeVisible({
      timeout: ME_DELAY_MS + 6000,
    });
  });
});

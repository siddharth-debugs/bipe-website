import { test, expect } from "@playwright/test";
import { blockSubmissions } from "./support/blockSubmissions";

/**
 * /apply is the site's main admissions enquiry form.
 *
 * The greeting on the confirmation screen ("Got it, Ramesh.") is rendered from
 * a live read of the name field. That read was changed on 6 Sep 2026 from
 * react-hook-form's watch() to useWatch() so the React Compiler would stop
 * skipping this component — a change nothing automated could verify at the
 * time. This is that verification.
 */
test.describe("/apply — admissions enquiry", () => {
  test("submits and greets the applicant by their first name", async ({ page }) => {
    const guard = await blockSubmissions(page);

    await page.goto("/apply");
    await page.fill("#name", "Ramesh Kumar Yadav");
    await page.fill("#phone", "9415202879");
    // Branch is the one required choice; the control carries no name/id.
    await page.locator("select").first().selectOption("Civil Engineering");

    await page.getByRole("button", { name: "Send my details" }).click();

    await expect(page.getByText(/Enquiry received/i)).toBeVisible();
    // The whole point: the first name, not the full name and not "friend".
    await expect(page.getByText(/Got it,\s*Ramesh\./)).toBeVisible();

    expect(guard.submitCount(), "the form should have posted exactly once").toBe(1);
  });

  test("keeps the applicant on the form when the phone number is invalid", async ({ page }) => {
    const guard = await blockSubmissions(page);

    await page.goto("/apply");
    await page.fill("#name", "Ramesh Kumar Yadav");
    await page.fill("#phone", "12345");             // too short, wrong first digit
    await page.locator("select").first().selectOption("Civil Engineering");

    await page.getByRole("button", { name: "Send my details" }).click();

    // Nothing should be sent, and the confirmation must not appear.
    await expect(page.getByText(/Enquiry received/i)).toHaveCount(0);
    expect(guard.submitCount(), "an invalid phone must not reach the backend").toBe(0);
  });

  test("accepts a 10-digit mobile that begins 91", async ({ page }) => {
    // The series that a normalisation bug used to truncate and reject,
    // losing the lead silently. Guarded in the unit suite too; this proves
    // it survives the whole browser path.
    const guard = await blockSubmissions(page);

    await page.goto("/apply");
    await page.fill("#name", "Sunita Devi");
    await page.fill("#phone", "9174567890");
    await page.locator("select").first().selectOption("Civil Engineering");

    await page.getByRole("button", { name: "Send my details" }).click();

    await expect(page.getByText(/Enquiry received/i)).toBeVisible();
    expect(guard.submitCount()).toBe(1);
  });
});

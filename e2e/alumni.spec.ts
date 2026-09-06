import { test, expect } from "@playwright/test";
import { blockSubmissions } from "./support/blockSubmissions";

/**
 * The /alumni "Request introduction" modal.
 *
 * Two behaviours are load-bearing and both changed on 6 Sep 2026:
 *   - choosing a purpose reveals the note field (a live read of the purpose
 *     field, moved from watch() to useWatch())
 *   - dismissing the modal clears its state, which moved out of an effect and
 *     into render
 *
 * Neither is covered by the unit suite, and both are invisible until someone
 * actually opens the dialog.
 */
type Page = import("@playwright/test").Page;

/**
 * Target the modal by its accessible name, not by role alone: the mobile nav
 * drawer also carries role="dialog" and lives in the DOM permanently (hidden),
 * so a bare [role="dialog"] matches two elements and Playwright refuses to
 * guess between them.
 */
const dialog = (page: Page) => page.getByRole("dialog", { name: /Talk to/i });

const openModal = async (page: Page) => {
  const trigger = page.getByRole("button", { name: /request introduction/i }).first();
  // The cards are far down a long list — without this the click lands nowhere.
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(dialog(page)).toBeVisible();
};

const noteField = (page: Page) =>
  dialog(page).locator('textarea, input[name="purposeNote"]');

test.describe("/alumni — introduction request modal", () => {
  test("choosing a purpose reveals the note field", async ({ page }) => {
    const guard = await blockSubmissions(page);
    await page.goto("/alumni");
    await openModal(page);

    await expect(noteField(page), "no note field before a purpose is chosen").toHaveCount(0);

    // The chips are rendered as text, not as accessible buttons by name.
    await dialog(page).getByText("Career mentorship", { exact: true }).click();

    await expect(noteField(page), "choosing a purpose should reveal the note").toHaveCount(1);
    expect(guard.submitCount(), "opening the modal must not submit anything").toBe(0);
  });

  /**
   * Honest note on what this does and does not guard.
   *
   * It asserts a real user-facing property: reopen the modal and you get a
   * clean form, never the previous visitor's answers. But TODAY that is
   * guaranteed structurally rather than by the component — AlumniView renders
   * the modal as `{requestedAlumni && <AlumniContactRequestModal …/>}`, so
   * closing it unmounts the component and React discards the state. Deleting
   * the component's own dismiss-reset does NOT make this test fail; verified
   * by doing exactly that.
   *
   * It is kept because it guards the WIRING, which is the thing that would
   * actually break: if someone changes AlumniView to keep the modal mounted
   * (for an exit animation, say) and the reset is not working, this catches
   * the leak. It is not a test of the reset code in isolation.
   */
  test("reopening the modal always starts from a clean form", async ({ page }) => {
    const guard = await blockSubmissions(page);
    await page.goto("/alumni");
    await openModal(page);

    await dialog(page).getByText("Career mentorship", { exact: true }).click();
    await expect(noteField(page)).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();

    await openModal(page);
    // If the reset regressed, the previous session's purpose would still be
    // selected and the note field would still be showing.
    await expect(noteField(page), "reopening should start from a clean form").toHaveCount(0);
    expect(guard.submitCount()).toBe(0);
  });
});

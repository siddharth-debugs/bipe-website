import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests for the two live lead-capture forms.
 *
 * These exist because the unit suite cannot answer the question that actually
 * matters here: does the form still work when a person uses it? Nothing in
 * `npm test` opens a page, and the React Compiler change of 6 Sep 2026 altered
 * what these two components compile to — verified once by hand, which does not
 * repeat. This is that check, automated.
 *
 * SAFETY: every spec calls blockSubmissions() from e2e/support/. The forms post
 * to /api/submit, which forwards to the backend, creates a Sampark CRM lead and
 * fires a WhatsApp message to the visitor. A test that submitted for real would
 * manufacture fake prospects in the admissions inbox — exactly the mess the
 * spam/test toggle exists to clean up. Requests to anything that is not the
 * local server are aborted outright, so a test cannot reach production even by
 * mistake.
 */
const PORT = Number(process.env.E2E_PORT ?? 3210);

export default defineConfig({
  testDir: "./e2e",
  // Slow CI runners need the headroom; locally these finish in seconds.
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // A stray .only would silently shrink the suite to one test in CI.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    // A production build, not `next dev`: the compiler output this is meant to
    // exercise is what `next build` produces. Run `npm run build` first, or use
    // `npm run test:e2e`, which does it for you.
    command: "npm run start",
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PORT: String(PORT),
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dg8sty5ej",
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "bipe_admin",
    },
  },
});

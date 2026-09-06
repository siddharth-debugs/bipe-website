import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests for the pure logic in lib/.
 *
 * Scope is deliberate: these cover functions that take inputs and return
 * outputs with no network, no browser and no React. That is where this
 * repo's costly bugs have actually lived -- a phone number normalised
 * wrongly dropped real leads silently for weeks -- and it is the part that
 * can be tested fast enough to run on every push without anyone minding.
 *
 * Component and end-to-end coverage are NOT here yet. See TESTING.md.
 */
export default defineConfig({
  resolve: {
    // Mirror the "@/*" path alias from tsconfig.json.
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
});

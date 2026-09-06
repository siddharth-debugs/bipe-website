import next from "eslint-config-next/core-web-vitals";

/**
 * ESLint flat config.
 *
 * Why this file exists: until Next 16 the `lint` script ran `next lint`,
 * which scaffolded and owned the ESLint setup itself — there was no
 * config file in the repo. Next 16 removed the `next lint` subcommand
 * (it now parses `lint` as a directory argument, so `npm run lint`
 * failed with "Invalid project directory provided, no such directory:
 * .../lint"). The upstream migration is to run the ESLint CLI directly
 * against a flat config, which is what this is.
 *
 * `eslint-config-next/core-web-vitals` bundles the same three configs
 * `next lint` used to apply: `next`, `next/typescript`, and
 * `next/core-web-vitals`.
 *
 * Still opt-in, deliberately: .github/workflows/ci.yml runs typecheck +
 * build only, and notes that ESLint is held back by a backlog of legacy
 * warnings. This change restores a working `npm run lint` so that
 * backlog can be worked through; it does not add ESLint to CI.
 */
const config = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...next,
];

export default config;

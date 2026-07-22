#!/usr/bin/env node

/**
 * `npm create revturbine@latest` — a pure launcher over `revturbine init`.
 *
 * The scaffold logic lives in @revturbine/cli, not here. This package exists
 * only because `npm create <name>` resolves the *package* `create-<name>` and
 * never consults `bin` entries on other packages — so a package by this name
 * has to exist. It carries no logic and, deliberately, **no `@revturbine/cli`
 * dependency**.
 *
 * Instead it runs the newest published CLI at run time via `npx …@latest`, so a
 * CLI release reaches `npm create revturbine@latest` immediately and this
 * package **never needs republishing** for any CLI version (plan 142 REQ-2,
 * resolved to a runtime launcher 2026-07-22).
 *
 * Trade-off owned deliberately (Kent): "always latest" adopts even a breaking
 * CLI major with no gate *here* — the CLI's own release process is the gate.
 * The upside is that `create-revturbine` is genuinely write-once after this.
 */

import { spawnSync } from 'node:child_process';

// Everything after `npm create revturbine` is forwarded verbatim to `init`, so
// --dir / --no-skills / --dry-run and anything the CLI grows later just work.
const result = spawnSync(
  'npx',
  ['--yes', '@revturbine/cli@latest', 'init', ...process.argv.slice(2)],
  // shell: true so Windows resolves npx.cmd. The argv is a fixed command plus
  // the user's own flags forwarded through — no interpolation of untrusted
  // strings into a shell string.
  { stdio: 'inherit', shell: true },
);

if (result.error) {
  console.error(`[create-revturbine] could not run the RevTurbine CLI: ${result.error.message}`);
  console.error('  Install it directly instead:  npm install -D @revturbine/cli && npx revturbine init');
  process.exit(1);
}
process.exit(result.status ?? 1);

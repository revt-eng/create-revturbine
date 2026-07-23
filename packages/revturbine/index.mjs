#!/usr/bin/env node

/**
 * `npx revturbine <command>` — the cold-start launcher for the RevTurbine CLI.
 *
 * `revturbine` (unscoped) is the public front door; the real tool is
 * `@revturbine/cli` (scoped), which `npx revturbine` cannot resolve from the
 * bare name. This package forwards every command to the newest published CLI at
 * run time, so `npx revturbine create` — the builder starting point — works on a
 * clean machine with nothing installed, and this launcher never needs
 * republishing for any CLI change.
 *
 * Inside a repo that pins `@revturbine/cli`, npx/PATH resolves the local
 * `node_modules/.bin/revturbine` (the pinned CLI) BEFORE this launcher, so a pin
 * still wins. And the latest CLI this launcher runs performs its own
 * self-delegation to a repo pin, so the pin wins through this path too.
 *
 * It carries no logic and, deliberately, no `@revturbine/cli` dependency.
 */

import { spawnSync } from 'node:child_process';

// Forward every argument verbatim: `npx revturbine create --dir foo` becomes
// `@revturbine/cli@latest create --dir foo`. `create` resolves to the CLI's
// `init` command via its alias.
const result = spawnSync(
  'npx',
  ['--yes', '@revturbine/cli@latest', ...process.argv.slice(2)],
  // shell: true so Windows resolves npx.cmd. Argv is a fixed command plus the
  // user's own forwarded flags — no interpolation of untrusted strings.
  { stdio: 'inherit', shell: true },
);

if (result.error) {
  console.error(`[revturbine] could not run the RevTurbine CLI: ${result.error.message}`);
  console.error('  Install it directly instead:  npm install -D @revturbine/cli && npx revturbine --help');
  process.exit(1);
}
process.exit(result.status ?? 1);

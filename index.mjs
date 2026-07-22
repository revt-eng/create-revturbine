#!/usr/bin/env node

/**
 * `npm create revturbine@latest` — a thin shim over `revturbine init`.
 *
 * The scaffold logic lives in @revturbine/cli, NOT here (plan 142 REQ-1).
 * `npm create <name>` resolves the PACKAGE `create-<name>` and never consults
 * `bin` entries on other packages, so this package has to exist — but there is
 * no reason for it to carry a second copy of the logic. Both entry points run
 * the same code:
 *
 *   npm create revturbine@latest   → this shim → revturbine init
 *   pnpm exec revturbine init      → revturbine init
 *
 * The dependency on @revturbine/cli is a CARET on purpose (REQ-2): it resolves
 * the newest matching CLI at run time, so scaffold improvements ship through
 * ordinary CLI releases and this package is effectively write-once. Pinning it
 * exactly would silently reintroduce lockstep releases across two packages.
 */

import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const require = createRequire(import.meta.url);

let entry;
try {
  const manifestPath = require.resolve('@revturbine/cli/package.json');
  const manifest = require('@revturbine/cli/package.json');
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.revturbine;
  if (!bin) throw new Error('@revturbine/cli declares no `revturbine` bin');
  entry = path.resolve(path.dirname(manifestPath), bin);
} catch (err) {
  console.error(`[create-revturbine] could not resolve @revturbine/cli: ${err?.message ?? err}`);
  console.error('  Install it directly instead:  npm install -D @revturbine/cli && npx revturbine init');
  process.exit(1);
}

// Forward every argument through, so `--dir`, `--no-skills`, `--dry-run` and
// anything the CLI grows later work without a change here.
const result = spawnSync(process.execPath, [entry, 'init', ...process.argv.slice(2)], {
  stdio: 'inherit',
});

if (result.error) {
  console.error(`[create-revturbine] could not run the RevTurbine CLI: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);

#!/usr/bin/env node

/**
 * Assert the @revturbine/cli dependency range spans **pre-1.0 minors** (plan
 * 142 REQ-2).
 *
 * This is what makes the shim write-once: CLI minor releases must reach
 * `npm create revturbine@latest` without republishing this package. The subtle
 * trap this guards — and the bug that shipped in 0.1.0 — is that **a caret on a
 * 0.x version does NOT span minors**: npm reads `^0.8.0` as `>=0.8.0 <0.9.0`, so
 * it silently froze the shim at 0.8.x and never picked up 0.9.0. `~` caps even
 * tighter. Both are rejected here; the range must be an explicit `>=X.Y.Z <1`
 * that runs up to the deliberate 1.0 breaking milestone.
 *
 * (This is the OPPOSITE of what the scaffold installs into a user's repo, where
 * @revturbine/cli is pinned EXACTLY — the CLI's bundled schema snapshot makes
 * compatibility a per-repo property that belongs in a lockfile.)
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const range = pkg.dependencies?.['@revturbine/cli'];

function fail(msg) {
  console.error(`[check-range] ${msg}`);
  console.error('  The @revturbine/cli range must be an explicit `>=X.Y.Z <1` so CLI minor');
  console.error('  releases reach `npm create revturbine` without republishing this shim.');
  console.error('  A `^0.x` caret does NOT do this — for 0.x, `^0.8.0` means `>=0.8.0 <0.9.0`.');
  process.exit(1);
}

if (!range) fail('@revturbine/cli is not a dependency — the shim cannot delegate.');
if (range.startsWith('^') || range.startsWith('~')) {
  fail(`@revturbine/cli is "${range}" — a caret/tilde on a 0.x version caps at the next minor.`);
}
if (!/>=\s*\d+\.\d+\.\d+/.test(range) || !/<\s*1(\.0\.0)?/.test(range)) {
  fail(`@revturbine/cli is "${range}" — expected a lower bound (>=X.Y.Z) and an upper bound (<1).`);
}
console.log(`[check-range] @revturbine/cli is "${range}" — spans pre-1.0 minors, as required.`);

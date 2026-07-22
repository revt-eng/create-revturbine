#!/usr/bin/env node

/**
 * Assert the @revturbine/cli dependency stays a CARET range (plan 142 REQ-2).
 *
 * This is the property that makes the shim write-once: a caret resolves the
 * newest matching CLI at run time, so scaffold improvements reach
 * `npm create revturbine@latest` through ordinary CLI releases. Pinning it
 * exactly reintroduces lockstep releases across two packages — a quiet
 * regression that nothing else would catch, which is why it is gated here.
 *
 * Note this is the OPPOSITE of what the scaffold installs into a user's repo:
 * there, @revturbine/cli is pinned EXACTLY, because the CLI's bundled schema
 * snapshot makes compatibility a per-repo property that belongs in a lockfile.
 * Two rules, opposite directions, different subjects. Do not "unify" them.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const range = pkg.dependencies?.['@revturbine/cli'];

if (!range) {
  console.error('[check-caret] @revturbine/cli is not a dependency — the shim cannot delegate.');
  process.exit(1);
}
if (!range.startsWith('^')) {
  console.error(`[check-caret] @revturbine/cli must be a caret range, found "${range}".`);
  console.error('  A caret lets CLI releases reach `npm create revturbine@latest` without');
  console.error('  republishing this package. An exact pin means lockstep releases forever.');
  process.exit(1);
}
console.log(`[check-caret] @revturbine/cli is "${range}" — caret, as required.`);

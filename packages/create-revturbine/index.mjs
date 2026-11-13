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

// The @revturbine/cli dist-tag this launcher runs. A published release runs
// `latest`. A Release prerelease (.github/workflows/release-prerelease.yml,
// EP-1747 phase 5) stamps that Release's dist-tag, rl-<n>, here, so
// `npm create revturbine@rl-<n>` runs the Release's CLI as a developer would; a
// Release with no CLI prerelease has no such tag, and the launcher runs latest.
const CLI_TAG = 'latest';

function cliSpec() {
  if (CLI_TAG === 'latest') return '@revturbine/cli@latest';
  // A prerelease launcher says on stderr which CLI it runs, and why when it falls back.
  const probe = spawnSync('npm', ['view', `@revturbine/cli@${CLI_TAG}`, 'version'], { encoding: 'utf8', shell: true });
  const version = probe.status === 0 ? String(probe.stdout).trim() : '';
  if (version) {
    console.error(`[create-revturbine] Running @revturbine/cli@${CLI_TAG} (${version}), this Release's CLI.`);
    return `@revturbine/cli@${CLI_TAG}`;
  }
  const detail = String(probe.stderr || probe.error?.message || '').trim().split(/\r?\n/)[0];
  const why = /E404|No match found/.test(String(probe.stderr)) || probe.status === 0
    ? `@revturbine/cli has no ${CLI_TAG} dist-tag, so this Release has no CLI prerelease`
    : `npm view @revturbine/cli@${CLI_TAG} failed (${detail || `exit ${probe.status}`})`;
  console.error(`[create-revturbine] ${why}; running @revturbine/cli@latest instead.`);
  return '@revturbine/cli@latest';
}

// Everything after `npm create revturbine` is forwarded verbatim to `init`, so
// --dir / --no-skills / --dry-run and anything the CLI grows later just work.
const result = spawnSync(
  'npx',
  ['--yes', cliSpec(), 'init', ...process.argv.slice(2)],
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

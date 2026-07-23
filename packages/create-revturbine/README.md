# create-revturbine

Scaffold [RevTurbine](https://revturbine.com) into an app:

```bash
npm create revturbine@latest
```

It detects your package manager and stack, installs `@revturbine/sdk`, pins
`@revturbine/cli` into the repo, drops a starter Playbook that runs in local
mode with no account, and installs the Agent Skills — then points you at the
skill that walks the rest.

## This package is a launcher

The scaffold logic lives in **`@revturbine/cli`**, as `revturbine init`. This
package exists only because `npm create <name>` resolves the *package*
`create-<name>` and never consults `bin` entries on other packages — so a
package by this name has to exist. It carries no logic.

It also has **no `@revturbine/cli` dependency.** Instead it runs the newest
published CLI at run time:

```
npm create revturbine@latest  →  npx @revturbine/cli@latest init
```

Both entry points run the same scaffold:

| You run | What happens |
|---|---|
| `npm create revturbine@latest` | this launcher → `npx @revturbine/cli@latest init` |
| `npx revturbine init` | `revturbine init` (CLI already pinned in the repo) |

Use the second when the CLI is already pinned in the repo — adding RevTurbine to
another package in a monorepo, or re-running the scaffold later.

## Why `@latest` at run time, not a declared dependency

Fetching `@revturbine/cli@latest` on each run means a CLI release reaches
`npm create revturbine@latest` **immediately**, and this package **never needs
republishing** for any CLI version.

The alternative — a declared dependency range — always lags: it either pins (and
requires a republish per CLI release) or floats within a range (and stops at the
range's edge). An earlier version tried a caret and hit a trap: for a `0.x`
version npm reads `^0.8.0` as `>=0.8.0 <0.9.0`, so it silently froze at the
current minor and never picked up the CLI release that added the skills step. A
runtime `@latest` has no such edge.

The deliberate trade-off: `@latest` adopts even a **breaking CLI major** with no
gate here. The CLI's own release process is the gate. For a scaffold that runs
once per project, always-newest is the right default, and write-once is worth it.

Note this is the **opposite** of what the scaffold installs into *your* repo,
where `@revturbine/cli` is pinned **exactly** — the CLI bundles a
version-stamped schema snapshot, so CLI↔config compatibility is a property of
your repo and belongs in your lockfile.

## Releasing — manual, and rarely needed

Because the launcher fetches the CLI at run time, **this package should almost
never need republishing** — CLI improvements reach users without touching it.
When a release *is* needed (a change to the launcher itself), it is manual: the
automation secrets are unavailable to this public repo by design.

- `REVTURBINE_GIT_TOKEN` (which `auto-tag-release.yml` would use to push the tag)
  is an org secret with `visibility: private` — deliberately kept out of public
  repos, and this repo is public.
- There is no org-level `NPM_TOKEN`, so `release.yml` cannot publish here until
  someone adds a repo-level copy.

Both workflows are committed and correct; they simply skip. To cut a release by
hand:

```bash
# 1. bump the version in package.json, commit, merge to main
# 2. tag and push (match the new package.json version)
git tag vX.Y.Z && git push origin vX.Y.Z
# 3. publish (npm 2FA prompts for an OTP or browser approval)
npm publish --access public
```

## Links

- [Docs](https://revturbine.com/docs)
- [`@revturbine/sdk`](https://www.npmjs.com/package/@revturbine/sdk)
- [`@revturbine/cli`](https://www.npmjs.com/package/@revturbine/cli)

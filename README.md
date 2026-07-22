# create-revturbine

Scaffold [RevTurbine](https://revturbine.com) into an app:

```bash
npm create revturbine@latest
```

It detects your package manager and stack, installs `@revturbine/sdk`, pins
`@revturbine/cli` into the repo, drops a starter Playbook that runs in local
mode with no account, and installs the Agent Skills — then points you at the
skill that walks the rest.

## This package is a shim

The scaffold logic lives in **`@revturbine/cli`**, as `revturbine init`. This
package exists only because `npm create <name>` resolves the *package*
`create-<name>` and never consults `bin` entries on other packages — so a
package by this name has to exist. It does not carry a second copy of the logic.

Both entry points run the same code:

| You run | What happens |
|---|---|
| `npm create revturbine@latest` | this shim → `revturbine init` |
| `npx revturbine init` | `revturbine init` |

Use the second when the CLI is already pinned in the repo — adding RevTurbine to
another package in a monorepo, or re-running the scaffold later.

## Why the dependency is a caret

`@revturbine/cli` is depended on with a **caret range**, deliberately. That
resolves the newest matching CLI at run time, so scaffold improvements reach
`npm create revturbine@latest` through ordinary CLI releases and this package
almost never needs republishing. An exact pin would mean lockstep releases
across two packages. `npm run check:caret` gates it.

Note this is the **opposite** of what the scaffold installs into *your* repo,
where `@revturbine/cli` is pinned **exactly** — the CLI bundles a
version-stamped schema snapshot, so CLI↔config compatibility is a property of
your repo and belongs in your lockfile.

## Releasing — manual, on purpose

**This package is released by hand.** That is a decision, not a gap.

Because the caret range means CLI improvements reach users without republishing
this package, releases here are rare — so the automation is not worth widening a
credential's blast radius for. Concretely, both secrets that would automate it
are unavailable to this repo *by design*:

- `REVTURBINE_GIT_TOKEN` (which `auto-tag-release.yml` would use to push the tag)
  is an org secret with `visibility: private` — it is deliberately kept out of
  **public** repos, and this repo is public.
- There is no org-level `NPM_TOKEN`, so `release.yml` cannot publish here until
  someone adds a repo-level copy.

Both workflows are committed and correct; they simply skip. If releases ever
become frequent enough to be a friction point, granting those secrets turns the
process automatic with no code change.

To cut a release until then:

```bash
# 1. bump the version in package.json, commit, merge to main
# 2. tag and push
git tag v0.1.0 && git push origin v0.1.0
# 3. publish (npm 2FA prompts for an OTP or browser approval)
npm publish --access public
```

Run `npm run check:caret` first — it is what keeps the `@revturbine/cli`
dependency a caret, and nothing else would catch a pin.

## Links

- [Docs](https://revturbine.com/docs)
- [`@revturbine/sdk`](https://www.npmjs.com/package/@revturbine/sdk)
- [`@revturbine/cli`](https://www.npmjs.com/package/@revturbine/cli)

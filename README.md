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

## Links

- [Docs](https://revturbine.com/docs)
- [`@revturbine/sdk`](https://www.npmjs.com/package/@revturbine/sdk)
- [`@revturbine/cli`](https://www.npmjs.com/package/@revturbine/cli)

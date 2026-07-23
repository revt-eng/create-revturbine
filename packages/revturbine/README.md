# revturbine

The launcher for the [RevTurbine](https://revturbine.com) CLI. Scaffold RevTurbine
into an app from a clean machine:

```bash
npx revturbine create
```

`revturbine create` detects your package manager and stack, installs
`@revturbine/sdk`, pins `@revturbine/cli` into the repo, drops a starter Playbook
that runs in local mode with no account, and installs the Agent Skills — then
points you at the skill that walks the rest. Every other CLI command works too:

```bash
npx revturbine --help
npx revturbine login
npx revturbine validate ./revturbine.playbook.json
```

## This package is a launcher

`revturbine` (unscoped) is the public front door. The real tool is
**`@revturbine/cli`** (scoped) — which `npx revturbine` can't resolve from the
bare name. So this package forwards every command to the newest published CLI at
run time:

```
npx revturbine <command>  →  npx @revturbine/cli@latest <command>
```

It carries no logic and no `@revturbine/cli` dependency, so a CLI release reaches
`npx revturbine` immediately and this launcher never needs republishing.

Inside a repo that already pins `@revturbine/cli`, npx resolves the repo-local
`revturbine` (the pinned CLI) before this launcher — so a pinned version always
wins.

Prefer `revturbine init` / `revturbine create` once the CLI is pinned in your
repo (added RevTurbine to a monorepo package, or re-scaffolding).

## Links

- [Docs](https://revturbine.com/docs)
- [`@revturbine/cli`](https://www.npmjs.com/package/@revturbine/cli)
- [`@revturbine/sdk`](https://www.npmjs.com/package/@revturbine/sdk)

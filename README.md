# RevTurbine launchers

Two thin launcher packages that scaffold [RevTurbine](https://revturbine.com)
into an app. Both fetch the newest `@revturbine/cli` at run time and forward to
it, so a CLI release reaches users immediately and neither launcher needs
republishing for a CLI change.

| Package | Entry point | Runs |
|---|---|---|
| [`packages/create-revturbine`](packages/create-revturbine) | `npm create revturbine@latest` | `npx @revturbine/cli@latest init` |
| [`packages/revturbine`](packages/revturbine) | `npx revturbine create` | `npx @revturbine/cli@latest <command>` |

Both exist because npm resolves entry points by **package name**:
`npm create revturbine` needs a package literally named `create-revturbine`, and
`npx revturbine` needs one named `revturbine`. One npm package can't be both, so
they're two packages — kept in one repo because they're the same ~20-line
launcher.

The real tool is [`@revturbine/cli`](https://www.npmjs.com/package/@revturbine/cli)
(scoped); these are just the public front doors to it.

## Releasing

Both are runtime launchers, so releases are **rare** — a CLI change reaches users
without touching either. When a launcher itself changes: bump its
`packages/<name>/package.json` version, merge, and push any `v*` tag.
`release.yml` publishes every package whose version isn't already on npm.

## Links

- [Docs](https://revturbine.com/docs) · [`@revturbine/cli`](https://www.npmjs.com/package/@revturbine/cli) · [`@revturbine/sdk`](https://www.npmjs.com/package/@revturbine/sdk)

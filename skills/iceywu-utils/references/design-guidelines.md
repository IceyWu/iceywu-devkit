# Design Guidelines

## Dependency Policy

`@iceywu/utils` ships with **zero runtime dependencies**. Before adding any, exhaust these alternatives in order:

1. **Standard library** — can the task be done with built-in `Array` / `Object` / `Intl` / `URL` / `structuredClone`?
2. **Inline port** — if the library is small (< ~150 LOC of real logic), copy the minimal behavior into `src/<domain>/` with a header comment citing the upstream source and license. Examples: `src/lodash-lite/index.ts` (lodash@4 `cloneDeep`/`isEqualWith`/`nth`/`sortBy` ports), `src/tools/other.ts` (debounce@3 port).
3. **Subpath split** — if the functionality is large and optional, consider publishing it as a separate package (e.g. `@iceywu/utils-heavy`) instead of inflating the core.
4. Only then consider adding a `dependencies` entry, and document the reasoning in the changeset.

## Package Boundaries

- Keep utils pure and reusable across browser and Node.
- Do **not** place CLI orchestration, prompt flows, or filesystem side effects in this package — those belong in `packages/cli`.
- Favor utilities that both workspace packages and external users can consume.
- Browser-only APIs (DOM, `window`) are acceptable only in clearly-namespaced subpaths.

## Module Design

- Prefer small modules with predictable names.
- Preserve tree-shakeable named exports; no default-only exports from the public surface.
- Treat type exports as part of the supported public surface.
- Use explicit subpaths when a utility domain grows beyond the curated root entry.
- Each subpath's `index.ts` must re-export everything consumers should see; nothing reachable via deep relative import that isn't also reachable via the subpath entry.

## Change Rules

- Add new public utilities through `packages/utils/src/index.ts` (curated root) or a deliberate subpath.
- If a helper is only used by `@iceywu/cli`, keep it in `packages/cli` unless reuse value is clearly shown.
- Avoid stateful helpers unless state is intrinsic; when unavoidable, expose control handles (`clear`, `flush`, `trigger`, `isPending`).
- Name-aliases (`export const foo = bar`) are discouraged. Prefer one canonical name.
- Any removal or rename of a public export is a breaking change — author a changeset and include a migration-table row in `references/public-api.md`.

## Commands

```bash
pnpm --filter @iceywu/utils build
pnpm --filter @iceywu/utils test
pnpm --filter @iceywu/utils typecheck
pnpm --filter @iceywu/utils check:package
```

## Release Discipline

- Run `pnpm --filter @iceywu/utils check:package` before opening a release PR. It builds and runs `scripts/verify-exports.mjs` to guard the declared `package.json#exports` against the built `dist/`.
- Preserve the stable public surface across patch and minor releases. Pre-1.0 breaking changes bump minor (`0.x.y → 0.(x+1).0`).
- Every published change ships through `pnpm changeset`; lockfile + `CHANGELOG.md` + version bump stay in the same PR as the behavior change.

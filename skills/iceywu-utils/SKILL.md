---
name: iceywu-utils
description: IceyWu shared utility library (@iceywu/utils) — zero-runtime-dep TypeScript helpers with a curated root entry plus explicit module subpaths. Use when adding, removing, or reviewing helpers in packages/utils, deciding between root vs subpath exports, or evaluating lodash-alike replacements.
metadata:
  author: IceyWu
  version: "2026.5.4"
  source: packages/utils source tree and .changeset/zero-runtime-deps.md
---

# IceyWu Utils

> Use this skill when the task touches `packages/utils` source, public API surface, or dependency policy.

## Preferences

- Keep `@iceywu/utils` at **zero runtime dependencies**. If you think a third-party helper is needed, first try to inline a minimal port (see `lodash-lite/` for pattern).
- Prefer pure functions over stateful helpers; when state is intrinsic (e.g. `debounce`), expose control handles (`clear`, `flush`, `trigger`, `isPending`).
- Keep the root entry (`src/index.ts`) intentionally small. Large domains go behind explicit subpaths.
- Treat exported types as part of the product surface — breaking type shapes requires a changeset.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Public API Shape | Root exports, subpath map, deleted legacy exports, migration table | [public-api](./references/public-api.md) |
| Design Guidelines | Zero-dep policy, inlining rules, naming, tree-shaking, release discipline | [design-guidelines](./references/design-guidelines.md) |

## Quick Reference

### Package Context

```text
package:   @iceywu/utils
source:    packages/utils
consumers: workspace packages and external npm consumers
deps:      {} (zero runtime dependencies)
```

### Workspace Commands

```bash
pnpm --filter @iceywu/utils build         # tsup esm+cjs+dts, multi-entry
pnpm --filter @iceywu/utils test          # vitest run
pnpm --filter @iceywu/utils typecheck     # tsc --noEmit
pnpm --filter @iceywu/utils check:package # build + verify-exports.mjs
```

### Design Rules

```text
1. Add new public utilities through src/index.ts (curated) or a deliberate subpath entry.
2. Never add a third-party runtime dependency without first trying an inline port.
3. Prefer small, predictable modules. If a helper has <5 lines of JS-equivalent, consider not exporting it.
4. Keep CLI-only helpers in packages/cli unless reuse is obvious.
5. Any breaking API change requires a changeset under .changeset/ and a migration table update.
```

### Recent Decisions (2026.5.4)

- Removed runtime deps `lodash`, `@types/lodash`, `debounce`. All previously-external helpers (`cloneDeep`, `isEqualWith`, `nth`, `sortBy`, `fromPairs`, `toPairs`, `get`, `set`, `debounce`) are now inlined in TS with lodash@4 / debounce@3 behavior parity.
- Removed redundant public exports: `deepClone2`, `extend`, `setObjValue`, `getObjVal`, `arrayFirst`, `arrayLast`, `arraySlice`, `randomString`. See `references/public-api.md` for the full migration table.

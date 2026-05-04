# Public API

## Package Scope

- Package name: `@iceywu/utils`
- Source directory: `packages/utils`
- Audience: internal workspace packages and external npm consumers
- Runtime dependencies: **none**

## Root Exports (`@iceywu/utils`)

Intentionally small. Only the most common promise helpers and the public type surface are re-exported from the root entry.

- `to` — tuple-style `[err, value]` Promise wrapper
- `toTry` — synchronous tuple-style wrapper
- `toPro` — batched/structured variant of `to`
- Shared public types via `./types`

All other domains must be imported through their explicit subpaths.

## Subpath Exports

| Subpath | Source | Highlights |
| --- | --- | --- |
| `@iceywu/utils/promise` | `src/promise.ts` | Promise-only entry (same as root `to` trio) |
| `@iceywu/utils/is` | `src/is/` | `isString`, `isArray`, `isObject`, `isEmpty`, … |
| `@iceywu/utils/shared` | `src/shared/` | `getRandom`, `randomStr`, stable hashing |
| `@iceywu/utils/types` | `src/types.ts` | Public type re-exports |
| `@iceywu/utils/array` | `src/array/` | `diff`, `flat`, `list`, `listFill`, `range`, `removeListEmptyVal`, `sift` |
| `@iceywu/utils/async-task` | `src/asyncTask/` | `getAsyncTask`, `all`, `sleep` |
| `@iceywu/utils/download` | `src/download/` | `createDownload`, `downloadFile` |
| `@iceywu/utils/lodash-lite` | `src/lodash-lite/` | `deepClone`, `compareObjects`, `arrayNth`, `sortObj`, plus internal `fromPairs`/`toPairs` |
| `@iceywu/utils/log` | `src/log/` | `consolePlus`, `typeColor` |
| `@iceywu/utils/network` | `src/network/` | `getStreamResponse` |
| `@iceywu/utils/object` | `src/object/` | `get`, `set`, `deepMerge`, `hasOwn`, `hasKey`, `removeEmptyValues`, `removeTreeData`, `getObjValByKeys` |
| `@iceywu/utils/tools` | `src/tools/` | `destr`, `safeDestr`, `getFileType`, `formatNumber`, `throttle`, `debounce` |
| `@iceywu/utils/to-pro` | `src/to/toPro.ts` | Re-exports `toPro` |

## Removed Exports (2026.5.4, breaking)

| Removed | Replacement |
| --- | --- |
| `deepClone2(o)` | `import { deepClone } from "@iceywu/utils/lodash-lite"` |
| `extend(a, b)` | `Object.assign(a, b)` |
| `setObjValue(o, p, v)` | `set(o, p, v)` from `@iceywu/utils/object` |
| `getObjVal(o, p, d)` | `get(o, p, d)` from `@iceywu/utils/object` |
| `arrayFirst(a, d)` | `a?.[0] ?? d` or `arrayNth(a, 0, d)` |
| `arrayLast(a, d)` | `a?.[a.length - 1] ?? d` or `arrayNth(a, -1, d)` |
| `arraySlice(a, s, e)` | `a.slice(s, e)` |
| `randomString(n)` | `import { randomStr } from "@iceywu/utils/shared"` |

## Public API Principles

- Keep the root entry curated and intentionally small.
- Publish every historical or growing domain as an explicit subpath so consumers opt in.
- Preserve tree-shakeable named exports; no default-only exports from the public surface.
- Exported types are part of the supported surface — treat them as you would runtime signatures.
- When behavior parity with a legacy third-party helper is required, document the parity source in a short comment (e.g. "lodash@4 `get` behavior").

## Verification

Always run after API changes:

```bash
pnpm --filter @iceywu/utils check:package
```

This builds the package and runs `scripts/verify-exports.mjs`, which imports every subpath from the published entry points and asserts that at least one representative export exists. Failing here means `package.json#exports` / `src/<subpath>/index.ts` / `tsup` entry list drifted.

## Example

```ts
import { to } from "@iceywu/utils";
import { diff } from "@iceywu/utils/array";
import { isString } from "@iceywu/utils/is";
import { get, set } from "@iceywu/utils/object";
import { deepClone } from "@iceywu/utils/lodash-lite";
import { randomStr } from "@iceywu/utils/shared";

const [err, res] = await to(fetch("https://example.com"));
if (!err && isString(res)) {
  const copy = deepClone({ res });
  set(copy, ["meta", "id"], randomStr(8));
  console.log(get(copy, ["meta", "id"]));
  console.log(diff([1, 2, 3], [2]));
}
```

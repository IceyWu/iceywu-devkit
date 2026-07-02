# @iceywu/utils

[![NPM version](https://img.shields.io/npm/v/@iceywu/utils?color=a1b858&label=)](https://www.npmjs.com/package/@iceywu/utils)
[![Docs](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@iceywu/utils)

A public TypeScript utility library with curated root exports and explicit module subpaths. Zero runtime dependencies.

## Documentation

Full API reference with parameter details and return types is available at:

👉 **[jsDocs.io — @iceywu/utils](https://www.jsdocs.io/package/@iceywu/utils)**

## Playground

Try the interactive playground online: **[iceywu-devkit.netlify.app](https://iceywu-devkit.netlify.app/)**

## Installation

```bash
pnpm add @iceywu/utils
```

<details>
<summary>Other package managers</summary>

```bash
npm install @iceywu/utils
yarn add @iceywu/utils
```

</details>

## Quick Start

```ts
import { to } from "@iceywu/utils";
import { diff } from "@iceywu/utils/array";
import { isString } from "@iceywu/utils/is";

const [error, response] = await to(fetch("https://example.com"));

if (!error && response && isString(response.url)) {
  console.log(response.url);
}

console.log(diff([1, 2, 3], [2])); // [1, 3]
```

## API Reference

### Root (`@iceywu/utils`)

Intentionally small — only the most common helpers and public types.

| Export | Description |
| --- | --- |
| `to` | Tuple-style `[err, value]` Promise wrapper |
| `toTry` | Synchronous tuple-style wrapper |
| `toPro` | Batched / structured variant of `to` |
| _(types)_ | Public types re-exported from `@iceywu/utils/types` |

### Subpath Modules

| Subpath | Description |
| --- | --- |
| `@iceywu/utils/promise` | Promise helpers — same `to` / `toTry` / `toPro` trio |
| `@iceywu/utils/is` | Type guards — `isString`, `isArray`, `isObject`, `isEmpty`, … |
| `@iceywu/utils/shared` | Shared utilities — `getRandom`, `randomStr`, stable hashing |
| `@iceywu/utils/types` | Public type re-exports |
| `@iceywu/utils/array` | Array helpers — `diff`, `flat`, `list`, `listFill`, `range`, `removeListEmptyVal`, `sift` |
| `@iceywu/utils/async-task` | Async task helpers — `getAsyncTask`, `all`, `sleep` |
| `@iceywu/utils/download` | File download — `createDownload`, `downloadFile` |
| `@iceywu/utils/lodash-lite` | Lodash-compatible helpers — `deepClone`, `compareObjects`, `arrayNth`, `sortObj` |
| `@iceywu/utils/log` | Logging — `consolePlus`, `typeColor` |
| `@iceywu/utils/network` | Network helpers — `getStreamResponse` |
| `@iceywu/utils/object` | Object helpers — `get`, `set`, `deepMerge`, `hasOwn`, `hasKey`, `removeEmptyValues`, `removeTreeData`, `getObjValByKeys` |
| `@iceywu/utils/tools` | General tools — `destr`, `safeDestr`, `getFileType`, `formatNumber`, `throttle`, `debounce` |
| `@iceywu/utils/to-pro` | `toPro` only (scoped re-export) |

> 💡 See the **[jsDocs.io API reference](https://www.jsdocs.io/package/@iceywu/utils)** for detailed parameter types and return signatures.

## Migration (Legacy Imports)

If migrating from the old `src/` import pattern:

| Legacy (`src/*`) | Current |
| --- | --- |
| `src/to/*` | `@iceywu/utils` or `@iceywu/utils/to-pro` |
| `src/array/*` | `@iceywu/utils/array` |
| `src/asyncTask/*` | `@iceywu/utils/async-task` |
| `src/download/*` | `@iceywu/utils/download` |
| `src/is/*` | `@iceywu/utils/is` |
| `src/lodash-lite/*` | `@iceywu/utils/lodash-lite` |
| `src/log/*` | `@iceywu/utils/log` |
| `src/network/*` | `@iceywu/utils/network` |
| `src/object/*` | `@iceywu/utils/object` |
| `src/shared/*` | `@iceywu/utils/shared` |
| `src/tools/*` | `@iceywu/utils/tools` |
| `src/types.ts` | `@iceywu/utils/types` |

### Removed Exports (2026.5.4)

| Removed | Replacement |
| --- | --- |
| `deepClone2(o)` | `import { deepClone } from "@iceywu/utils/lodash-lite"` |
| `extend(a, b)` | `Object.assign(a, b)` |
| `setObjValue(o, p, v)` | `import { set } from "@iceywu/utils/object"` |
| `getObjVal(o, p, d)` | `import { get } from "@iceywu/utils/object"` |
| `arrayFirst(a, d)` | `a?.[0] ?? d` |
| `arrayLast(a, d)` | `a?.[a.length - 1] ?? d` |
| `arraySlice(a, s, e)` | `a.slice(s, e)` |
| `randomString(n)` | `import { randomStr } from "@iceywu/utils/shared"` |

## Development

```bash
# Build
pnpm --filter @iceywu/utils build

# Run tests
pnpm --filter @iceywu/utils test

# Type-check
pnpm --filter @iceywu/utils typecheck

# Validate exports
pnpm --filter @iceywu/utils check:package
```

## License

[MIT](./LICENSE)

# Public API

## Package Scope

- Package name: @iceywu/utils
- Source directory: packages/utils
- Audience: internal workspace packages and external applications

## Migration Coverage

- Source reference for migration comparisons: legacy workspace `utils`
- Migrated publishable domains: `array`, `asyncTask`, `download`, `is`, `lodash-lite`, `log`, `network`, `object`, `shared`, `to`, `tools`, `types`
- Additional migrated packaging surface: `promise`, export verification, lodash subpath type declarations
- Legacy `utils/src/browser/index.ts` is intentionally not published because it only contains commented draft code and was never exported from the legacy root entry

## Root Exports

- to
- toTry
- toPro
- Shared public types from ./types

## Subpath Exports

- @iceywu/utils/promise
- @iceywu/utils/is
- @iceywu/utils/shared
- @iceywu/utils/types
- @iceywu/utils/array
- @iceywu/utils/async-task
- @iceywu/utils/download
- @iceywu/utils/lodash-lite
- @iceywu/utils/log
- @iceywu/utils/network
- @iceywu/utils/object
- @iceywu/utils/tools
- @iceywu/utils/to-pro

## Legacy Import Mapping

- Root promise helpers: `@iceywu/utils`
- Promise-only entry: `@iceywu/utils/promise`
- `src/array/*` -> `@iceywu/utils/array`
- `src/asyncTask/*` -> `@iceywu/utils/async-task`
- `src/download/*` -> `@iceywu/utils/download`
- `src/is/*` -> `@iceywu/utils/is`
- `src/lodash-lite/*` -> `@iceywu/utils/lodash-lite`
- `src/log/*` -> `@iceywu/utils/log`
- `src/network/*` -> `@iceywu/utils/network`
- `src/object/*` -> `@iceywu/utils/object`
- `src/shared/*` -> `@iceywu/utils/shared`
- `src/tools/*` -> `@iceywu/utils/tools`
- `src/types.ts` -> `@iceywu/utils/types`

## Public API Principles

- Keep the root API curated and intentionally small
- Publish larger historical domains as explicit subpaths
- Avoid crowding the root entry with every helper
- Keep exported types stable and intentional

## Example

```ts
import { to } from "@iceywu/utils";
import { diff } from "@iceywu/utils/array";
import { isString } from "@iceywu/utils/is";
import { getRandom } from "@iceywu/utils/shared";

const [error, result] = await to(fetch("https://example.com"));

if (!error && isString(result)) {
  console.log(result);
}

console.log(getRandom(1, 3));
console.log(diff([1, 2, 3], [2]));
```

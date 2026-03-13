# @iceywu/utils

[![NPM version](https://img.shields.io/npm/v/@iceywu/utils?color=a1b858&label=)](https://www.npmjs.com/package/@iceywu/utils)
[![Docs](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@iceywu/utils)

TypeScript utility library.

## Playground

Try the interactive playground online:

- <https://iceywu-devkit.netlify.app/>

## Installation

```bash
pnpm add @iceywu/utils
# or
npm install @iceywu/utils
# or
yarn add @iceywu/utils
```

## Quick Start

```ts
import { to } from "@iceywu/utils";
import { diff } from "@iceywu/utils/array";
import { isString } from "@iceywu/utils/is";

const [error, response] = await to(fetch("https://example.com"));

if (!error && response && isString(response.url)) {
  console.log(response.url);
}

console.log(diff([1, 2, 3], [2]));
```

## Public API

Root:

- `to`
- `toTry`
- `toPro`
- public types re-exported from `@iceywu/utils/types`

Subpaths:

- `@iceywu/utils/promise`
- `@iceywu/utils/is`
- `@iceywu/utils/shared`
- `@iceywu/utils/types`
- `@iceywu/utils/array`
- `@iceywu/utils/async-task`
- `@iceywu/utils/download`
- `@iceywu/utils/lodash-lite`
- `@iceywu/utils/log`
- `@iceywu/utils/network`
- `@iceywu/utils/object`
- `@iceywu/utils/tools`
- `@iceywu/utils/to-pro`

## Legacy Import Mapping

- `src/to/*` -> `@iceywu/utils` or `@iceywu/utils/to-pro`
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

## Validation

```bash
pnpm --filter @iceywu/utils build
pnpm --filter @iceywu/utils test
pnpm --filter @iceywu/utils typecheck
pnpm --filter @iceywu/utils check:package
```

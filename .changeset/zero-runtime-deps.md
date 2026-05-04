---
"@iceywu/utils": minor
"@iceywu/cli": patch
---

## `@iceywu/utils` — 移除三方运行时依赖 + 清理冗余 API

### Breaking changes

- 移除以下公共导出（命名重复 / 实现冗余 / 零价值包装）：
  - `@iceywu/utils/object` — 删除 `deepClone2`（实现不完整，被 `lodash-lite` 的 `deepClone` 完全覆盖）、`extend`（仅是 `Object.assign` 别名）、`setObjValue`（重命名为 `set`）、`getObjVal`（重命名为 `get`）。
  - `@iceywu/utils/array` — 删除 `arrayFirst` / `arrayLast` / `arraySlice`（分别等价于 `arr?.[0]` / `arr?.[arr.length-1]` / `Array.prototype.slice`）。
  - `@iceywu/utils/tools` — 删除 `randomString`（与 `@iceywu/utils/shared` 的 `randomStr` 重复，后者更通用）。

迁移指南：

| 旧 API | 新 API |
| --- | --- |
| `deepClone2(o)` | `import { deepClone } from "@iceywu/utils/lodash-lite"` |
| `extend(a, b)` | `Object.assign(a, b)` |
| `setObjValue(o, p, v)` | `set(o, p, v)` |
| `getObjVal(o, p, d)` | `get(o, p, d)` |
| `arrayFirst(a, d)` | `a?.[0] ?? d` 或 `arrayNth(a, 0, d)` |
| `arrayLast(a, d)` | `a?.[a.length - 1] ?? d` 或 `arrayNth(a, -1, d)` |
| `arraySlice(a, s, e)` | `a.slice(s, e)` |
| `randomString(n)` | `import { randomStr } from "@iceywu/utils/shared"` |

### Removed runtime dependencies

- `lodash` / `@types/lodash` / `debounce` 全部从 `dependencies` 中移除。
- `cloneDeep` / `isEqualWith` / `nth` / `sortBy` / `fromPairs` / `toPairs` / `get` / `set` 改为参照 lodash@4 源码语义实现的纯 TS 函数，内联在各自消费方文件中（`lodash-lite/index.ts`、`object/base.ts`），无第三方运行时依赖。
- `debounce` 改为参照 `debounce@3` 源码语义内联在 `tools/other.ts`，行为与 `isPending` / `clear()` / `flush()` / `trigger()` 控制接口完全等价。

`@iceywu/utils` 现已**零运行时依赖**。

### 其他

- 全部 monorepo 依赖刷新到当前最新 minor / patch（`vite` / `vue` / `vitest` / `tsup` / `@biomejs/biome` / `ultracite` 等）。
- 新增 `lodash-lite/lodash-lite.test.ts` 与 `object/base.test.ts` 行为测试，覆盖深克隆 / 深比较 / 路径 get/set / 原型污染防护等关键路径。

## `@iceywu/cli`

- 升级 `@clack/prompts ^1.2.0 → ^1.3.0`。

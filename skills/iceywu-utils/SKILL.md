---
name: iceywu-utils
description: IceyWu shared utility design, public export surface, module subpaths, and package boundaries. Use when extending or reviewing utilities intended for internal workspace reuse or external consumption.
metadata:
	author: IceyWu
	version: "2026.3.12"
	source: Derived from packages/utils README, docs/architecture.md, and the workspace package layout
---

# IceyWu Utils

> Use this skill when the task is about designing, extending, or reviewing shared utility functions in the IceyWu workspace.

## Preferences

- Keep utilities framework-agnostic when possible
- Prefer pure functions over stateful helpers
- Keep the root entry intentionally small
- Treat type definitions as part of the product surface
- Avoid leaking CLI concerns into the utility package

## Core

| Topic             | Description                                                                  | Reference                                              |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| Public API Shape  | Root exports, module subpaths, and export surface decisions                  | [public-api](./references/public-api.md)               |
| Design Guidelines | Package boundaries, naming, tree-shaking, and when to keep code out of utils | [design-guidelines](./references/design-guidelines.md) |

## Features

| Topic              | Description                                                        | Reference                                              |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------ |
| Published Subpaths | Domain-specific imports such as array, is, log, network, and tools | [public-api](./references/public-api.md)               |
| Package Commands   | Common build, test, and typecheck commands                         | [design-guidelines](./references/design-guidelines.md) |

## Quick Reference

### Package Context

```text
package: @iceywu/utils
source: packages/utils
consumers: workspace packages and external applications
```

### Workspace Commands

```bash
pnpm --filter @iceywu/utils build
pnpm --filter @iceywu/utils test
pnpm --filter @iceywu/utils typecheck
```

### Design Rules

```text
1. Add new public utilities through packages/utils/src/index.ts or an explicit public subpath.
2. Prefer small modules with predictable names.
3. Keep CLI-only helpers out of utils unless reuse is clear.
4. Preserve tree-shakeable exports.
```

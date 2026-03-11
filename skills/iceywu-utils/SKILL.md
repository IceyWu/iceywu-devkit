# IceyWu Utils

Use this skill when the task is about designing, extending, or reviewing shared utility functions in the IceyWu workspace.

## Focus

- keep utilities framework-agnostic when possible
- prefer pure functions over stateful helpers
- preserve a stable public export surface from `packages/utils/src/index.ts`
- avoid leaking CLI concerns into the utility package

## Repository Context

- source package: `packages/utils`
- package name: `@iceywu/utils`
- intended consumers: internal workspace packages and external applications
- current state: migrated from the legacy `utils` project and validated inside the pnpm workspace

## Commands

```bash
pnpm --filter @iceywu/utils build
pnpm --filter @iceywu/utils test
pnpm --filter @iceywu/utils typecheck
```

## Working Rules

1. Add new public utilities through `packages/utils/src/index.ts`.
2. Prefer small modules with predictable names.
3. If a helper is only used by the CLI, keep it in the CLI package unless there is clear reuse value.
4. Preserve tree-shakeable exports.

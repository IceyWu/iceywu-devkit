# Design Guidelines

## Package Boundaries

- Keep utils pure and reusable
- Do not place CLI orchestration or prompt flows in this package
- Favor utilities that can be consumed by both workspace packages and external users

## Module Design

- Prefer small modules with predictable names
- Preserve tree-shakeable exports
- Treat type exports as part of the supported public surface
- Use explicit subpaths when a utility domain grows beyond the curated root entry

## Change Rules

- Add new public utilities through packages/utils/src/index.ts or a deliberate exported subpath
- If a helper is only used by the CLI, keep it in packages/cli unless reuse value is clear
- Avoid stateful helpers unless state is intrinsic to the utility abstraction

## Commands

```bash
pnpm --filter @iceywu/utils build
pnpm --filter @iceywu/utils test
pnpm --filter @iceywu/utils typecheck
```

## Release Mindset

- Verify published exports against built artifacts before release
- Preserve compatibility for the stable public API unless a breaking change is intentional

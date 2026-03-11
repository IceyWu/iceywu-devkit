# IceyWu DevKit Workflow

Use this skill when the task involves workspace layout, pnpm package boundaries, local linking, release flow, or migration from the legacy repositories.

## Goals

- treat `packages/utils` and `packages/cli` as the only publishable packages
- keep `skills/` as repository content instead of an npm package
- align all local package dependencies with `workspace:*`
- keep the root repository compatible with Agent Skills conventions
- treat the legacy `utils`, `icey-cli`, and `skills` directories as references only

## Commands

```bash
pnpm install
pnpm build
pnpm check
pnpm test
pnpm validate:skills
```

## Current State

- `packages/utils` has been migrated and validated
- `packages/cli` has been migrated and validated
- `skills/` already matches the installable Agent Skills directory convention

## Decision Rules

1. New publishable code belongs under `packages/`.
2. Agent instructions belong under `skills/<skill-name>/SKILL.md`.
3. Internal tooling that is not part of a skill should live under `tools/` or another non-skill directory.
4. Do not recreate old repository layout unless it directly improves the new workspace model.

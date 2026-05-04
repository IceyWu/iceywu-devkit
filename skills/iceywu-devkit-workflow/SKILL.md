---
name: iceywu-devkit-workflow
description: IceyWu monorepo workflow — pnpm workspace layout, package boundaries, skill repository conventions, day-to-day validation commands, and Changesets-based release flow. Use when making repository-structure decisions, running workspace-wide checks, or coordinating a release.
metadata:
  author: IceyWu
  version: "2026.5.4"
  source: Derived from docs/architecture.md, README.md, .github/workflows/release.yml, and the current pnpm workspace layout
---

# IceyWu DevKit Workflow

> Use this skill when the task spans more than one package — workspace layout, cross-package validation, or shipping a release.

## Preferences

- Treat `packages/utils` and `packages/cli` as the only publishable packages.
- Keep `skills/` as repository content, never a workspace package.
- Align local package dependencies with `workspace:*`.
- Keep the repository compatible with Agent Skills conventions (root-level `skills/` folder, each skill self-contained).
- Make small, reviewable changes. Validate the narrowest affected scope first, then escalate to repository-wide checks before release.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Workspace Layout | Package boundaries, skills placement, and repository structure decisions | [workspace-layout](./references/workspace-layout.md) |
| Release Flow | Changesets, version bumping, CI publishing, breaking-change discipline | [release-flow](./references/release-flow.md) |
| Migration And Validation | Verified state, workspace commands, and what not to preserve from legacy | [migration-validation](./references/migration-validation.md) |

## Quick Reference

### Repository Commands

```bash
pnpm install
pnpm build              # builds all @iceywu/* packages
pnpm check              # typecheck + publint + verify-exports
pnpm test               # vitest in all packages
pnpm validate:skills    # strict SKILL.md + frontmatter validation
```

### Decision Rules

```text
1. New publishable code belongs under packages/.
2. Agent instructions belong under skills/<skill-name>/SKILL.md.
3. Internal tooling that is not part of a skill belongs under tools/ or internal/.
4. Do not recreate the legacy repository layout unless it improves the current workspace model.
5. A breaking change to either published package requires a changeset with a migration table.
```

### Current State

```text
packages/utils — migrated, zero runtime deps, stable subpath surface
packages/cli   — migrated, TypeScript, @clack/prompts + execa
skills/        — agentskills.io compatible, strict validator in tools/validate-skills.mjs
CI             — .github/workflows/release.yml via changesets/action@v1
```

### Development Loop

```text
1. Make a focused change inside one package.
2. Run package-local validation first: pnpm --filter <pkg> typecheck && test.
3. Before pushing or opening a PR, run repository-wide: pnpm check && pnpm test.
4. If the change ships to npm, author a changeset: pnpm changeset.
5. Keep release blockers visible; fix root causes rather than bypassing checks.
```

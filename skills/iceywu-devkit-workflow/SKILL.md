---
name: iceywu-devkit-workflow
description: IceyWu monorepo workflow, workspace layout, package boundaries, skill repository conventions, and migration rules. Use when making repository-structure or release-flow decisions across the workspace.
metadata:
	author: IceyWu
	version: "2026.3.12"
	source: Derived from docs/architecture.md, README.md, and the current pnpm workspace layout
---

# IceyWu DevKit Workflow

> Use this skill when the task involves workspace layout, pnpm package boundaries, local linking, release flow, or migration from legacy repositories.

## Preferences

- Treat packages/utils and packages/cli as the only publishable packages
- Keep skills as repository content instead of an npm package
- Align local package dependencies with workspace:\*
- Keep the repository compatible with Agent Skills conventions
- Treat legacy layouts as references only unless they directly improve the current model

## Core

| Topic                    | Description                                                                       | Reference                                                  |
| ------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Workspace Layout         | Package boundaries, skill layout, and what belongs in packages, skills, and tools | [workspace-layout](references/workspace-layout.md)         |
| Migration And Validation | Current verified state, migration phases, and repository-wide commands            | [migration-validation](references/migration-validation.md) |

## Features

| Topic                   | Description                                                                 | Reference                                                  |
| ----------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Agent Skills Convention | Root-level skills directory and independently installable skill directories | [workspace-layout](references/workspace-layout.md)         |
| Repository Commands     | Install, build, check, test, and validate commands                          | [migration-validation](references/migration-validation.md) |

## Quick Reference

### Repository Commands

```bash
pnpm install
pnpm build
pnpm check
pnpm test
pnpm validate:skills
```

### Decision Rules

```text
1. New publishable code belongs under packages.
2. Agent instructions belong under skills/<skill-name>/SKILL.md.
3. Internal tooling that is not part of a skill belongs under tools or another non-skill area.
4. Do not recreate old repository layout unless it improves the current workspace model.
```

### Current State

```text
packages/utils has been migrated and validated.
packages/cli has been migrated and validated.
skills already matches the installable Agent Skills directory convention.
```

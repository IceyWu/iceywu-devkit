# IceyWu Agent Skills

This repository follows the Agent Skills layout.

## Available Skills

- `iceywu-utils` — `@iceywu/utils` design, public API, dependency policy
- `iceywu-cli` — `@iceywu/cli` command design, package structure, terminal UX
- `iceywu-devkit-workflow` — monorepo layout, validation commands, release flow
- `vue` — Vue 3 Composition API reference, synced from upstream

## Repository Layout

- `skills/` — installable Agent Skills (validated against `agentskills.io` via `pnpm validate:skills`)
- `packages/` — publishable product code managed by the pnpm workspace
- `apps/` — internal applications (e.g. the utils playground) that are not published
- `docs/` — design notes and migration guidance
- `tools/` — repo-level scripts (validation, etc.)
- `internal/skills-maintenance/` — upstream sync configuration and scripts for skills that mirror external sources (e.g. `vue`)

Each skill is self-contained and follows the [Agent Skills specification](https://agentskills.io/specification): a `SKILL.md` with YAML frontmatter, optional `references/`, optional `scripts/`, optional `assets/`.

## Usage

Install all skills from this repository:

```bash
npx skills add <owner>/iceywu-devkit --skill='*'
```

Install one skill only:

```bash
npx skills add <owner>/iceywu-devkit --skill iceywu-utils
```

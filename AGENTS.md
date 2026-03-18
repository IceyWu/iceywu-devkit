# IceyWu Agent Skills

This repository follows the Agent Skills layout.

## Available Skills

- `frontend-dev-tools`
- `frontend-docs-context7`
- `iceywu-dev-workflow`
- `iceywu-utils`
- `iceywu-cli`
- `iceywu-devkit-workflow`
- `pnpm`
- `vite`
- `vue`
- `web-design-guidelines`

## Repository Layout

- `skills/` contains installable skills
- `packages/` contains product code managed by pnpm workspace
- `docs/` contains design notes and migration guidance
- `internal/skills-maintenance/` contains metadata, source/vendor sync definitions, and maintenance scripts for the migrated skills repository design

This repository now includes both devkit-specific skills and the shared frontend skills migrated from the legacy workspace root.

## Usage

Install all skills from this repository:

```bash
npx skills add <owner>/iceywu-devkit --skill='*'
```

Install one skill only:

```bash
npx skills add <owner>/iceywu-devkit --skill iceywu-utils
```

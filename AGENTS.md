# IceyWu Agent Skills

This repository follows the Agent Skills layout.

## Available Skills

| Skill | Focus |
| --- | --- |
| `iceywu-utils` | `@iceywu/utils` design, public API, dependency policy |
| `iceywu-cli` | `@iceywu/cli` command design, package structure, terminal UX |
| `iceywu-devkit-workflow` | monorepo layout, validation commands, release flow |
| `logo-generation` | rapid logo design with pure HTML + SVG — ideation, comparison, iteration, and export |
| `design-md` | apply DESIGN.md styles from awesome-design-md for consistent UI generation |
| `pnpm` | workspace filtering, lockfile hygiene, command orchestration |
| `vite` | dev server behavior, build config, plugin troubleshooting |
| `vue` | Vue 3 Composition API reference, synced from upstream |
| `openapi-lookup` | query OpenAPI/Swagger endpoint definitions (params & responses) |

## Repository Layout

- `skills/` — installable Agent Skills (validated against `agentskills.io` via `pnpm validate:skills`)
- `packages/` — publishable product code managed by the pnpm workspace
- `apps/` — internal applications (e.g. the utils playground) that are not published
- `docs/` — design notes and migration guidance
- `tools/` — repo-level scripts (validation, etc.)
- `internal/skills-maintenance/` — upstream sync configuration and scripts for skills that mirror external sources (e.g. `vue`)

Each skill is self-contained and follows the [Agent Skills specification](https://agentskills.io/specification): a `SKILL.md` with YAML frontmatter, optional `references/`, optional `scripts/`, optional `assets/`.

## Usage

### Quick Start

1. Install one or more skills from this repository.
2. Mention the skill name explicitly in your prompt.
3. Keep using the same skill for follow-up tasks to avoid context drift.

### Install

Install all skills from this repository:

```bash
npx skills add IceyWu/iceywu-devkit --skill='*'
```

Install one skill only:

```bash
npx skills add IceyWu/iceywu-devkit --skill iceywu-utils
```

Install the UI style workflow skill only:

```bash
npx skills add IceyWu/iceywu-devkit --skill design-md
```

Install package-management and build-tool skills:

```bash
npx skills add IceyWu/iceywu-devkit --skill pnpm
npx skills add IceyWu/iceywu-devkit --skill vite
```

### Prompting

After installation, explicitly mention the skill name in your prompt so the agent applies it.

Prompt examples:

```text
Use the design-md skill and build this page from a single DESIGN.md style reference.
```

```text
Use the iceywu-devkit-workflow skill and give me the correct validate/release command order for this repo.
```

```text
Use the openapi-lookup skill. The backend docs URL is http://localhost:8080/v3/api-docs.
Query the /api/user/list endpoint and show me the request params and response structure.
```

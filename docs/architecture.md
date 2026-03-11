# Architecture Notes

## Core Decision

Use one repository with two publishable workspace packages and one root-level Agent Skills area.

This gives a single dependency graph and release surface for code, while keeping skills as documentation artifacts rather than npm packages.

## Package Boundaries

### `@iceywu/utils`

- Pure utility library
- No CLI logic
- Can be consumed by external apps and by `@iceywu/cli`
- Prefer stable exports from a single `src/index.ts`

### `@iceywu/cli`

- User-facing executable
- Depends on `@iceywu/utils` through `workspace:*`
- Owns command parsing, terminal IO, templates, and remote fetching
- Implemented as a TypeScript CLI with command, service, ui, lib, and types layers
- Legacy JavaScript runtime modules have been removed from the package source tree

### `skills/`

- Not treated as a workspace package
- Versioned with the repo
- Compatible with the `vercel-labs/agent-skills` folder convention
- Each skill should be independently installable by directory name

## Proposed Evolution

### Phase 1

- Stabilize workspace layout
- Add build, check, and skill validation scripts
- Completed

### Phase 2

- Migrate current `utils` source into `packages/utils`
- Migrate current `icey-cli` source into `packages/cli`
- Replace published dependency on `@iceywu/utils` with local workspace dependency
- Completed

### Phase 3

- Rewrite skill content around the new monorepo commands
- Add per-skill `references/` and optional `scripts/` only when the skill actually needs them
- CLI TypeScript refactor completed with `@clack/prompts` and `execa`

## Current Verified State

- `pnpm install` succeeds at the monorepo root
- `pnpm check` succeeds for skills validation and package validation
- `pnpm build` succeeds for both `@iceywu/utils` and `@iceywu/cli`
- `pnpm test` succeeds for both migrated packages

## What Not To Keep

- Do not keep code generators inside the installable `skills/` directory unless agents must execute them directly.
- Do not force `skills/` to become a package; the Agent Skills ecosystem works from repository structure, not npm package publishing.
- Do not mirror old repository layout inside the monorepo if the layout does not serve the new dependency model.

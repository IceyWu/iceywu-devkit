# IceyWu DevKit

This repository is a clean pnpm monorepo design for three concerns:

- `@iceywu/utils`: shared utility library
- `@iceywu/cli`: command line tool
- `skills/`: Agent Skills compatible content

The existing `utils`, `icey-cli`, and `skills` directories in the workspace remain untouched and can be used as source references during migration.

## Goals

- Manage publishable packages in one workspace
- Keep local package linking explicit with `workspace:*`
- Make the repository itself usable by Agent Skills tooling
- Separate product code from skill instructions and docs

## Structure

```text
iceywu-devkit/
  AGENTS.md
  docs/
  packages/
    cli/
    utils/
  skills/
    iceywu-cli/
    iceywu-devkit-workflow/
    iceywu-utils/
  tools/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
```

## Why This Shape

`packages/` contains code that is versioned and published to npm.

`skills/` is a root-level folder so the repository matches the Agent Skills format used by tools such as:

```bash
npx skills add <owner>/<repo>
```

Each skill is self-contained and only needs a `SKILL.md` file. Optional helper scripts and references can be added later per skill.

## Migration Status

- `@iceywu/utils` has been migrated into `packages/utils` and now builds and tests inside the workspace.
- `@iceywu/cli` has been migrated into `packages/cli`, then refactored into a TypeScript layered CLI architecture.
- the CLI now uses `@clack/prompts` for interaction and `execa` for subprocess execution.
- the CLI source tree is now fully TypeScript-based.
- `skills/` is already aligned with the Agent Skills repository layout.

## Recommended Migration Order

1. Refine the utility package exports and module boundaries after migration stability.
2. Add release automation after package boundaries are stable.
3. Keep only installable skill content under `skills/`; move generators, sync scripts, or vendor sources into a separate `internal/` area only if still needed.

## First Run

```bash
pnpm install
pnpm build
pnpm check
```

## Code Style

This repository uses Ultracite with Biome as the default formatting toolchain.

```bash
pnpm format
pnpm format:check
```

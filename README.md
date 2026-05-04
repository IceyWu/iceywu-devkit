# IceyWu DevKit

This repository is a clean pnpm monorepo design for three concerns:

- `@iceywu/utils`: shared utility library
- `@iceywu/cli`: command line tool
- `apps/playground`: interactive utils playground
- `skills/`: Agent Skills compatible content

The existing `utils`, `icey-cli`, and `skills` directories in the workspace remain untouched and can be used as source references during migration.

## Playground

Public deployment:

- <https://iceywu-devkit.netlify.app/>

## Goals

- Manage publishable packages in one workspace
- Keep local package linking explicit with `workspace:*`
- Make the repository itself usable by Agent Skills tooling
- Separate product code from skill instructions and docs

## Structure

```text
iceywu-devkit/
  AGENTS.md
  apps/
    playground/
  docs/
  packages/
    cli/
    utils/
  skills/
    iceywu-cli/
    iceywu-devkit-workflow/
    iceywu-utils/
    vue/
  tools/
  internal/
    skills-maintenance/
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
- the utils package now publishes a curated root API plus explicit subpath exports for legacy utility domains.
- the legacy `utils/src/browser/index.ts` file remains a non-published draft reference because it was never part of the original public export surface.
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

## Release Workflow

This repository uses Changesets for package versioning and publishing.

How changelogs are generated:

- Changesets only generates package changelogs after you create at least one changeset entry and run `pnpm version-packages`.
- When a package version changes, Changesets writes or updates the package-level `CHANGELOG.md` automatically.

Minimal release flow:

Create a changeset for any change that should ship to npm:

```bash
pnpm changeset
```

When you are ready to prepare a release, update package versions and changelogs:

```bash
pnpm version-packages
```

Run the full release verification locally before publishing:

```bash
pnpm release:check
```

Publish all unpublished workspace packages to npm:

```bash
pnpm release
```

GitHub automation:

- `.github/workflows/release.yml` uses Changesets to open or update a version PR on `main`.
- After the version PR is merged, the same workflow publishes unpublished packages to npm.
- Set the repository secret `NPM_TOKEN` before enabling automated publish.

## Code Style

This repository uses Ultracite with Biome as the default formatting toolchain.

```bash
pnpm format
pnpm format:check
```

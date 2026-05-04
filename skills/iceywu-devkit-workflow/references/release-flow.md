# Release Flow

## Overview

This monorepo uses **Changesets** for package versioning and publishing. Skills are not published to npm and have no version bumps — they ride the repository SHA.

## Publishable Packages

| Package | Versioning |
| --- | --- |
| `@iceywu/utils` | Independent semver; breaking changes bump `minor` while pre-1.0 |
| `@iceywu/cli` | Independent semver |

`apps/playground` is private and never published.

## Minimal Local Flow

```bash
# 1. Author a changeset for any change that should ship to npm
pnpm changeset

# 2. When ready to release, bump versions and write CHANGELOG.md
pnpm version-packages

# 3. Verify the release locally (clean, build, check, test, publint)
pnpm release:check

# 4. Publish unpublished workspace packages to npm
pnpm release
```

## GitHub Automation

`.github/workflows/release.yml` uses `changesets/action@v1` to:

1. On push to `main`, open or update a version PR that runs `pnpm version-packages`.
2. After the version PR is merged, publish unpublished packages to npm via `pnpm release`.

Secrets required on the repository: `NPM_TOKEN` (and optionally `RELEASE_GITHUB_TOKEN` if you want a scoped token for the automated PR).

### CI Gotchas

- `pnpm/action-setup@v4` reads the pnpm version from `package.json#packageManager`. Do **not** also set `with: version:` — doing so triggers `ERR_PNPM_BAD_PM_VERSION`.
- `pnpm update -r --latest` does **not** bump the `packageManager` field. Use `ncu -i` or edit `package.json` manually to bump pnpm itself.

## Breaking Change Discipline

- Any removal or rename of a public export from `@iceywu/utils` or `@iceywu/cli` requires a changeset with a migration table.
- Pre-1.0 breaking changes: bump `minor` (e.g. `0.0.x → 0.1.0`), not `major`, so the package stays below 1.0 until the surface is considered stable.
- Inline the migration table in the changeset markdown so `CHANGELOG.md` carries it forward.

## Verification Checklist

Before merging a release PR:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm check
pnpm test
pnpm validate:skills
pnpm --filter @iceywu/utils check:package
```

Each command fails loudly; do not bypass a failing step. Fix the root cause instead.

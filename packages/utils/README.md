# @iceywu/utils

Shared utility package for internal workspace reuse and external publishing.

The existing source tree from the legacy `utils` project has been migrated into this package.

Current focus:

- preserve the public API while moving into pnpm workspace management
- keep `@iceywu/cli` consuming this package through `workspace:*`
- clean up module boundaries after the migration is stable

# Package Structure

## Scope

- Package name: @iceywu/cli
- Source directory: packages/cli
- Tests: packages/cli/test
- Binary names: icey and icey-cli

## Responsibilities

- Own command parsing and command registration
- Handle terminal IO and prompt flows
- Own template discovery and remote fetching behavior
- Depend on @iceywu/utils through workspace:* instead of a published version

## Source Layout

- src/app.ts: CLI composition and command registration
- src/commands: user-facing command handlers
- src/services: remote fetching, git, filesystem, and package interactions
- src/ui: prompt wrappers and feedback helpers
- src/lib: validation, formatting, package metadata, and errors
- src/types: shared TypeScript models

## Commands

```bash
pnpm --filter @iceywu/cli build
pnpm --filter @iceywu/cli test
pnpm --filter @iceywu/cli typecheck
```

## Guidance

- Keep new user-facing behavior inside packages/cli instead of pushing CLI concerns into shared utilities
- Preserve compatibility for both executable names during migration-sensitive changes
- Keep layered boundaries intact so tests can target orchestration without coupling to terminal output

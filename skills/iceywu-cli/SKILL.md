# IceyWu CLI

Use this skill when the task is about command design, argument parsing, terminal UX, templates, or package publishing for the IceyWu CLI.

## Focus

- keep command entrypoints inside `packages/cli`
- depend on `@iceywu/utils` through `workspace:*`
- separate terminal output, command orchestration, and file system side effects
- design commands to be scriptable first, interactive second
- preserve compatibility for both `icey` and `icey-cli` command names during migration
- use the TypeScript layered structure under `commands`, `services`, `ui`, `lib`, and `types`
- prefer `@clack/prompts` over older prompt stacks and `execa` over shell wrappers

## Repository Context

- source package: `packages/cli`
- package name: `@iceywu/cli`
- binary names: `icey`, `icey-cli`
- tests: `packages/cli/test`
- language: TypeScript across runtime logic and fallback template data

## Commands

```bash
pnpm --filter @iceywu/cli build
pnpm --filter @iceywu/cli test
pnpm --filter @iceywu/cli typecheck
```

## Working Rules

1. Put user-facing commands in the CLI package only.
2. Move reusable string, array, object, and async helpers into `@iceywu/utils`.
3. Keep command handlers small and testable.
4. Prefer explicit subcommands over overloaded flags.

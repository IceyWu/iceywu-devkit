---
name: iceywu-cli
description: IceyWu CLI command design, TypeScript package structure, template discovery, terminal UX, and publishing workflow. Use when editing commands, prompts, services, validation, or release-facing CLI behavior.
metadata:
	author: IceyWu
	version: "2026.3.12"
	source: Derived from packages/cli README, docs/architecture.md, and the workspace package layout
---

# IceyWu CLI

> Use this skill when the task is about command design, argument parsing, terminal UX, template discovery, or package publishing for the IceyWu CLI.

## Preferences

- Prefer TypeScript across runtime logic, prompt flows, and fallback template data
- Keep command entrypoints inside packages/cli
- Design commands to be scriptable first and interactive second
- Prefer explicit subcommands over overloaded flags
- Prefer @clack/prompts for interaction and execa for subprocess execution

## Core

| Topic             | Description                                                                                           | Reference                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Package Structure | CLI package role, binary names, layered TypeScript structure, and package boundaries                  | [package-structure](./references/package-structure.md) |
| Command Design    | Command orchestration rules, service boundaries, validation, prompts, and template discovery behavior | [command-design](./references/command-design.md)       |

## Features

| Topic                   | Description                                                        | Reference                                              |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| Runtime Configuration   | Template mirror configuration, cache TTL, and fetch fallback order | [command-design](./references/command-design.md)       |
| Build And Test Commands | Common package-local build, typecheck, and test commands           | [package-structure](./references/package-structure.md) |

## Quick Reference

### Package Context

```text
package: @iceywu/cli
source: packages/cli
tests: packages/cli/test
binaries: icey, icey-cli
```

### Workspace Commands

```bash
pnpm --filter @iceywu/cli build
pnpm --filter @iceywu/cli test
pnpm --filter @iceywu/cli typecheck
```

### Design Rules

```text
1. Put user-facing commands in the CLI package only.
2. Move reusable helpers into @iceywu/utils only when reuse is clear.
3. Keep command handlers small and testable.
4. Separate terminal output, orchestration, and file system side effects.
```

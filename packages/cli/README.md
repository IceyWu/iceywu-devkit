# @iceywu/cli

[![npm version](https://img.shields.io/npm/v/@iceywu/cli?color=ec4899&label=)](https://www.npmjs.com/package/@iceywu/cli)
[![downloads](https://img.shields.io/npm/dm/@iceywu/cli?color=gray)](https://www.npmjs.com/package/@iceywu/cli)

TypeScript CLI for project scaffolding and template discovery.

## Installation

```bash
pnpm dlx @iceywu/cli create my-app
```

Or install globally:

```bash
pnpm add -g @iceywu/cli
icey create my-app
```

## Template Discovery

Templates are resolved in priority order:

1. **GitHub API** — primary source
2. **Mirror APIs** — fallback via `ICEY_CLI_TEMPLATE_API_MIRRORS`（supports `名称=URL`）
3. **Local cache** — runtime cache from last successful fetch

Optional config:

- `ICEY_CLI_TEMPLATE_API_MIRRORS` — comma-separated mirror URLs
- `ICEY_CLI_TEMPLATE_CACHE_TTL_MS` — cache TTL in ms（default: 12h）

## Structure

```
src/
├── app.ts          CLI composition & command registration
├── commands/       user-facing command handlers
├── services/       GitHub, git, filesystem, npm interactions
├── ui/             prompt wrappers & terminal feedback
├── lib/            validation, formatting, package metadata, errors
└── types/          shared TypeScript models
```

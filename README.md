# 🧰 IceyWu DevKit

> TypeScript 工具库 · CLI 脚手架 · Agent 技能集合

[中文说明](README.zh-CN.md)

<p align="center">
  <a href="https://www.npmjs.com/package/@iceywu/utils"><img src="https://img.shields.io/npm/v/@iceywu/utils?color=ec4899&label=utils" /></a>
  <a href="https://www.npmjs.com/package/@iceywu/cli"><img src="https://img.shields.io/npm/v/@iceywu/cli?color=ec4899&label=cli" /></a>
  <a href="https://skills.sh/iceywu/iceywu-devkit"><img src="https://skills.sh/b/iceywu/iceywu-devkit" /></a>
</p>

---

## 📦 Packages

### [@iceywu/utils](packages/utils/README.md)

[![npm version](https://img.shields.io/npm/v/@iceywu/utils?color=ec4899&label=)](https://www.npmjs.com/package/@iceywu/utils)
[![downloads](https://img.shields.io/npm/dm/@iceywu/utils?color=gray)](https://www.npmjs.com/package/@iceywu/utils)

Zero-dependency TypeScript utility library — `to()` / `pick()` / `diff()` and more.

```bash
pnpm add @iceywu/utils
```

```ts
import { to } from '@iceywu/utils'
import { diff } from '@iceywu/utils/array'

const [err, res] = await to(fetch('https://example.com'))
console.log(diff([1, 2, 3], [2])) // [1, 3]
```

→ [API docs](https://www.jsdocs.io/package/@iceywu/utils) · [Package README](packages/utils/README.md)

### [@iceywu/cli](packages/cli/README.md)

[![npm version](https://img.shields.io/npm/v/@iceywu/cli?color=ec4899&label=)](https://www.npmjs.com/package/@iceywu/cli)
[![downloads](https://img.shields.io/npm/dm/@iceywu/cli?color=gray)](https://www.npmjs.com/package/@iceywu/cli)

Project scaffolding CLI with interactive prompts and template discovery.

```bash
pnpm dlx @iceywu/cli create my-app
```

→ [Package README](packages/cli/README.md)

---

## 🤖 Agent Skills

[![skills.sh](https://skills.sh/b/iceywu/iceywu-devkit)](https://skills.sh/iceywu/iceywu-devkit)

Installable skills that teach AI agents how to work with this ecosystem.

```bash
npx skills add IceyWu/iceywu-devkit -a github-copilot --copy -y
```

| Skill | Teaches the agent to… |
| --- | --- |
| `openapi-lookup` | query OpenAPI/Swagger endpoint definitions |
| `iceywu-utils` | use `@iceywu/utils` APIs and follow dependency rules |
| `iceywu-cli` | design CLI commands and structure packages |
| `iceywu-devkit-workflow` | validate, build, and release in this monorepo |
| `design-md` | generate consistent UIs from DESIGN.md style references |
| `logo-generation` | rapidly prototype logos with pure HTML + SVG |
| `pnpm` | filter workspaces, manage lockfiles, orchestrate commands |
| `vite` | configure dev servers, builds, and troubleshoot plugins |
| `vue` | write idiomatic Vue 3 Composition API code |

→ [Full catalog](AGENTS.md) · [Leaderboard](https://skills.sh/iceywu/iceywu-devkit)

---

## 📂 Structure

```
iceywu-devkit/
├── packages/
│   ├── utils/          @iceywu/utils  →  TypeScript utilities
│   └── cli/            @iceywu/cli    →  scaffolding CLI
├── apps/playground/    interactive demo site
├── skills/             ×9 Agent Skills
└── internal/           sync infra & tooling
```

---

🧪 Playground: [iceywu-devkit.netlify.app](https://iceywu-devkit.netlify.app/)

## Update Skills

When new versions are released, update installed skills:

```bash
# Update all installed skills
npx skills update

# Update a specific skill
npx skills update openapi-lookup

# Check for available updates
npx skills check
```

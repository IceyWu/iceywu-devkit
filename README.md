# IceyWu DevKit

[中文说明](README.zh-CN.md)

IceyWu DevKit is a pnpm monorepo for two goals:

- ship product packages
- provide installable Agent Skills

Playground: <https://iceywu-devkit.netlify.app/>

## Repository Structure

| Area | Purpose | Path |
| --- | --- | --- |
| Utils package | Shared TypeScript utility library | `packages/utils` |
| CLI package | Project scaffolding CLI | `packages/cli` |
| Playground app | Interactive demos for utilities | `apps/playground` |
| Agent Skills | Installable skills for coding agents | `skills` |
| Skill sync infra | Upstream skill mirror tooling | `internal/skills-maintenance` |

## Install And Use Packages

### @iceywu/utils

Install:

```bash
pnpm add @iceywu/utils
# or npm install @iceywu/utils
```

Use:

```ts
import { to } from "@iceywu/utils";
import { diff } from "@iceywu/utils/array";

const [error, response] = await to(fetch("https://example.com"));
if (!error && response) {
  console.log(response.url);
}

console.log(diff([1, 2, 3], [2]));
```

### @iceywu/cli

Run without global install:

```bash
pnpm dlx @iceywu/cli ls
pnpm dlx @iceywu/cli create my-app
```

Global install (optional):

```bash
pnpm add -g @iceywu/cli
icey ls
icey create my-app
```

## Install And Use Skills

Install all skills:

```bash
npx skills add IceyWu/iceywu-devkit --skill='*'
```

Install one skill:

```bash
npx skills add IceyWu/iceywu-devkit --skill design-md
```

Use in prompts by naming the skill explicitly:

```text
Use the design-md skill. Pick one template from skills/design-md/references/style-shortlist.md,
create DESIGN.md in project root, and build the page strictly following DESIGN.md.
```

See [AGENTS.md](AGENTS.md) for the full skill catalog.

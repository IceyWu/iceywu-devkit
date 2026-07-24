# 🧰 IceyWu DevKit

> TypeScript 工具库 · CLI 脚手架 · Agent 技能集合

[English README](README.md)

<p align="center">
  <a href="https://www.npmjs.com/package/@iceywu/utils"><img src="https://img.shields.io/npm/v/@iceywu/utils?color=ec4899&label=utils" /></a>
  <a href="https://www.npmjs.com/package/@iceywu/cli"><img src="https://img.shields.io/npm/v/@iceywu/cli?color=ec4899&label=cli" /></a>
  <a href="https://skills.sh/iceywu/iceywu-devkit"><img src="https://skills.sh/b/iceywu/iceywu-devkit" /></a>
</p>

---

## 📦 包

### [@iceywu/utils](packages/utils/README.md)

[![npm version](https://img.shields.io/npm/v/@iceywu/utils?color=ec4899&label=)](https://www.npmjs.com/package/@iceywu/utils)
[![downloads](https://img.shields.io/npm/dm/@iceywu/utils?color=gray)](https://www.npmjs.com/package/@iceywu/utils)

零依赖 TypeScript 工具库 — `to()` / `pick()` / `diff()` 等常用函数。

```bash
pnpm add @iceywu/utils
```

```ts
import { to } from '@iceywu/utils'
import { diff } from '@iceywu/utils/array'

const [err, res] = await to(fetch('https://example.com'))
console.log(diff([1, 2, 3], [2])) // [1, 3]
```

→ [API 文档](https://www.jsdocs.io/package/@iceywu/utils) · [包说明](packages/utils/README.md)

### [@iceywu/cli](packages/cli/README.md)

[![npm version](https://img.shields.io/npm/v/@iceywu/cli?color=ec4899&label=)](https://www.npmjs.com/package/@iceywu/cli)
[![downloads](https://img.shields.io/npm/dm/@iceywu/cli?color=gray)](https://www.npmjs.com/package/@iceywu/cli)

项目脚手架 CLI，交互式选择模板快速搭建项目。

```bash
pnpm dlx @iceywu/cli create my-app
```

→ [包说明](packages/cli/README.md)

---

## 🤖 Agent Skills

[![skills.sh](https://skills.sh/b/iceywu/iceywu-devkit)](https://skills.sh/iceywu/iceywu-devkit)

可安装的 Agent 技能，让 AI 编程助手更懂这个生态。

```bash
npx skills add IceyWu/iceywu-devkit -a github-copilot --copy -y
```

| Skill | 教 AI 学会… |
| --- | --- |
| `openapi-lookup` | 查询 OpenAPI/Swagger 接口定义 |
| `iceywu-utils` | 使用 `@iceywu/utils` API 并遵循依赖规则 |
| `iceywu-cli` | 设计 CLI 命令和包结构 |
| `iceywu-devkit-workflow` | 在 monorepo 中校验、构建和发布 |
| `design-md` | 基于 DESIGN.md 风格模板统一生成 UI |
| `logo-generation` | 纯 HTML + SVG 快速原型 Logo |
| `pnpm` | workspace 过滤、锁文件管理、命令编排 |
| `vite` | 配置开发服务器、构建和插件排障 |
| `vue` | 编写地道的 Vue 3 Composition API 代码 |

→ [完整目录](AGENTS.md) · [排行榜](https://skills.sh/iceywu/iceywu-devkit)

---

## 📂 结构

```
iceywu-devkit/
├── packages/
│   ├── utils/          @iceywu/utils  →  TypeScript 工具库
│   └── cli/            @iceywu/cli    →  项目脚手架
├── apps/playground/    交互演示站点
├── skills/             ×9 Agent 技能
└── internal/           同步基础设施与工具
```

---

🧪 Playground：[iceywu-devkit.netlify.app](https://iceywu-devkit.netlify.app/)

## 更新技能

当有新版本发布时，可通过以下命令更新：

```bash
# 更新全部已安装技能
npx skills update

# 只更新某个技能
npx skills update openapi-lookup

# 检查是否有可用更新
npx skills check
```

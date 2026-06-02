# IceyWu DevKit 中文说明

[English README](README.md)

IceyWu DevKit 是一个基于 pnpm 的 monorepo，目标只有两个：

- 发布产品包
- 提供可安装的 Agent Skills

Playground 线上地址：<https://iceywu-devkit.netlify.app/>

## 仓库结构

| 模块 | 作用 | 路径 |
| --- | --- | --- |
| Utils 包 | TypeScript 通用工具库 | `packages/utils` |
| CLI 包 | 项目脚手架命令行工具 | `packages/cli` |
| Playground | 工具函数交互演示 | `apps/playground` |
| Agent Skills | 可安装技能内容 | `skills` |
| Skill 同步基础设施 | 上游镜像同步脚本与配置 | `internal/skills-maintenance` |

## 包的安装与使用

### @iceywu/utils

安装：

```bash
pnpm add @iceywu/utils
# 或 npm install @iceywu/utils
```

使用：

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

无需全局安装：

```bash
pnpm dlx @iceywu/cli ls
pnpm dlx @iceywu/cli create my-app
```

可选全局安装：

```bash
pnpm add -g @iceywu/cli
icey ls
icey create my-app
```

## 如何使用本仓库 Skills

安装全部技能：

```bash
npx skills add IceyWu/iceywu-devkit --skill='*'
```

只安装单个技能：

```bash
npx skills add IceyWu/iceywu-devkit --skill design-md
```

可用技能：

| Skill | 适用场景 |
| --- | --- |
| `iceywu-utils` | utils API 设计、导出边界、依赖策略 |
| `iceywu-cli` | CLI 命令设计、包结构、终端交互体验 |
| `iceywu-devkit-workflow` | monorepo 开发流程、校验与发布顺序 |
| `design-md` | 基于 DESIGN.md 的统一 UI 风格生成 |
| `pnpm` | workspace 过滤、锁文件问题、脚本编排 |
| `vite` | dev server、构建配置、插件排障 |
| `vue` | Vue 3 Composition API 与 script setup 参考 |

在提示词里显式点名技能即可：

```text
Use the design-md skill. Pick one template from skills/design-md/references/style-shortlist.md,
create DESIGN.md in project root, and build the page strictly following DESIGN.md.
```

完整技能目录见 [AGENTS.md](AGENTS.md)。

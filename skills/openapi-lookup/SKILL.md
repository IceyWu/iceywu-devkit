---
name: openapi-lookup
description: Use when querying backend OpenAPI/Swagger endpoint definitions (params & responses). 当用户说"对接接口""这个接口怎么传参""XX 接口的返回结构"等,或提供接口名称/路径(如 /api/user/list、user/list、查询用户列表)时使用本技能。脚本每次会拉取最新文档并递归展开 `$ref`。
metadata:
  author: IceyWu
  version: "2026.06.26"
---

# OpenAPI 接口查询

通用的 OpenAPI/Swagger 文档查询技能,适用于任何后端项目。当用户要对接某个接口、询问接口的入参或响应结构时,运行本技能的脚本获取**最新且完整**的定义,不要凭记忆或旧代码推断字段。

直接 `curl` 拉文档会因为 `$ref` 引用而看不到完整结构,务必用本脚本(它会递归展开 `$ref`)。

## 首次配置

当 `config.json` 中 `docsUrl` 为空时，**必须先向用户询问** OpenAPI 文档地址。使用问答 UI 收集以下信息并写入 `config.json`：

1. 询问用户提供后端 OpenAPI/Swagger 文档地址（如 `http://host:port/v3/api-docs` 或本地 JSON 文件路径）
2. 将用户输入的值写入 `skills/openapi-lookup/config.json` 的 `docsUrl` 字段
3. 确认配置成功后，继续执行查询

> 如果文档需要 Basic Auth 认证，可在 `config.json` 中额外配置 `username` 和 `password` 字段（可选）。参考 `config.example.json`。

## 文档来源配置

脚本按以下优先级确定 OpenAPI 文档地址,支持 http(s) 地址或本地 JSON 文件路径:

1. 命令行 `--url <地址>`(临时指定,优先级最高)
2. 环境变量 `API_DOCS_URL`
3. 同目录 `config.json` 的 `docsUrl` 字段(当前项目默认)

**切换到其他项目时**,只需改 `config.json` 里的 `docsUrl`,或在命令里加 `--url`。

## 使用方法

```bash
node skills/openapi-lookup/scripts/query-api.mjs <关键词或路径> [--url 地址] [--method get|post] [--json] [--list]
```

### 常用场景

按完整路径精确查询(最常用):

```bash
node skills/openapi-lookup/scripts/query-api.mjs /api/user/list
```

列出所有接口:

```bash
node skills/openapi-lookup/scripts/query-api.mjs --list
```

按路径片段或中文关键词模糊查询:

```bash
node skills/openapi-lookup/scripts/query-api.mjs user/list
node skills/openapi-lookup/scripts/query-api.mjs 查询用户
```

临时指定其他项目的文档地址:

```bash
node skills/openapi-lookup/scripts/query-api.mjs /api/order/detail --url http://其他项目:端口/v3/api-docs
node skills/openapi-lookup/scripts/query-api.mjs order/detail --url ./local-openapi.json
```

只想先看有哪些匹配的接口(不展开细节):

```bash
node skills/openapi-lookup/scripts/query-api.mjs order --list
```

需要结构化 JSON(便于进一步处理):

```bash
node skills/openapi-lookup/scripts/query-api.mjs /api/user/list --json
```

同一路径有多个方法时用 `--method` 收敛:

```bash
node skills/openapi-lookup/scripts/query-api.mjs /api/user/enable --method post
```

## 参考文档

- [输出格式说明](./references/output-format.md) — 默认文本输出的字段含义与 `$ref` 展开规则

## 注意事项

- 脚本每次都会尝试拉取最新文档,失败时回退到本地缓存并打印 `[warn]`。
- 文档若是内网地址,需保证本机能访问对应 host:port。
- 拿到接口定义后,前端 API 封装请遵循当前项目现有的写法与约定。

## 更新技能

当本技能有新版本发布时，可通过以下命令更新：

```bash
# 更新全部已安装技能
npx skills update

# 只更新本技能
npx skills update openapi-lookup

# 检查是否有可用更新
npx skills check
```

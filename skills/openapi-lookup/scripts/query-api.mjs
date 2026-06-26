#!/usr/bin/env node
/**
 * 查询任意后端的 OpenAPI/Swagger 接口定义(入参与响应)。
 *
 * 用法:
 *   node query-api.mjs <关键词或路径> [选项]
 *
 * 文档来源(优先级从高到低):
 *   1. --url <地址>            命令行直接指定(本地文件路径或 http(s) 地址均可)
 *   2. 环境变量 API_DOCS_URL
 *   3. 上级目录 config.json 的 docsUrl 字段
 *
 * 示例:
 *   node query-api.mjs /api/user/list
 *   node query-api.mjs user/list --url http://example.com/v3/api-docs
 *   node query-api.mjs 查询用户 --list
 *   node query-api.mjs /api/user/list --json
 *
 * 行为:
 *   - 每次运行都会重新拉取最新文档(带本地缓存兜底)。
 *   - 自动递归展开 $ref(components/schemas),输出完整入参与响应结构。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.join(__dirname, "..");
const CONFIG_FILE = path.join(SKILL_DIR, "config.json");
const CACHE_FILE = path.join(SKILL_DIR, ".openapi-lookup.cache.json");

// ---------- 参数解析 ----------
const argv = process.argv.slice(2);
const flags = { json: false, list: false, method: null, url: null };
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--json") flags.json = true;
  else if (a === "--list") flags.list = true;
  else if (a === "--method") flags.method = (argv[++i] || "").toLowerCase();
  else if (a === "--url") flags.url = argv[++i];
  else positional.push(a);
}
const keyword = positional.join(" ").trim();

if (!keyword && !flags.list) {
  console.error(
    "用法: node query-api.mjs <关键词或路径> [--url 地址] [--method get] [--json] [--list]"
  );
  process.exit(1);
}

// ---------- 解析配置(仅读取一次) ----------
function loadConfig() {
  let cfg = {};
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    } catch {
      // 忽略损坏的配置
    }
  }
  return cfg;
}

function resolveDocsUrl(cfg) {
  if (flags.url) return flags.url;
  if (process.env.API_DOCS_URL) return process.env.API_DOCS_URL;
  return cfg.docsUrl || null;
}

function resolveAuth(cfg) {
  if (cfg.username && cfg.password) {
    const encoded = Buffer.from(`${cfg.username}:${cfg.password}`).toString(
      "base64"
    );
    return `Basic ${encoded}`;
  }
  return null;
}

const CONFIG = loadConfig();
const DOCS_URL = resolveDocsUrl(CONFIG);
const AUTH_HEADER = resolveAuth(CONFIG);

// ---------- 拉取文档 ----------
async function loadDocs() {
  if (!DOCS_URL) {
    if (fs.existsSync(CACHE_FILE)) {
      console.error(
        "[warn] 未配置文档地址(--url / API_DOCS_URL / config.json),使用上次缓存。"
      );
      return {
        doc: JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")),
        fresh: false,
      };
    }
    console.error(
      "[error] 未配置文档地址。请用以下任一方式指定 OpenAPI 文档:\n" +
        "  - 命令行: --url http://host:port/v3/api-docs (或本地 json 文件路径)\n" +
        "  - 环境变量: API_DOCS_URL\n" +
        `  - 配置文件: ${CONFIG_FILE} 写入 { \"docsUrl\": \"...\" }`
    );
    process.exit(2);
  }
  try {
    let doc;
    // 本地文件路径
    if (!/^https?:\/\//i.test(DOCS_URL)) {
      doc = JSON.parse(fs.readFileSync(DOCS_URL, "utf8"));
    } else {
      const headers = {};
      if (AUTH_HEADER) headers.Authorization = AUTH_HEADER;
      const res = await fetch(DOCS_URL, {
        signal: AbortSignal.timeout(15000),
        headers,
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      doc = await res.json();
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(doc));
    return { doc, fresh: true };
  } catch (err) {
    if (fs.existsSync(CACHE_FILE)) {
      console.error(`[warn] 拉取最新文档失败(${err.message}),使用本地缓存。`);
      return {
        doc: JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")),
        fresh: false,
      };
    }
    console.error(`[error] 无法拉取文档且无缓存: ${err.message}`);
    process.exit(2);
  }
}

// ---------- $ref 展开 ----------
function resolveRef(ref, doc) {
  // 形如 #/components/schemas/Xxx
  const parts = ref.replace(/^#\//, "").split("/");
  let cur = doc;
  for (const p of parts) cur = cur?.[p];
  return cur;
}

function expand(schema, doc, seen = new Set(), depth = 0) {
  if (!schema || depth > 12) return schema;
  if (schema.$ref) {
    // 用完整 $ref 路径去重,避免同名不同路径误判
    if (seen.has(schema.$ref)) return { $circularRef: schema.$ref };
    seen.add(schema.$ref);
    const resolved = resolveRef(schema.$ref, doc);
    const out = expand(resolved, doc, seen, depth + 1);
    seen.delete(schema.$ref);
    return out;
  }
  if (schema.type === "array" && schema.items) {
    return { ...schema, items: expand(schema.items, doc, seen, depth + 1) };
  }
  if (schema.properties) {
    const props = {};
    for (const [k, v] of Object.entries(schema.properties)) {
      props[k] = expand(v, doc, seen, depth + 1);
    }
    return { ...schema, properties: props };
  }
  if (
    schema.additionalProperties &&
    typeof schema.additionalProperties === "object"
  ) {
    return {
      ...schema,
      additionalProperties: expand(
        schema.additionalProperties,
        doc,
        seen,
        depth + 1
      ),
    };
  }
  for (const key of ["allOf", "oneOf", "anyOf"]) {
    if (schema[key]) {
      return {
        ...schema,
        [key]: schema[key].map((s) => expand(s, doc, seen, depth + 1)),
      };
    }
  }
  return schema;
}

// ---------- 匹配接口 ----------
function findEndpoints(doc, kw) {
  const results = [];
  const lower = kw.toLowerCase();
  for (const [p, methods] of Object.entries(doc.paths || {})) {
    for (const [method, op] of Object.entries(methods)) {
      if (flags.method && method !== flags.method) continue;
      const hay = [
        p,
        op.summary,
        op.description,
        (op.tags || []).join(" "),
        op.operationId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!kw || hay.includes(lower)) {
        results.push({ path: p, method, op, exact: p.toLowerCase() === lower });
      }
    }
  }
  // 精确匹配优先
  results.sort((a, b) => Number(b.exact) - Number(a.exact));
  return results;
}

// ---------- 渲染 ----------
function renderSchemaText(schema, indent = "  ") {
  return JSON.stringify(schema, null, 2)
    .split("\n")
    .map((l) => indent + l)
    .join("\n");
}

function renderEndpoint(ep, doc) {
  const { path: p, method, op } = ep;
  const lines = [];
  lines.push(`${method.toUpperCase()} ${p}`);
  if (op.summary) lines.push(`摘要: ${op.summary}`);
  if (op.description) lines.push(`说明: ${op.description}`);
  if (op.tags?.length) lines.push(`标签: ${op.tags.join(", ")}`);

  // query / path 参数
  if (op.parameters?.length) {
    lines.push("\n[请求参数 (query/path)]");
    for (const param of op.parameters) {
      const req = param.required ? " *必填" : "";
      const type = param.schema
        ? JSON.stringify(expand(param.schema, doc))
        : "";
      lines.push(
        `  - ${param.name} (${param.in})${req}: ${type}  ${param.description || ""}`
      );
    }
  }

  // requestBody
  const body = op.requestBody?.content;
  if (body) {
    const ct = Object.keys(body)[0];
    lines.push(`\n[请求体 (${ct})]`);
    let schema = expand(body[ct].schema, doc);
    // 标注 required 字段
    const required = body[ct].schema?.required || [];
    if (required.length && schema.properties) {
      schema = { ...schema, properties: { ...schema.properties } };
      for (const key of required) {
        if (schema.properties[key]) {
          schema.properties[key] = {
            _required: true,
            ...schema.properties[key],
          };
        }
      }
    }
    lines.push(renderSchemaText(schema));
  }

  // responses
  if (op.responses) {
    lines.push("\n[响应]");
    for (const [code, resp] of Object.entries(op.responses)) {
      lines.push(`  ${code}: ${resp.description || ""}`);
      const rc = resp.content;
      if (rc) {
        const ct = Object.keys(rc)[0];
        const schema = expand(rc[ct].schema, doc);
        lines.push(renderSchemaText(schema, "    "));
      }
    }
  }
  return lines.join("\n");
}

// ---------- 主流程 ----------
const { doc, fresh } = await loadDocs();
const matches = findEndpoints(doc, keyword);

if (matches.length === 0) {
  console.error(`未匹配到接口: "${keyword}"`);
  process.exit(3);
}

if (flags.list) {
  console.log(`匹配到 ${matches.length} 个接口${fresh ? "" : " (缓存)"}:`);
  for (const m of matches) {
    console.log(
      `  ${m.method.toUpperCase().padEnd(6)} ${m.path}  ${m.op.summary || ""}`
    );
  }
  process.exit(0);
}

// 多个匹配但非精确: 列出让用户/agent 进一步确认
const exact = matches.filter((m) => m.exact);
const target = exact.length ? exact : matches;

if (target.length > 1 && !flags.json) {
  console.log(
    `匹配到 ${target.length} 个接口,逐个输出。如需收敛请使用更精确的路径或 --method:\n`
  );
}

if (flags.json) {
  const out = target.map((ep) => ({
    path: ep.path,
    method: ep.method,
    summary: ep.op.summary,
    description: ep.op.description,
    tags: ep.op.tags,
    parameters: (ep.op.parameters || []).map((pm) => ({
      name: pm.name,
      in: pm.in,
      required: !!pm.required,
      description: pm.description,
      schema: expand(pm.schema, doc),
    })),
    requestBody: ep.op.requestBody
      ? (() => {
          const ct = Object.keys(ep.op.requestBody.content)[0];
          return {
            contentType: ct,
            schema: expand(ep.op.requestBody.content[ct].schema, doc),
          };
        })()
      : null,
    responses: Object.fromEntries(
      Object.entries(ep.op.responses || {}).map(([code, resp]) => {
        const rc = resp.content;
        const ct = rc && Object.keys(rc)[0];
        return [
          code,
          {
            description: resp.description,
            schema: ct ? expand(rc[ct].schema, doc) : null,
          },
        ];
      })
    ),
  }));
  console.log(JSON.stringify(target.length === 1 ? out[0] : out, null, 2));
} else {
  console.log(
    target
      .map((ep) => renderEndpoint(ep, doc))
      .join("\n\n" + "=".repeat(60) + "\n\n")
  );
}

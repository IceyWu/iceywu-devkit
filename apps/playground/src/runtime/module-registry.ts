/* biome-ignore-all lint/performance/noNamespaceImport: runtime export discovery and code execution need full module namespaces */
import * as rootUtils from "@iceywu/utils";
import * as arrayUtils from "@iceywu/utils/array";
import * as asyncTaskUtils from "@iceywu/utils/async-task";
import * as downloadUtils from "@iceywu/utils/download";
import * as isUtils from "@iceywu/utils/is";
import * as lodashLiteUtils from "@iceywu/utils/lodash-lite";
import * as logUtils from "@iceywu/utils/log";
import * as networkUtils from "@iceywu/utils/network";
import * as objectUtils from "@iceywu/utils/object";
import * as promiseUtils from "@iceywu/utils/promise";
import * as sharedUtils from "@iceywu/utils/shared";
import * as toProUtils from "@iceywu/utils/to-pro";
import * as toolsUtils from "@iceywu/utils/tools";
import * as typesUtils from "@iceywu/utils/types";

export interface ModuleSource {
  description: string;
  emptyState?: string;
  importPath: string;
  namespace: Record<string, unknown>;
  title: string;
}

export const moduleSources: ModuleSource[] = [
  {
    description: "根入口，放最常用的 Promise 包装和执行辅助。",
    importPath: "@iceywu/utils",
    namespace: rootUtils,
    title: "Root",
  },
  {
    description: "Promise 相关能力的独立入口。",
    importPath: "@iceywu/utils/promise",
    namespace: promiseUtils,
    title: "Promise",
  },
  {
    description: "数组生成、差集、过滤和列表清洗。",
    importPath: "@iceywu/utils/array",
    namespace: arrayUtils,
    title: "Array",
  },
  {
    description: "异步轮询、等待和聚合控制。",
    importPath: "@iceywu/utils/async-task",
    namespace: asyncTaskUtils,
    title: "Async Task",
  },
  {
    description: "对象深取值、深合并和空值清洗。",
    importPath: "@iceywu/utils/object",
    namespace: objectUtils,
    title: "Object",
  },
  {
    description: "运行时类型和环境判断。",
    importPath: "@iceywu/utils/is",
    namespace: isUtils,
    title: "Is",
  },
  {
    description: "随机、哈希和基础共享方法。",
    importPath: "@iceywu/utils/shared",
    namespace: sharedUtils,
    title: "Shared",
  },
  {
    description: "下载能力，面向浏览器文件下载场景。",
    importPath: "@iceywu/utils/download",
    namespace: downloadUtils,
    title: "Download",
  },
  {
    description: "轻量 lodash 风格方法集合。",
    importPath: "@iceywu/utils/lodash-lite",
    namespace: lodashLiteUtils,
    title: "Lodash Lite",
  },
  {
    description: "带样式的浏览器日志输出。",
    importPath: "@iceywu/utils/log",
    namespace: logUtils,
    title: "Log",
  },
  {
    description: "网络流式响应处理。",
    importPath: "@iceywu/utils/network",
    namespace: networkUtils,
    title: "Network",
  },
  {
    description: "安全解析、格式化和通用工具。",
    importPath: "@iceywu/utils/tools",
    namespace: toolsUtils,
    title: "Tools",
  },
  {
    description: "toPro 的单独导入路径。",
    importPath: "@iceywu/utils/to-pro",
    namespace: toProUtils,
    title: "To Pro",
  },
  {
    description: "类型工具入口，运行时不应该有任何值导出。",
    emptyState: "当前入口只有类型导出，所以这里不会出现运行时方法。",
    importPath: "@iceywu/utils/types",
    namespace: typesUtils,
    title: "Types",
  },
];

export const moduleRegistry = Object.fromEntries(
  moduleSources.map((moduleSource) => [
    moduleSource.importPath,
    moduleSource.namespace,
  ])
) as Record<string, Record<string, unknown>>;

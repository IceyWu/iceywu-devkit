import type { PlaygroundLogEntry, PlaygroundRunResult } from "../types";
import { moduleRegistry } from "./module-registry";

type AsyncRunner = new (
  ...args: string[]
) => (...params: unknown[]) => Promise<unknown>;

interface ImportBinding {
  localName: string;
  sourceName?: string;
  type: "named" | "namespace";
}

const IMPORT_BINDING_SPLITTER = /\s+as\s+/i;
const IMPORT_STATEMENT = /^\s*import\s+(.+?)\s+from\s+["']([^"']+)["'];?\s*$/gm;

function parseBindings(clause: string): ImportBinding[] {
  const trimmed = clause.trim();

  if (trimmed.startsWith("* as ")) {
    return [
      {
        localName: trimmed.slice(5).trim(),
        type: "namespace",
      },
    ];
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [sourceName, localName] = part
          .split(IMPORT_BINDING_SPLITTER)
          .map((value) => value.trim());

        return {
          localName: localName ?? sourceName,
          sourceName,
          type: "named" as const,
        };
      });
  }

  throw new Error("当前编辑器只支持 named import 和 namespace import。");
}

function toSerializableError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return { message: String(error), name: "Error" };
}

export async function executePlaygroundCode(
  sourceCode: string
): Promise<PlaygroundRunResult> {
  const scope: Record<string, unknown> = {};
  let executableCode = sourceCode;
  let match: RegExpExecArray | null;

  IMPORT_STATEMENT.lastIndex = 0;
  match = IMPORT_STATEMENT.exec(sourceCode);
  while (match !== null) {
    const [, clause, importPath] = match;
    const namespace = moduleRegistry[importPath];

    if (!namespace) {
      throw new Error(`不支持导入 ${importPath}，请使用内置 utils 子路径。`);
    }

    for (const binding of parseBindings(clause)) {
      if (binding.type === "namespace") {
        scope[binding.localName] = namespace;
        continue;
      }

      const resolved = namespace[binding.sourceName ?? ""];
      if (resolved === undefined) {
        throw new Error(
          `在 ${importPath} 中找不到导出 ${binding.sourceName}。`
        );
      }
      scope[binding.localName] = resolved;
    }

    match = IMPORT_STATEMENT.exec(sourceCode);
  }

  executableCode = sourceCode.replace(IMPORT_STATEMENT, "").trim();

  const logs: PlaygroundLogEntry[] = [];
  const consoleProxy = {
    error: (...values: unknown[]) => logs.push({ level: "error", values }),
    group: (...values: unknown[]) =>
      logs.push({ level: "info", values: ["[group]", ...values] }),
    groupEnd: () => logs.push({ level: "info", values: ["[groupEnd]"] }),
    info: (...values: unknown[]) => logs.push({ level: "info", values }),
    log: (...values: unknown[]) => logs.push({ level: "log", values }),
    warn: (...values: unknown[]) => logs.push({ level: "warn", values }),
  };

  const AsyncFunction = Object.getPrototypeOf(async () => undefined)
    .constructor as AsyncRunner;

  const startedAt = performance.now();

  try {
    const runner = new AsyncFunction(
      ...Object.keys(scope),
      "console",
      `"use strict";\n${executableCode}`
    );
    const value = await runner(...Object.values(scope), consoleProxy);

    return {
      durationMs: performance.now() - startedAt,
      logs,
      value,
    };
  } catch (error) {
    logs.push({ level: "error", values: [toSerializableError(error)] });

    return {
      durationMs: performance.now() - startedAt,
      logs,
      value: { error: toSerializableError(error) },
    };
  }
}

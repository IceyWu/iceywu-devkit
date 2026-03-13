import { moduleSources } from "../runtime/module-registry";
import { utilsExampleMap } from "../scenarios/utils";
import type { PlaygroundExportEntry, PlaygroundModuleEntry } from "../types";

function createKey(importPath: string, exportName: string) {
  return `${importPath}:${exportName}`;
}

function getRuntimeKind(value: unknown): PlaygroundExportEntry["runtimeKind"] {
  if (typeof value === "function") {
    const source = Function.prototype.toString.call(value);
    return source.startsWith("class ") ? "class" : "function";
  }

  if (value && typeof value === "object") {
    return "object";
  }

  return "value";
}

function toExports(importPath: string, namespace: Record<string, unknown>) {
  return Object.entries(namespace)
    .filter(([name, value]) => name !== "default" && value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([exportName, value]) => {
      const example = utilsExampleMap.get(createKey(importPath, exportName));

      return {
        example,
        exportName,
        hasExample: Boolean(example),
        importPath,
        runtimeKind: getRuntimeKind(value),
      } satisfies PlaygroundExportEntry;
    });
}

export const utilsModules: PlaygroundModuleEntry[] = moduleSources.map(
  (moduleSource) => {
    const exports = toExports(moduleSource.importPath, moduleSource.namespace);

    return {
      description: moduleSource.description,
      emptyState: moduleSource.emptyState,
      exports,
      importPath: moduleSource.importPath,
      runtimeCount: exports.length,
      title: moduleSource.title,
    };
  }
);

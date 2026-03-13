import { describe, expect, it } from "vitest";
import { moduleSources } from "../runtime/module-registry";
import { utilsExampleMap } from "./utils";

function getRuntimeKeys() {
  return moduleSources.flatMap((moduleSource) =>
    Object.entries(moduleSource.namespace)
      .filter(([name, value]) => name !== "default" && value !== undefined)
      .map(([name]) => `${moduleSource.importPath}:${name}`)
  );
}

describe("playground demo coverage", () => {
  it("covers every runtime export exactly once", () => {
    const runtimeKeys = getRuntimeKeys();
    const exampleKeys = new Set(utilsExampleMap.keys());

    const missing = runtimeKeys.filter((key) => !exampleKeys.has(key));
    const stale = [...exampleKeys].filter((key) => !runtimeKeys.includes(key));

    expect(missing).toEqual([]);
    expect(stale).toEqual([]);
    expect(exampleKeys.size).toBe(runtimeKeys.length);
  });

  it("keeps example metadata aligned with its map key", () => {
    for (const [key, example] of utilsExampleMap.entries()) {
      expect(key).toBe(`${example.importPath}:${example.exportName}`);
      expect(example.code.trim().length).toBeGreaterThan(0);
      expect(example.summary.trim().length).toBeGreaterThan(0);
      expect(example.title.trim().length).toBeGreaterThan(0);
    }
  });
});

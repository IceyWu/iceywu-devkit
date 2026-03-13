import type { PlaygroundExample } from "../types";

export type ExampleSeed = Omit<PlaygroundExample, "importPath">;

export function createExamples(
  importPath: string,
  seeds: readonly ExampleSeed[]
): PlaygroundExample[] {
  return seeds.map((seed) => ({
    ...seed,
    importPath,
  }));
}

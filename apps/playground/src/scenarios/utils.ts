import { arrayExamples } from "./array";
import { asyncTaskExamples } from "./async-task";
import { downloadExamples, logExamples, networkExamples } from "./browser";
import { isExamples } from "./is";
import { lodashLiteExamples } from "./lodash-lite";
import { objectExamples } from "./object";
import { promiseExamples, toProExamples } from "./promise";
import { sharedExamples } from "./shared";
import { toolsExamples } from "./tools";
import type { PlaygroundExample } from "../types";

function createKey(importPath: string, exportName: string) {
  return `${importPath}:${exportName}`;
}

function remapExamplesToRoot(
  examples: readonly PlaygroundExample[]
): PlaygroundExample[] {
  return examples.map((example) => ({
    ...example,
    code: example.code.split(example.importPath).join("@iceywu/utils"),
    importPath: "@iceywu/utils",
  }));
}

const rootExamples = remapExamplesToRoot([
  ...promiseExamples,
  ...arrayExamples,
  ...asyncTaskExamples,
  ...objectExamples,
  ...isExamples,
  ...sharedExamples,
  ...downloadExamples,
  ...lodashLiteExamples,
  ...logExamples,
  ...networkExamples,
  ...toolsExamples,
]);

const exampleList = [
  ...rootExamples,
  ...promiseExamples,
  ...arrayExamples,
  ...asyncTaskExamples,
  ...objectExamples,
  ...isExamples,
  ...sharedExamples,
  ...downloadExamples,
  ...lodashLiteExamples,
  ...logExamples,
  ...networkExamples,
  ...toolsExamples,
  ...toProExamples,
];

export const utilsExampleMap = new Map(
  exampleList.map((example) => [
    createKey(example.importPath, example.exportName),
    example,
  ])
);

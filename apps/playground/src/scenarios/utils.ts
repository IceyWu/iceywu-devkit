import { arrayExamples } from "./array";
import { asyncTaskExamples } from "./async-task";
import { downloadExamples, logExamples, networkExamples } from "./browser";
import { isExamples } from "./is";
import { lodashLiteExamples } from "./lodash-lite";
import { objectExamples } from "./object";
import { promiseExamples, rootExamples, toProExamples } from "./promise";
import { sharedExamples } from "./shared";
import { toolsExamples } from "./tools";

function createKey(importPath: string, exportName: string) {
  return `${importPath}:${exportName}`;
}

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

import type { PlaygroundExample } from "../types";
import { createExamples, type ExampleSeed } from "./helpers";

const promiseSeeds: ExampleSeed[] = [
  {
    code: `import { to } from "@iceywu/utils";

const success = await to(Promise.resolve({ ok: true, code: 200 }));
const failure = await to(
  Promise.reject(Object.assign(new Error("playground request failed"), { code: 500 }))
);

return {
  success,
  failure: [failure[0]?.message, failure[0]?.code, failure[1]],
};`,
    exportName: "to",
    input: {
      failure: "Promise.reject(Error)",
      success: "Promise.resolve({ ok: true, code: 200 })",
    },
    notes: ["统一返回 [error, value]，适合请求链路或表单提交。"],
    summary: "同时查看 Promise 成功和失败分支在 to() 下的元组结构。",
    title: "Promise 元组结果",
  },
  {
    code: `import { toTry } from "@iceywu/utils";

const syncResult = await toTry((name, suffix) => name.toUpperCase() + suffix, "icey", "-WU");
const asyncResult = await toTry(async () => {
  throw new Error("async explode");
});

return {
  syncResult,
  asyncResult: [asyncResult[0]?.message ?? asyncResult[0], asyncResult[1]],
};`,
    exportName: "toTry",
    input: {
      asyncAction: "throw new Error('async explode')",
      syncAction: "(name, suffix) => name.toUpperCase() + suffix",
    },
    summary: "对比同步函数和异步函数在 toTry() 下的捕获结果。",
    title: "同步与异步捕获",
  },
  {
    code: `import { toPro } from "@iceywu/utils";

const [error, picked] = await toPro(
  Promise.resolve({
    data: {
      profile: { name: "Icey", city: "Hangzhou" },
      role: "maintainer",
    },
  }),
  [
    { keys: ["data", "profile"] },
    { keys: ["data", "role"] },
    { keys: ["data", "profile", "city"] },
  ]
);

return { error, picked };`,
    exportName: "toPro",
    input: {
      keys: [
        ["data", "profile"],
        ["data", "role"],
        ["data", "profile", "city"],
      ],
    },
    summary: "把响应体映射成更短的消费结构，减少调用方取值成本。",
    title: "提取响应片段",
  },
];

export const rootExamples: PlaygroundExample[] = createExamples(
  "@iceywu/utils",
  promiseSeeds
);

export const promiseExamples: PlaygroundExample[] = createExamples(
  "@iceywu/utils/promise",
  promiseSeeds
);

export const toProExamples: PlaygroundExample[] = createExamples(
  "@iceywu/utils/to-pro",
  promiseSeeds.filter((seed) => seed.exportName === "toPro")
);

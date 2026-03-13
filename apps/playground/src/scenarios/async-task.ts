import { createExamples } from "./helpers";

export const asyncTaskExamples = createExamples("@iceywu/utils/async-task", [
  {
    code: `import { AggregateError } from "@iceywu/utils/async-task";

const aggregate = new AggregateError([
  new Error("first failure"),
  new TypeError("second failure"),
]);

return {
  errorCount: aggregate.errors.length,
  message: aggregate.message,
  name: aggregate.name,
};`,
    exportName: "AggregateError",
    summary: "查看异常聚合类会如何汇总多个错误。",
    title: "聚合错误实例",
  },
  {
    code: `import { AggregateError, all } from "@iceywu/utils/async-task";

const success = await all({
  profile: Promise.resolve({ id: 7, role: "maintainer" }),
  metrics: Promise.resolve({ downloads: 1200 }),
});

let aggregateInfo;

try {
  await all({
    ok: Promise.resolve("ok"),
    broken: Promise.reject(new Error("aggregate boom")),
  });
} catch (error) {
  aggregateInfo = {
    isAggregateError: error instanceof AggregateError,
    message: error instanceof Error ? error.message : String(error),
  };
}

return { success, aggregateInfo };`,
    exportName: "all",
    summary: "同时看 all() 的成功聚合和异常聚合。",
    title: "聚合 Promise",
  },
  {
    code: `import { getAsyncTask } from "@iceywu/utils/async-task";

let count = 0;

const { task } = getAsyncTask(
  async () => {
    count += 1;
    return {
      data: { done: count >= 3 },
      count,
    };
  },
  {
    asyncTime: 5,
    maxTimes: 5,
    rules: [{ keys: ["data", "done"], val: true }],
  }
);

const result = await task;

return {
  count,
  result,
};`,
    exportName: "getAsyncTask",
    notes: ["这个示例用极短轮询间隔模拟异步轮询任务。"],
    summary: "模拟轮询直到命中规则，验证 getAsyncTask() 的停止条件。",
    title: "轮询任务",
  },
  {
    code: `import { sleep } from "@iceywu/utils/async-task";

const startedAt = Date.now();
await sleep(20);

return {
  elapsedMs: Date.now() - startedAt,
  waited: true,
};`,
    exportName: "sleep",
    summary: "异步等待指定毫秒数，适合串联节流和轮询示例。",
    title: "短暂等待",
  },
]);

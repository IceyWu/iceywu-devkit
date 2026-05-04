import { isArray } from "../is";
import { get } from "../object";
import type { Awaitable } from "../types";

interface Rules {
  keys?: string | string[];
  predicate?: (val: any) => boolean;
  val?: any;
}
export interface GetAsyncTaskOptions {
  asyncTime?: number;
  autoStart?: boolean;
  maxTimes?: number;
  params?: any;
  rules?: Rules[];
}

export interface GetAsyncTaskReturn {
  start: () => void;
  stop: () => void;
  task: Promise<any>;
}

/**
 * @description 异步任务
 * @param request 请求函数
 * @param option 选项 rules:判断条件 params:请求参数 asyncTime:异步时间 maxTimes:最大次数 autoStart:是否自动开始
 * @returns { task, stop, start } task:异步任务 stop:停止异步任务 start:开始异步任务
 * @example
 * ```
 * const { task, start } = getAsyncTask(fetchJob, {
 *   autoStart: false,
 *   asyncTime: 1000,
 *   rules: [{ keys: ["data", "done"], val: true }],
 * });
 *
 * start();
 * const result = await task;
 * ```
 */
export function getAsyncTask(
  request: Awaitable<any>,
  option: GetAsyncTaskOptions
): GetAsyncTaskReturn {
  let timer: string | number | NodeJS.Timeout | undefined;
  let index = 0;
  let stopFlag = false;
  let started = false;
  const {
    rules = [],
    asyncTime = 1000,
    maxTimes = -1,
    autoStart = true,
  } = option;

  const getParams = () =>
    typeof option.params === "function" ? option.params() : option.params;

  const executeTask = async (resolve: (value: any) => void) => {
    const res = await request(getParams());
    if (!res) {
      return res;
    }

    const isComplete = rules.every(({ keys, val, predicate }) => {
      const actualVal = get(res, keys);
      return predicate ? predicate(actualVal) : actualVal === val;
    });

    if (isComplete || (maxTimes >= 0 && index > maxTimes) || stopFlag) {
      clearTimeout(timer);
      resolve(res);
    } else {
      index++;
      timer = setTimeout(() => executeTask(resolve), asyncTime);
    }
  };

  const task = new Promise((resolve) => {
    const startTask = () => {
      if (!started) {
        started = true;
        stopFlag = false;
        executeTask(resolve);
      }
    };

    if (autoStart) {
      startTask();
    }
  });

  return {
    task,
    start() {
      if (!started) {
        started = true;
        stopFlag = false;
        timer = setTimeout(() => executeTask(() => {}), 0);
      }
    },
    stop() {
      stopFlag = true;
      started = false;
      clearTimeout(timer);
    },
  };
}

type PromiseValues<T extends Promise<any>[]> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : never;
};
export class AggregateError extends Error {
  errors: Error[];
  constructor(errors: Error[] = []) {
    super();
    const name = errors.find((e) => e.name)?.name || "";
    this.name = `AggregateError(${name}...)`;
    this.message = `AggregateError with ${errors.length} errors`;
    this.stack = errors.find((e) => e.stack)?.stack || this.stack;
    this.errors = errors;
  }
}

/**
 * @description 类似 Promise.all，但会汇总所有异常并抛出 AggregateError
 * @param promises promise 列表或对象
 * @returns 聚合后的结果
 * @example
 * ```
 * const { user, posts } = await all({
 *   user: getUser(),
 *   posts: getPosts(),
 * });
 * ```
 */
export async function all<T extends Record<string, Promise<any>>>(
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }>;
export async function all<
  T extends Record<string, Promise<any>> | Promise<any>[],
>(promises: T) {
  const entries = isArray(promises)
    ? promises.map((p) => [null, p] as [null, Promise<any>])
    : Object.entries(promises);

  const results = await Promise.all(
    entries.map(([key, value]) =>
      value
        .then((result) => ({ result, exc: null, key }))
        .catch((exc) => ({ result: null, exc, key }))
    )
  );

  const exceptions = results.filter((r) => r.exc);
  if (exceptions.length > 0) {
    throw new AggregateError(exceptions.map((e) => e.exc));
  }

  if (isArray(promises)) {
    return results.map((r) => r.result) as T extends Promise<any>[]
      ? PromiseValues<T>
      : unknown;
  }

  return results.reduce(
    (acc, item) => ({
      ...acc,
      [item.key!]: item.result,
    }),
    {} as { [K in keyof T]: Awaited<T[K]> }
  );
}

/**
 * @description 异步等待指定毫秒数
 * @param milliseconds 等待时间
 * @returns Promise
 * @example
 * ```
 * await sleep(500);
 * ```
 */
export function sleep(milliseconds: number) {
  return new Promise((res) => setTimeout(res, milliseconds));
}

import { isArray } from "../is";
import { getObjVal } from "../object";
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
 * // rules:判断条件
 * // 1.请求接口放回数据后，判断返回数据中code为200，且data.complete为true
 * // {
 * //  code: 200,
 * //  data: {
 * //complete: true
 * //  }
 * // }
 *const rules = [
 *      {
 *         keys: "code",
 *         val: 200,
 *      },
 *      {
 *         keys: ["data", "complete"],
 *         val: true,
 *        // 优先级高于val
 *        predicate: (val) => val === true,
 *      }
 *    ];
 *    const params = {};
 *    const { task, stop, start } = getAsyncTask(asyncTaskApi, { rules, params, asyncTime:1000, maxTimes:-1, autoStart: false });
 *    start(); // 手动开始任务
 * ```
 */
export function getAsyncTask(
  request: Awaitable<any>,
  option: GetAsyncTaskOptions
): GetAsyncTaskReturn {
  let timer: string | number | NodeJS.Timeout | undefined;
  let index = 0;
  let stopFlag = false;
  let started = false; // 标记是否已经开始
  const {
    rules = [],
    asyncTime = 1000,
    maxTimes = -1,
    autoStart = true,
  } = option;

  const getParams = () =>
    typeof option.params === "function" ? option.params() : option.params;

  // 提取重复逻辑到一个独立函数
  const executeTask = async (resolve: (value: any) => void) => {
    const res = await request(getParams());
    if (!res) {
      return res;
    }

    const isComplete = rules.every(({ keys, val, predicate }) => {
      const actualVal = getObjVal(res, keys);
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
        stopFlag = false; // 重置 stopFlag
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
 * Functionally similar to Promise.all or Promise.allSettled. If any
 * errors are thrown, all errors are gathered and thrown in an
 * AggregateError.
 * @description like Promise.all or Promise.allSettled functions
 * @param promises promise 列表
 * @returns res
 * @example
 * const { user } = await all({
 *   user: api.users.create(...),
 *   bucket: s3.buckets.create(...),
 *   message: slack.customerSuccessChannel.sendMessage(...)
 * })
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
 * @description Async wait（异步等待）
 * @param milliseconds 等待时间
 * @returns Promise
 */
export function sleep(milliseconds: number) {
  return new Promise((res) => setTimeout(res, milliseconds));
}

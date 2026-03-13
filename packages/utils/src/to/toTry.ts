type ActionResult<T, E = Error> = [null, T] | [E, undefined];

/**
 * @description 捕获同步或异步函数抛出的错误，并返回与 to() 一致的元组结果
 * @param action 要执行的同步或异步操作
 * @param args 其他参数
 * @return [error, result]
 */
export async function toTry<T, Args extends unknown[], E = Error>(
  action: (...args: Args) => T | Promise<T>,
  ...args: Args
): Promise<ActionResult<T, E>> {
  try {
    const result = await action(...args);
    return [null, result];
  } catch (error) {
    return [error as E, undefined];
  }
}

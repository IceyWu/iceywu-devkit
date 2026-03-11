/**
 * @description 基于Promise.try()的错误捕获封装，模拟to()函数的行为
 * @param {Function} action 要执行的异步或者同步操作
 * @param {...any} args 其他参数
 * @return {[any, any]} [result, error] 结果和错误
 */
export async function toTry(action: any, ...args: any[]) {
  const res = [undefined, undefined];
  await Promise.resolve()
    .then(() => action(...args))
    .then((result: any) => {
      res[0] = result;
    })
    .catch((error: any) => {
      res[1] = error;
    });
  return res;
}

export default {
  toTry,
};

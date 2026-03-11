/**
 * @description promise error catch(捕获promise错误)
 * @param { Promise } promise
 * @param {object=} errorExt - Additional Information you can pass to the err object
 * @return { [Error, undefined] | [null, T] } [error, data]
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = { ...err, ...errorExt };
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export default to;

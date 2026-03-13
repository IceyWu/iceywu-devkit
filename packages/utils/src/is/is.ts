import { toTypeString } from "../shared/base";

type AnyFunction = (...args: never[]) => unknown;

/**
 * @category Is
 */
export const isDef = <T>(val: T | undefined): val is T =>
  typeof val !== "undefined";
/**
 * @category Is
 */
export const isBoolean = (val: unknown): val is boolean =>
  typeof val === "boolean";
/**
 * @category Is
 */
export const isFunction = <T extends AnyFunction>(val: unknown): val is T =>
  typeof val === "function";
/**
 * @category Is
 */
export const isNumber = (val: unknown): val is number =>
  typeof val === "number";
/**
 * @category Is
 */
export const isString = (val: unknown): val is string =>
  typeof val === "string";
/**
 * @category Is
 */
export function isObject(val: unknown): val is Record<PropertyKey, unknown> {
  return val !== null && typeof val === "object";
}
/**
 * @category Is
 */
export function isPlainObject(val: unknown): val is object {
  return toTypeString(val) === "[object Object]";
}
/**
 * @category Is
 */
export const isArray = Array.isArray;
/**
 * @category Is
 */
export function isMap(val: unknown): val is Map<unknown, unknown> {
  return toTypeString(val) === "[object Map]";
}
/**
 * @category Is
 */
export function isSet(val: unknown): val is Set<unknown> {
  return toTypeString(val) === "[object Set]";
}
/**
 * @category Is
 */
export const isDate = (val: unknown): val is Date => val instanceof Date;
/**
 * @category Is
 */
export const isRegExp = (val: unknown): val is RegExp => val instanceof RegExp;
/**
 * @category Is
 */
export const isSymbol = (val: unknown): val is symbol =>
  typeof val === "symbol";
/**
 * @category Is
 */
export const isPromise = <T = unknown>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch);
/**
 * @category Is
 */
export const isValue = (val: unknown): val is NonNullable<unknown> =>
  val !== undefined && val !== null;
/**
 * @category Is
 */
export function isEmpty(val: unknown): boolean {
  return (
    val === null ||
    val === undefined ||
    (Array.isArray(val) && Object.keys(val).length <= 0) ||
    (isObject(val) && Object.keys(val).length <= 0) ||
    (isString(val) && val.trim().length <= 0)
  );
}

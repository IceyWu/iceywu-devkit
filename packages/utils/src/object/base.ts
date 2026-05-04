import { removeListEmptyVal } from "../array";
import { isArray, isEmpty, isObject } from "../is";
import type { DeepPartial } from "../types";

/* -------------------------------------------------------------------------- */
/* Path-aware get / set (behavior aligned with lodash@4)                      */
/* -------------------------------------------------------------------------- */

const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*\1)\]/;
const reIsPlainProp = /^\w*$/;
const reIsUint = /^(?:0|[1-9]\d*)$/;
const MAX_SAFE_INDEX = 9_007_199_254_740_991;

function isPathKey(value: unknown, owner?: unknown): boolean {
  if (Array.isArray(value)) {
    return false;
  }
  const t = typeof value;
  if (t === "number" || t === "symbol" || t === "boolean" || value == null) {
    return true;
  }
  return (
    reIsPlainProp.test(value as string) ||
    !reIsDeepProp.test(value as string) ||
    (owner != null && (value as string) in (owner as object))
  );
}

function stringToPath(input: string): string[] {
  const result: string[] = [];
  if (input.charCodeAt(0) === 46 /* . */) {
    result.push("");
  }
  input.replace(rePropName, (match, _number, quote, sub) => {
    result.push(
      quote ? (sub as string).replace(reEscapeChar, "$1") : _number || match
    );
    return "";
  });
  return result;
}

function castPath(value: unknown, owner?: unknown): PropertyKey[] {
  if (Array.isArray(value)) {
    return value as PropertyKey[];
  }
  return isPathKey(value, owner)
    ? [value as PropertyKey]
    : (stringToPath(String(value)) as PropertyKey[]);
}

function isLikelyIndex(value: unknown, length = MAX_SAFE_INDEX): boolean {
  const t = typeof value;
  const num =
    t === "number"
      ? (value as number)
      : t === "symbol"
        ? Number.NaN
        : Number(value);
  return (
    !!length &&
    (t === "number" || (t !== "symbol" && reIsUint.test(String(value)))) &&
    num > -1 &&
    num % 1 === 0 &&
    num < length
  );
}

function pathGet(object: unknown, path: PropertyKey | PropertyKey[]): unknown {
  if (object == null) {
    return;
  }
  const segments = castPath(path, object);
  let cursor: any = object;
  let index = 0;
  const length = segments.length;
  while (cursor != null && index < length) {
    cursor = cursor[segments[index++] as keyof typeof cursor];
  }
  return index && index === length ? cursor : undefined;
}

function pathSet(
  object: unknown,
  path: PropertyKey | PropertyKey[],
  value: unknown
): unknown {
  if (object == null || (typeof object !== "object" && typeof object !== "function")) {
    return object;
  }
  const segments = castPath(path, object);
  const length = segments.length;
  const lastIndex = length - 1;
  let nested: any = object;
  let index = -1;
  while (nested != null && ++index < length) {
    const key = segments[index] as keyof typeof nested;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object;
    }
    let nextValue: unknown = value;
    if (index !== lastIndex) {
      const existing = nested[key];
      nextValue =
        existing !== null && typeof existing === "object"
          ? existing
          : isLikelyIndex(segments[index + 1])
            ? []
            : {};
    }
    nested[key] = nextValue;
    nested = nested[key];
  }
  return object;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * @description Object.prototype.hasOwnProperty 的安全调用封装
 * @param val 对象
 * @param key 键
 * @returns 是否存在该键
 */
export function hasOwn(
  val: object,
  key: string | symbol
): key is keyof typeof val {
  if (val == null) {
    return false;
  }
  return hasOwnProperty.call(val, key);
}

/**
 * @description 深度合并两个对象
 * @param original 原始对象
 * @param patch 补丁对象
 * @returns merged object
 */
export function deepMerge<T>(original: T, patch: DeepPartial<T>): T {
  const o = original as any;
  const p = patch as any;

  if (isArray(o) && isArray(p)) {
    return [...o, ...p] as any;
  }

  if (isArray(o)) {
    return [...o] as any;
  }

  const output = { ...o };
  if (isObject(o) && isObject(p)) {
    Object.keys(p).forEach((key) => {
      if (isObject(p[key])) {
        if (key in o) {
          output[key] = deepMerge(o[key], p[key]);
        } else {
          Object.assign(output, { [key]: p[key] });
        }
      } else {
        Object.assign(output, { [key]: p[key] });
      }
    });
  }
  return output;
}

/**
 * @description 检查对象是否有某个键
 * @param obj 对象
 * @param keys 键
 * @returns boolean
 */
export function hasKey(obj: any, keys: string | string[]): boolean {
  if (Array.isArray(keys)) {
    let temp = obj;
    for (let i = 0; i < keys.length; i++) {
      if (hasOwn(temp, keys[i])) {
        temp = temp[keys[i]];
      } else {
        return false;
      }
    }
    return true;
  }
  return hasOwn(obj, keys);
}

/**
 * @description 设置对象值
 * @param obj 对象
 * @param keys 键
 * @param value 值
 * @returns Object
 */
export function set(
  obj: any,
  keys: string | string[],
  value: any
): any {
  return pathSet(obj, keys, value);
}

/**
 * @description 获取对象属性
 * @param data 对象
 * @param path 属性路径
 * @param defaultValue 默认值
 * @param isIncludedNull 是否包含 null 值
 * @returns 属性值
 */
export function get(
  data: any,
  path: string | string[] | undefined,
  defaultValue: any = undefined,
  isIncludedNull = true
) {
  if (isEmpty(path)) {
    return data;
  }
  const raw = pathGet(data, path as PropertyKey | PropertyKey[]);
  const val = raw === undefined ? defaultValue : raw;
  return isIncludedNull && val === null ? defaultValue : val;
}

/**
 * @description 获取对象属性通过 key 列表（只要取到有效值就返回，否则返回默认值）
 * @param data 对象
 * @param keys 键列表
 * @param defaultValue 默认值
 * @param returnFn 返回函数
 * @returns 属性值
 */
export function getObjValByKeys(
  data: any,
  keys: string[],
  defaultValue: any = undefined,
  returnFn?: (val: any) => any
): any {
  if (!isArray(keys) || keys.length === 0) {
    return data;
  }
  for (let i = 0; i < keys.length; i++) {
    const val = get(data, keys[i], undefined);
    const _returnFn = returnFn || ((val: any) => !isEmpty(val));
    if (_returnFn(val)) {
      return val;
    }
  }
  return defaultValue;
}

export interface excludeOptions {
  keys?: string[];
  vals?: any[];
}
/**
 * @description 去除对象中的空值，包括空数组
 * @param obj 对象
 * @param exclude 排除的字段
 * @returns merged object
 * @example
 * ```
 * removeEmptyValues({ a: 1, b: "", c: null });
 * // => { a: 1 }
 * ```
 */
export function removeEmptyValues(obj: any, exclude?: excludeOptions) {
  if (!isObject(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return removeListEmptyVal(obj);
  }
  const result: any = {};
  const { vals = [], keys = [] } = exclude ?? ({} as excludeOptions);
  Object.entries(obj).forEach(([key, value]) => {
    const val: any = value;
    if (vals.includes(value)) {
      result[key] = val;
    } else if (!isEmpty(val)) {
      result[key] = removeEmptyValues(val, exclude);
    }
    if (
      isEmpty(result[key]) &&
      !vals.includes(result[key]) &&
      !keys.includes(key)
    ) {
      delete result[key];
    }
  });
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (hasKey(obj, k)) {
      const valT = get(obj, k);
      set(result, k, valT);
    }
  }

  return result;
}

/**
 * @description 去除树状数据中指定的数据
 * @param treeData 树状数据
 * @param matchFunction 匹配函数
 * @returns Array 处理好的值
 * @example
 * ```
 * removeTreeData([{ id: 1 }, { id: 2 }], (item) => item.id === 1);
 * ```
 */
export const removeTreeData: any = (
  treeData: any[],
  matchFunction: (item: any) => boolean
) => {
  if (!Array.isArray(treeData) || treeData.length === 0) {
    return treeData;
  }
  const result = [];
  for (let i = 0; i < treeData.length; i++) {
    if (matchFunction(treeData[i])) {
      continue;
    }
    if (treeData[i].children && treeData[i].children.length > 0) {
      result.push({
        ...treeData[i],
        children: removeTreeData(treeData[i].children, matchFunction),
      });
    } else {
      result.push(treeData[i]);
    }
  }

  return result;
};

export default {
  deepMerge,
  hasOwn,
  removeEmptyValues,
  hasKey,
  set,
  get,
  removeTreeData,
  getObjValByKeys,
};

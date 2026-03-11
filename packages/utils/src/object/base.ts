import get_base from "lodash/get.js";
import set_base from "lodash/set.js";
import { removeListEmptyVal } from "../array";
import { isArray, isDate, isEmpty, isObject, isRegExp } from "../is";
import type { DeepPartial } from "../types";

/**
 * A deep clone method to ensure that circular references are avoided.
 * 一个深度克隆方法来保证避免循环引用
 *
 * @category Object
 *
 * @param origin any complex type of object
 * @param hash hashMap
 * @returns a deep clone object
 */
export function deepClone2(origin: any, hash = new WeakMap()): any {
  if (isObject(origin)) {
    if (hash.has(origin)) {
      return hash.get(origin);
    }

    const target: any = isArray(origin) ? [] : {};
    hash.set(origin, target);

    Object.entries(origin).forEach(([k, v]: [string, any]) => {
      if (isRegExp(v)) {
        target[k] = new RegExp(v);
      } else if (isDate(v)) {
        target[k] = new Date(v);
      } else {
        target[k] = deepClone2(v, hash);
      }
    });
    return target;
  }
  return origin;
}

/**
 * extend Fn equal `Object.assign`
 * @category Object
 */
export const extend = Object.assign;

const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Object.prototype.hasOwnProperty
 * @category Object
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
 * Deep merge two objects
 * 深度合并两个对象
 *
 * @category Object
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
 * Check if an object has a key
 * 检查对象是否有某个键
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
 * Set object value
 * 对象复值
 * @param obj 对象
 * @param keys 键
 * @returns Object
 */
export function setObjValue(
  obj: any,
  keys: string | string[],
  value: any
): any {
  return set_base(obj, keys, value);
}

export const set = setObjValue;
/**
 * @description 获取对象属性
 * @param data 对象
 * @param path 属性路径 支持数组 ['a', 'b', 'c'] 或字符串 'a'
 * @param defaultValue 默认值，当属性值为 undefined 时返回
 * @param isIncludedNull 是否包含 null 值
 * @returns { any } any:属性值
 */
export function getObjVal(
  data: any,
  path: string | string[] | undefined,
  defaultValue: any = undefined,
  isIncludedNull = true
) {
  const val = isEmpty(path)
    ? data
    : get_base(data, path as string | string[], defaultValue);
  return isIncludedNull && val === null ? defaultValue : val;
}

export const get = getObjVal;

/**
 * @description 获取对象属性通过key列表（只要取到有效值就返回，否则返回默认值）
 * @param data 对象
 * @param keys 键列表
 * @param defaultValue 默认值，当所有属性值为 undefined/null 时返回
 * @param returnFn 返回函数
 * @returns { any } any:属性值
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
    const val = getObjVal(data, keys[i], undefined);
    const _returnFn = returnFn || ((val: any) => !isEmpty(val));
    if (_returnFn(val)) {
      return val;
    }
  }
  return defaultValue;
}

/**
 * Remove empty values from objects, including empty arrays
 * 去除对象中的空值，包括空数组
 *
 * @param obj 对象
 * @param exclude 排除的字段
 * @returns merged object
 * @category object
 * @example
 * ```
 *
 *  const tempData = {
 *   a: { a: 1, c: 2 },
 *   c: 10,
 *   b: "",
 *   k: {
 *     a: "qq",
 *     b: null,
 *     c: undefined,
 *   },
 *   G: {
 *     q: {
 *       o: {
 *         s: "",
 *         m: 26,
 *       },
 *     },
 *   },
 * };
 *  const newList = removeEmptyValues(tempData);
 * //  {"a": {"a": 1,"c": 2},"c": 10,"k": {},"G": {"q": {"o": {"m": 26}}}}
 *
 * ```
 */
export interface excludeOptions {
  keys?: string[];
  vals?: any[];
}
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
      const valT = getObjVal(obj, k);
      setObjValue(result, k, valT);
    }
  }

  return result;
}

/**
 * Remove `tree data` that matches the specified value
 * 去除树状数据中指定的数据
 *
 * @category Base
 * @param treeData 树状数据
 * @param matchFunction 匹配函数
 * @returns Array 处理好的值
 * @example
 * ```
 *const treeData = [
 *  {
 *    id: 1,
 *    name: "A",
 *    children: [
 *      {
 *        id: 2,
 *        name: "B",
 *        children: [
 *          {
 *            id: 3,
 *            name: "C",
 *            children: [],
 *          },
 *        ],
 *      },
 *      {
 *        id: 4,
 *        name: "D",
 *        children: [],
 *      },
 *    ],
 *  },
 *  {
 *    id: 5,
 *    name: "E",
 *    children: [],
 *  },
 *];
 *const matchFunction = (item:any) => item.id === 3;
 *const newTreeData = removeTreeData(treeData, matchFunction);
 *
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
  // deepClone,
  deepClone2,
  deepMerge,
  extend,
  hasOwn,
  removeEmptyValues,
  hasKey,
  setObjValue,
  getObjVal,
  removeTreeData,
  set,
  get,
  getObjValByKeys,
};

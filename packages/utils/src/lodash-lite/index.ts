import cloneDeep from "lodash/cloneDeep.js";
import fromPairs from "lodash/fromPairs.js";
import isEqualWithBae from "lodash/isEqualWith.js";
import nth from "lodash/nth.js";
import sortBy from "lodash/sortBy.js";
import toPairs from "lodash/toPairs.js";

/**
 * @description Sorts an object by its keys(对象排序)
 * @param obj Object to sort(需要排序的对象)
 * @returns { sortedObj } sortedObj:排序后的对象
 * @example
 * ```
 * sortObj({ b: 2, a: 1 });
 * // => { a: 1, b: 2 }
 * ```
 */
export function sortObj(obj: Record<string, any>): Record<string, any> {
  const sortedObj = fromPairs(
    sortBy(toPairs(obj), ([key]: [string, any]) => key)
  );
  return sortedObj;
}

/**
 * @description deep clone value(深拷贝)
 * @param data value
 * @returns { data } data:深拷贝后的值
 * @example
 * ```
 * const copy = deepClone({ nested: { ok: true } });
 * ```
 */
export function deepClone(data: Record<string, any>): Record<string, any> {
  return cloneDeep(data);
}

/**
 * @description 返回两对象中变化过的数据
 * @param oldVal 旧对象
 * @param newVal 新对象
 * @returns { differences } differences:变化过的数据
 * @example
 * ```
 * compareObjects({ a: 1 }, { a: 2, b: 3 });
 * // => { a: 2, b: 3 }
 * ```
 */
export function compareObjects(oldVal: any, newVal: any): any {
  const differences: any = {};
  Object.keys(newVal).forEach((key) => {
    if (!isEqualWithBae(newVal[key], oldVal[key])) {
      differences[key] = newVal[key];
    }
  });
  return differences;
}

/**
 * @description 获取 array 数组的第 n 个元素
 * @param array 要查询的数组
 * @param n 要返回元素的索引
 * @param defaultVal 默认值(可选)
 * @returns {*} 返回 array 数组的第 n 个元素
 * @example
 * ```
 * arrayNth(["a", "b", "c"], -1);
 * // => "c"
 * ```
 */
export function arrayNth(array: any[], n: number, defaultVal?: any): any {
  return nth(array, n) ?? defaultVal;
}

export default {
  sortObj,
  deepClone,
  compareObjects,
  arrayNth,
};

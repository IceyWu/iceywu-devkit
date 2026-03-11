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
 * @category LodashLite
 * @example
 * ```
 *
 *  const tempData = {
 *  a: { a: 1, c: 2 },
 *  c: 123,
 *  f: 2,
 *  s: "123",
 *  e: 0,
 *  b: 3,
 * };
 *  const newList = sortObj(tempData);
 * // {"a": {"a": 1,"c": 2},"b": 3,"c": 123,"e": 0,"f": 2,"s": "123"}
 *
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
 * @category LodashLite
 * @example
 * ```
 *
 *  const tempData = {
 *  a: { a: 1, c: 2 },
 *  c: 123,
 *  f: 2,
 *  s: "123",
 *  e: 0,
 *  b: 3,
 * };
 *  const newList = sortObj(tempData);
 *  // {"a": {"a": 1,"c": 2},"c": 123,"f": 2,"s": "123","e": 0,"b": 3}
 *
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
 * @category LodashLite
 * @example
 * ```
 *
 * const tempData = {
 *  a: { a: 1, c: 2 },
 *  c: 10,
 * };
 * const oldtempData = {
 *  a: { a: 1, c: 3 },
 *  b: 20,
 * };
 * const newList = compareObjects(tempData, oldtempData);
 * // {"a": {"a": 1,"c": 3},"b": 20}
 *
 * ```
 *
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
 * @description 获取array数组的第n个元素。如果n为负数，则返回从数组结尾开始的第n个元素。
 * @param array (Array): 要查询的数组。
 * @param n (number): 要返回元素的索引。
 * @param defaultVal 默认值(可选)
 * @returns {*} 返回array数组的第n个元素。
 * @example
 * ```
 * nth(['a', 'b', 'c', 'd'], 1);
 * // => 'b'
 * nth(['a', 'b', 'c', 'd'], -2);
 * // => 'c'
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

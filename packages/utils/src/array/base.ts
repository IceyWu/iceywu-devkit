import { isFunction } from "../is";
import { removeEmptyValues } from "../object";

/**
 * @description 返回数组不同的值
 * @param root (Array): 要检查的数组1。
 * @param other (Array): 要检查的数组2。
 * @returns [values] (...Array): 排除的值。
 */
export function diff<T>(
  root: readonly T[],
  other: readonly T[],
  identity: (item: T) => string | number | symbol = (t: T) =>
    t as unknown as string | number | symbol
): T[] {
  if (!(root?.length || other?.length)) {
    return [];
  }
  if (root?.length === undefined) {
    return [...other];
  }
  if (!other?.length) {
    return [...root];
  }
  const bKeys = other.reduce(
    (acc, item) => {
      acc[identity(item)] = true;
      return acc;
    },
    {} as Record<string | number | symbol, boolean>
  );
  return root.filter((a) => !bKeys[identity(a)]);
}

/**
 * @description 数组扁平化（Given an array of arrays, returns a single dimentional array with all items in it.）
 * @param lists (Array): 要扁平化的数组。
 * @returns newList: 要扁平化后数组
 */
export function flat<T>(lists: readonly T[][]): T[] {
  return lists.reduce((acc, list) => {
    acc.push(...list);
    return acc;
  }, []);
}

/**
 * @description 快速创建数组 （Creates a list of given start, end, value, and step parameters.)
 * @param startOrLength  开始值或者长度
 * @param end  结束值
 * @param valueOrMapper  指定值或方法
 * @param step  步长
 * @returns Array 生成好的值
 * @example
 * list(3)                  // 0, 1, 2, 3
 * list(0, 3)               // 0, 1, 2, 3
 * list(0, 3, 'y')          // y, y, y, y
 * list(0, 3, () => 'y')    // y, y, y, y
 * list(0, 3, i => i)       // 0, 1, 2, 3
 * list(0, 3, i => `y${i}`) // y0, y1, y2, y3
 * list(0, 3, obj)          // obj, obj, obj, obj
 * list(0, 6, i => i, 2)    // 0, 2, 4, 6
 */
export function list<T = number>(
  startOrLength: number,
  end?: number,
  valueOrMapper?: T | ((i: number) => T),
  step?: number
): T[] {
  return Array.from(range(startOrLength, end, valueOrMapper, step));
}

/**
 * Creates a generator that will produce an iteration through
 * the range of number as requested.
 *
 * @example
 * range(3)                  // yields 0, 1, 2, 3
 * range(0, 3)               // yields 0, 1, 2, 3
 * range(0, 3, 'y')          // yields y, y, y, y
 * range(0, 3, () => 'y')    // yields y, y, y, y
 * range(0, 3, i => i)       // yields 0, 1, 2, 3
 * range(0, 3, i => `y${i}`) // yields y0, y1, y2, y3
 * range(0, 3, obj)          // yields obj, obj, obj, obj
 * range(0, 6, i => i, 2)    // yields 0, 2, 4, 6
 */
export function* range<T = number>(
  startOrLength: number,
  end?: number,
  valueOrMapper: T | ((i: number) => T) = (i) => i as T,
  step = 1
): Generator<T> {
  const mapper = isFunction(valueOrMapper)
    ? valueOrMapper
    : () => valueOrMapper;
  const start = end ? startOrLength : 0;
  const final = end || startOrLength;
  for (let i = start; i <= final; i += step) {
    yield mapper(i);
    if (i + step > final) {
      break;
    }
  }
}

type Falsy = null | undefined | false | "" | 0 | 0n;
/**
 * @description 排除数组的假值 （Given a list returns a new list with only truthy values)
 * @param list  被处理的数组
 * @returns Array 处理好的数组
 * @example
 * sift(['salmon', null, false, NaN, 'sockeye', 'bass'] ) // => ['salmon', 'sockeye', 'bass']
 */
export function sift<T>(list: readonly (T | Falsy)[]): T[] {
  return (list?.filter((x) => !!x) as T[]) || [];
}

export interface RemoveListEmptyValOptions {
  matchFunction?: (item: any) => boolean;
  removeFunction?: (item: any) => boolean;
}
/**
 * @description 排除数组（或者树状数据）匹配的值
 * @param treeList 树状数据
 * @param removeOptions 处理选项
 * @returns Array 处理好的值
 */
export function removeListEmptyVal<T>(
  treeList: any[],
  removeOptions?: RemoveListEmptyValOptions
): T[] {
  const removeFunc = removeOptions?.removeFunction || removeEmptyValues;
  const matchFunc =
    removeOptions?.removeFunction || ((item) => item && item.children);
  if (!Array.isArray(treeList) || treeList.length === 0) {
    return treeList;
  }
  for (let i = 0; i < treeList.length; i++) {
    treeList[i] = removeFunc(treeList[i]);
    const { children } = treeList[i];
    if (matchFunc(treeList[i])) {
      treeList[i].children = removeListEmptyVal(children, removeOptions);
    }
  }
  return treeList;
}

/**
 * @description 获取数组第一个元素
 * @param list  被处理的数组
 * @param defaultVal 默认值(可选)
 * @returns Array 处理好的数组
 * @example
 * ```
 * arrayFirst([1, 2, 3]) // => 1
 * arrayFirst(null,{}) // => {}
 * ```
 */
export function arrayFirst(list: any, defaultVal?: any) {
  return list?.[0] ?? defaultVal;
}

/**
 * @description 获取数组指定位置区间元素，组成新数组
 * @param list  被处理的数组
 * @param start 开始位置
 * @param end 结束位置
 * @returns Array 处理好的数组
 * @example
 * ```
 * arraySlice([1, 2, 3, 4, 5], 1, 3) // => [2, 3, 4]
 * ```
 */
export function arraySlice(list: any[], start: number, end: number) {
  return list.slice(start, end);
}

/**
 * @description 获取数组最后一个元素
 * @param list  被处理的数组
 * @param defaultVal 默认值(可选)
 * @returns Array 处理好的数组
 * @example
 * ```
 * arrayLast([1, 2, 3]) // => 3
 * arrayLast(null,{}) // => {}
 * ```
 */
export function arrayLast(list: any, defaultVal?: any) {
  return list?.[list.length - 1] ?? defaultVal;
}

export interface DataInfoOptions {
  base?: any[];
  fillData?: any | Function;
  isIncludeBase?: boolean;
  num?: number;
}
/**
 * @description 数组填充
 * @param dataInfo 填充数据对象
 * @returns Array 处理好的数组
 * ```
 * const fillData = (i: number) => {
 *   return {
 *    add: i,
 *   };
 *};
 * const newList = listFill({
 *   base: [{ base: 1 }, { base: 2 }],
 *   fillData,
 *   isIncludeBase: true,
 *   num: 4,
 * });
 * //   [
 *  //     {
 *  //         "base": 1,
 *  //         "add": 0
 *  //     },
 *  //     {
 *  //         "base": 2,
 *  //         "add": 1
 *  //     },
 *  //     {
 *  //         "add": 2
 *  //     },
 *  //     {
 *  //         "add": 3
 *  //     }
 *  // ]
 * ```
 */
export function listFill(dataInfo: DataInfoOptions): any[] {
  const { base = [], fillData = {}, isIncludeBase = false, num = 0 } = dataInfo;
  const mapper = (isFunction(fillData) ? fillData : () => fillData) as (
    index: number
  ) => any;
  const baseNum = base.length >= num ? base.length : num;
  const createNum = baseNum - 1 >= 0 ? baseNum - 1 : 0;
  return list(createNum).map((_, index) => {
    return index < base.length
      ? isIncludeBase
        ? { ...base[index], ...mapper(index) }
        : base[index]
      : mapper(index);
  });
}

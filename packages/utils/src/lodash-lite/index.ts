/* -------------------------------------------------------------------------- */
/* Internal helpers (behavior aligned with lodash@4 cloneDeep / isEqual)      */
/* -------------------------------------------------------------------------- */

const TYPED_ARRAY_CTORS: Record<string, any> = {
  "[object Int8Array]": Int8Array,
  "[object Uint8Array]": Uint8Array,
  "[object Uint8ClampedArray]": Uint8ClampedArray,
  "[object Int16Array]": Int16Array,
  "[object Uint16Array]": Uint16Array,
  "[object Int32Array]": Int32Array,
  "[object Uint32Array]": Uint32Array,
  "[object Float32Array]": Float32Array,
  "[object Float64Array]": Float64Array,
};

function cloneArrayBuffer(buffer: ArrayBufferLike): ArrayBuffer {
  const result = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(buffer));
  return result;
}

function cloneAny(value: any, stack: WeakMap<object, unknown>): any {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (stack.has(value)) {
    return stack.get(value);
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (value instanceof RegExp) {
    const r = new RegExp(value.source, value.flags);
    r.lastIndex = value.lastIndex;
    return r;
  }
  if (value instanceof ArrayBuffer) {
    return cloneArrayBuffer(value);
  }
  const tag = Object.prototype.toString.call(value);
  if (TYPED_ARRAY_CTORS[tag]) {
    const Ctor = TYPED_ARRAY_CTORS[tag];
    const buf = cloneArrayBuffer((value as ArrayBufferView).buffer);
    return new Ctor(
      buf,
      (value as ArrayBufferView).byteOffset,
      (value as { length: number }).length
    );
  }
  if (value instanceof Map) {
    const result = new Map();
    stack.set(value, result);
    value.forEach((v: unknown, k: unknown) => {
      result.set(cloneAny(k, stack), cloneAny(v, stack));
    });
    return result;
  }
  if (value instanceof Set) {
    const result = new Set();
    stack.set(value, result);
    value.forEach((v: unknown) => {
      result.add(cloneAny(v, stack));
    });
    return result;
  }
  if (Array.isArray(value)) {
    const result: any[] = new Array(value.length);
    stack.set(value, result);
    for (let i = 0; i < value.length; i++) {
      result[i] = cloneAny(value[i], stack);
    }
    return result;
  }
  const proto = Object.getPrototypeOf(value);
  const result: any = Object.create(proto);
  stack.set(value, result);
  for (const key of Object.keys(value)) {
    result[key] = cloneAny(value[key], stack);
  }
  for (const sym of Object.getOwnPropertySymbols(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, sym);
    if (desc?.enumerable) {
      result[sym] = cloneAny(value[sym], stack);
    }
  }
  return result;
}

function deepEqual(
  a: unknown,
  b: unknown,
  stack: WeakMap<object, object> = new WeakMap()
): boolean {
  if (a === b) {
    return true;
  }
  if (
    a == null ||
    b == null ||
    (typeof a !== "object" && typeof b !== "object")
  ) {
    return a !== a && b !== b;
  }
  const aTag = Object.prototype.toString.call(a);
  const bTag = Object.prototype.toString.call(b);
  if (aTag !== bTag) {
    return false;
  }
  if (stack.has(a as object)) {
    return stack.get(a as object) === b;
  }
  stack.set(a as object, b as object);

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  if (
    aTag === "[object Number]" ||
    aTag === "[object String]" ||
    aTag === "[object Boolean]"
  ) {
    return Object.is(
      (a as { valueOf(): unknown }).valueOf(),
      (b as { valueOf(): unknown }).valueOf()
    );
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], stack)) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    }
    for (const [k, v] of a) {
      if (!b.has(k) || !deepEqual(v, b.get(k), stack)) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) {
      return false;
    }
    for (const v of a) {
      if (!b.has(v)) {
        return false;
      }
    }
    return true;
  }
  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (const key of aKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
        stack
      )
    ) {
      return false;
    }
  }
  return true;
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

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
  const entries = Object.entries(obj);
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return Object.fromEntries(entries);
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
export function deepClone<T>(data: T): T {
  return cloneAny(data, new WeakMap()) as T;
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
  const differences: Record<string, any> = {};
  for (const key of Object.keys(newVal)) {
    if (!deepEqual(newVal[key], oldVal?.[key])) {
      differences[key] = newVal[key];
    }
  }
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
  if (!(array && array.length)) {
    return defaultVal;
  }
  const i = Number.isFinite(n) ? Math.trunc(n) : 0;
  const idx = i < 0 ? i + array.length : i;
  return idx >= 0 && idx < array.length ? array[idx] : defaultVal;
}

export default {
  sortObj,
  deepClone,
  compareObjects,
  arrayNth,
};

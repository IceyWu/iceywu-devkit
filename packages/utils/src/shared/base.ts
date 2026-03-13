/**
 * @description return object type(返回对象的类型)
 * @example toTypeString(1) ==> '[object Number]'
 * @param v any object
 * @returns string
 * @category Shared
 */
export const toTypeString = (v: unknown) => Object.prototype.toString.call(v);

/**
 * @description Get a random integer between min and max, inclusive.(获取最小值和最大值之间的随机整数，包含两端)
 * @param min number
 * @param max number
 * @returns number
 * @category Shared
 */
export function getRandom(min: number, max: number): number {
  if (!Number.isFinite(min)) {
    throw new TypeError("min must be a finite number");
  }

  if (!Number.isFinite(max)) {
    throw new TypeError("min and max must be finite numbers");
  }

  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

/**
 * @description Generate hash code(生成哈希值)
 * @param str string
 * @returns string
 * @category Shared
 */
export function hash(str: string) {
  let i = 0;
  let l = 0;
  let hval = 0x81_1c_9d_c5;

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval +=
      (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return `00000${(hval >>> 0).toString(36)}`.slice(-6);
}

// port from nanoid
// https://github.com/ai/nanoid
const urlAlphabet =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
/**
 * @description Generate a random string(生成随机字符串)
 * @category String
 * @example
 * ```
 * randomStr(8);
 * ```
 */
export function randomStr(size = 16, dict = urlAlphabet) {
  let id = "";
  let i = size;
  const len = dict.length;
  while (i--) {
    id += dict[Math.floor(Math.random() * len)];
  }
  return id;
}

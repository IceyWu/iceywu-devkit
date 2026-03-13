import { createExamples } from "./helpers";

export const isExamples = createExamples("@iceywu/utils/is", [
  {
    code: `import { isArray } from "@iceywu/utils/is";

return {
  array: isArray([1, 2, 3]),
  object: isArray({ length: 3 }),
};`,
    exportName: "isArray",
    summary: "判断值是否为数组。",
    title: "数组判断",
  },
  {
    code: `import { isBoolean } from "@iceywu/utils/is";

return {
  trueVal: isBoolean(true),
  stringVal: isBoolean("true"),
};`,
    exportName: "isBoolean",
    summary: "区分布尔值和字符串布尔字面量。",
    title: "布尔判断",
  },
  {
    code: `import { isDate } from "@iceywu/utils/is";

return {
  date: isDate(new Date()),
  isoString: isDate("2026-03-13"),
};`,
    exportName: "isDate",
    summary: "判断真实 Date 实例，而不是日期字符串。",
    title: "日期判断",
  },
  {
    code: `import { isDef } from "@iceywu/utils/is";

return {
  zero: isDef(0),
  undefinedVal: isDef(undefined),
};`,
    exportName: "isDef",
    summary: "检查值是否不是 undefined。",
    title: "定义判断",
  },
  {
    code: `import { isEmpty } from "@iceywu/utils/is";

return {
  emptyArray: isEmpty([]),
  emptyObject: isEmpty({}),
  blankString: isEmpty("   "),
  zero: isEmpty(0),
};`,
    exportName: "isEmpty",
    summary: "观察常见空值、空对象和空字符串的判定。",
    title: "空值判断",
  },
  {
    code: `import { isFunction } from "@iceywu/utils/is";

return {
  arrow: isFunction(() => {}),
  plainObject: isFunction({ run: true }),
};`,
    exportName: "isFunction",
    summary: "判断普通函数、箭头函数是否可调用。",
    title: "函数判断",
  },
  {
    code: `import { isMap } from "@iceywu/utils/is";

return {
  map: isMap(new Map([["name", "Icey"]])),
  object: isMap({ name: "Icey" }),
};`,
    exportName: "isMap",
    summary: "区分原生 Map 和普通对象。",
    title: "Map 判断",
  },
  {
    code: `import { isNumber } from "@iceywu/utils/is";

return {
  integer: isNumber(42),
  nan: isNumber(Number.NaN),
  stringVal: isNumber("42"),
};`,
    exportName: "isNumber",
    summary: "基于 typeof 判断 number，包括 NaN。",
    title: "数字判断",
  },
  {
    code: `import { isObject } from "@iceywu/utils/is";

return {
  plain: isObject({ ok: true }),
  array: isObject([1, 2, 3]),
  nullVal: isObject(null),
};`,
    exportName: "isObject",
    summary: "判断运行时 object，包括数组，但排除 null。",
    title: "对象判断",
  },
  {
    code: `import { isPlainObject } from "@iceywu/utils/is";

return {
  plain: isPlainObject({ ok: true }),
  map: isPlainObject(new Map()),
  array: isPlainObject([]),
};`,
    exportName: "isPlainObject",
    summary: "只命中普通对象，不把 Map 或数组算进去。",
    title: "纯对象判断",
  },
  {
    code: `import { isPromise } from "@iceywu/utils/is";

return {
  promise: isPromise(Promise.resolve("ok")),
  thenable: isPromise({ then() {}, catch() {} }),
  object: isPromise({ then() {} }),
};`,
    exportName: "isPromise",
    summary: "识别 Promise 和 then/catch 兼容对象。",
    title: "Promise 判断",
  },
  {
    code: `import { isRegExp } from "@iceywu/utils/is";

return {
  pattern: isRegExp(/icey/gi),
  stringVal: isRegExp("icey"),
};`,
    exportName: "isRegExp",
    summary: "区分正则表达式实例和普通字符串。",
    title: "正则判断",
  },
  {
    code: `import { isSet } from "@iceywu/utils/is";

return {
  set: isSet(new Set([1, 2, 3])),
  array: isSet([1, 2, 3]),
};`,
    exportName: "isSet",
    summary: "识别原生 Set 实例。",
    title: "Set 判断",
  },
  {
    code: `import { isString } from "@iceywu/utils/is";

return {
  text: isString("IceyWu"),
  numberVal: isString(7),
};`,
    exportName: "isString",
    summary: "区分字符串和其他基础类型。",
    title: "字符串判断",
  },
  {
    code: `import { isSymbol } from "@iceywu/utils/is";

return {
  symbolVal: isSymbol(Symbol("tag")),
  stringVal: isSymbol("tag"),
};`,
    exportName: "isSymbol",
    summary: "区分 symbol 和普通字符串。",
    title: "Symbol 判断",
  },
  {
    code: `import { isValue } from "@iceywu/utils/is";

return {
  zero: isValue(0),
  emptyString: isValue(""),
  nullVal: isValue(null),
  undefinedVal: isValue(undefined),
};`,
    exportName: "isValue",
    summary: "判断值是否不是 null/undefined。",
    title: "有效值判断",
  },
]);

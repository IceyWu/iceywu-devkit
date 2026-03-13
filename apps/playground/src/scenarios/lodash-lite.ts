import { createExamples } from "./helpers";

export const lodashLiteExamples = createExamples("@iceywu/utils/lodash-lite", [
  {
    code: `import { arrayNth } from "@iceywu/utils/lodash-lite";

return {
  first: arrayNth(["a", "b", "c"], 0),
  last: arrayNth(["a", "b", "c"], -1),
  fallback: arrayNth([], 2, "empty"),
};`,
    exportName: "arrayNth",
    summary: "获取指定下标元素，支持负索引和默认值。",
    title: "读取任意项",
  },
  {
    code: `import { compareObjects } from "@iceywu/utils/lodash-lite";

return compareObjects(
  { id: 7, name: "Icey", profile: { city: "Hangzhou" } },
  { id: 7, name: "Icey Wu", profile: { city: "Hangzhou" }, role: "maintainer" }
);`,
    exportName: "compareObjects",
    summary: "返回新对象中相较旧对象发生变化的字段。",
    title: "比较对象差异",
  },
  {
    code: `import { deepClone } from "@iceywu/utils/lodash-lite";

const source = { profile: { city: "Hangzhou" }, tags: ["utils", "playground"] };
const cloned = deepClone(source);

return {
  cloned,
  sameProfileRef: cloned.profile === source.profile,
  sameTagsRef: cloned.tags === source.tags,
};`,
    exportName: "deepClone",
    summary: "基于 lodash 的 deepClone() 会复制深层对象与数组引用。",
    title: "克隆复杂数据",
  },
  {
    code: `import { sortObj } from "@iceywu/utils/lodash-lite";

return sortObj({ zebra: 1, apple: 2, moon: 3 });`,
    exportName: "sortObj",
    summary: "按 key 对对象重新排序。",
    title: "对象排序",
  },
]);

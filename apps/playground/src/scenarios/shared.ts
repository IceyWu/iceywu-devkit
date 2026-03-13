import { createExamples } from "./helpers";

export const sharedExamples = createExamples("@iceywu/utils/shared", [
  {
    code: `import { getRandom } from "@iceywu/utils/shared";

const picks = Array.from({ length: 5 }, () => getRandom(3, 7));

return {
  allInRange: picks.every((item) => item >= 3 && item <= 7),
  picks,
};`,
    exportName: "getRandom",
    summary: "生成指定区间内的随机整数，并验证上下限是否正确。",
    title: "随机整数",
  },
  {
    code: `import { hash } from "@iceywu/utils/shared";

return {
  first: hash("iceywu-playground"),
  second: hash("iceywu-playground"),
  different: hash("iceywu-devkit"),
};`,
    exportName: "hash",
    summary: "相同输入应产生稳定 hash，不同输入应变化。",
    title: "稳定哈希",
  },
  {
    code: `import { randomStr } from "@iceywu/utils/shared";

const value = randomStr(10);

return {
  length: value.length,
  value,
};`,
    exportName: "randomStr",
    summary: "生成一段固定长度的随机字符串。",
    title: "随机字符串",
  },
  {
    code: `import { toTypeString } from "@iceywu/utils/shared";

return {
  array: toTypeString([1, 2, 3]),
  map: toTypeString(new Map()),
  date: toTypeString(new Date("2026-03-13T00:00:00Z")),
};`,
    exportName: "toTypeString",
    summary: "返回更精确的运行时类型标签。",
    title: "类型标签",
  },
]);

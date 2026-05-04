import { createExamples } from "./helpers";

export const arrayExamples = createExamples("@iceywu/utils/array", [
  {
    code: `import { diff } from "@iceywu/utils/array";

const base = [
  { id: 1, label: "alpha" },
  { id: 2, label: "beta" },
  { id: 3, label: "gamma" },
];

return diff(base, [{ id: 2, label: "beta" }], (item) => item.id);`,
    exportName: "diff",
    summary: "比较两组对象数组，按 id 输出剩余项。",
    title: "数组差集",
  },
  {
    code: `import { flat } from "@iceywu/utils/array";

return flat([
  ["root", "object"],
  ["tools"],
  ["shared", "is"],
]);`,
    exportName: "flat",
    summary: "把二维数组拍平成单层列表。",
    title: "拍平数组",
  },
  {
    code: `import { list } from "@iceywu/utils/array";

return list(1, 9, (value) => ({ value, odd: value % 2 === 1 }), 2);`,
    exportName: "list",
    input: {
      range: [1, 9],
      step: 2,
    },
    summary: "按步长创建映射后的列表，快速看 list() 的边界。",
    title: "快速生成序列",
  },
  {
    code: `import { listFill } from "@iceywu/utils/array";

return listFill({
  base: [{ id: 1 }, { id: 2 }],
  fillData: (index) => ({ slot: index, ready: index % 2 === 0 }),
  isIncludeBase: true,
  num: 4,
});`,
    exportName: "listFill",
    summary: "按目标长度补齐数组，并可合并已有项。",
    title: "补齐列表",
  },
  {
    code: `import { range } from "@iceywu/utils/array";

return [...range(2, 10, (value) => value * 3, 2)];`,
    exportName: "range",
    summary: "把 generator 输出展开，观察范围和步长是否正确。",
    title: "惰性区间",
  },
  {
    code: `import { removeListEmptyVal } from "@iceywu/utils/array";

const tree = [
  {
    id: 1,
    name: "root",
    children: [{ id: 2, name: "child", extra: "" }, { id: 3, name: "leaf", empty: null }],
  },
  null,
];

return removeListEmptyVal(tree.filter(Boolean));`,
    exportName: "removeListEmptyVal",
    summary: "递归清洗树状数组中的空值字段。",
    title: "清洗树列表",
  },
  {
    code: `import { sift } from "@iceywu/utils/array";

return sift([0, 1, "", "icey", null, "wu", false, 9]);`,
    exportName: "sift",
    summary: "过滤数组中的假值，只保留 truthy 项。",
    title: "过滤假值",
  },
]);

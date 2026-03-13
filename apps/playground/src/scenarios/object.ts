import { createExamples } from "./helpers";

export const objectExamples = createExamples("@iceywu/utils/object", [
  {
    code: `import { UObject } from "@iceywu/utils/object";

const target = { profile: { name: "Icey" } };

return {
  merged: UObject.deepMerge(target, { profile: { city: "Hangzhou" } }),
  picked: UObject.get(target, ["profile", "name"]),
  keys: Object.keys(UObject).slice(0, 6),
};`,
    exportName: "UObject",
    summary: "通过对象命名空间统一访问常用 object 工具。",
    title: "对象工具集合",
  },
  {
    code: `import { deepClone2 } from "@iceywu/utils/object";

const source = {
  createdAt: new Date("2026-03-13T00:00:00Z"),
  nested: { label: "demo" },
  pattern: /icey/gi,
};

source.self = source;

const cloned = deepClone2(source);

return {
  cloned,
  keepsCircle: cloned.self === cloned,
  sameNestedRef: cloned.nested === source.nested,
};`,
    exportName: "deepClone2",
    summary: "深拷贝复杂对象，并验证循环引用不会炸掉。",
    title: "深拷贝对象",
  },
  {
    code: `import { deepMerge } from "@iceywu/utils/object";

return deepMerge(
  {
    user: {
      name: "Icey",
      profile: { city: "Hangzhou", tags: ["tooling"] },
    },
  },
  {
    user: { profile: { tags: ["workspace", "debug"] } },
  }
);`,
    exportName: "deepMerge",
    summary: "合并嵌套字段，确认数组和对象层级的结果。",
    title: "深度合并对象",
  },
  {
    code: `import { extend } from "@iceywu/utils/object";

return extend({ base: true }, { feature: "playground" }, { count: 3 });`,
    exportName: "extend",
    summary: "extend() 等价于 Object.assign()，适合轻量对象合并。",
    title: "浅合并对象",
  },
  {
    code: `import { get } from "@iceywu/utils/object";

const state = {
  profile: {
    owner: { name: "Icey" },
  },
};

return {
  hit: get(state, ["profile", "owner", "name"]),
  miss: get(state, ["profile", "owner", "title"], "unknown"),
};`,
    exportName: "get",
    summary: "通过别名 get() 读取深层路径并提供默认值。",
    title: "读取深层字段",
  },
  {
    code: `import { getObjVal } from "@iceywu/utils/object";

const response = {
  data: {
    profile: {
      city: null,
      name: "Icey",
    },
  },
};

return {
  name: getObjVal(response, ["data", "profile", "name"]),
  cityFallback: getObjVal(response, ["data", "profile", "city"], "Hangzhou"),
};`,
    exportName: "getObjVal",
    summary: "读取对象路径，并观察 null 时的默认值回退。",
    title: "安全取值",
  },
  {
    code: `import { getObjValByKeys } from "@iceywu/utils/object";

const profile = {
  nickname: "iceywu",
  realName: "Icey Wu",
};

return getObjValByKeys(profile, ["displayName", "nickname", "realName"], "guest");`,
    exportName: "getObjValByKeys",
    summary: "按候选 key 列表依次读取，命中首个有效值后返回。",
    title: "多候选取值",
  },
  {
    code: `import { hasKey } from "@iceywu/utils/object";

const tree = {
  profile: {
    owner: {
      id: 7,
    },
  },
};

return {
  deepHit: hasKey(tree, ["profile", "owner", "id"]),
  deepMiss: hasKey(tree, ["profile", "owner", "name"]),
};`,
    exportName: "hasKey",
    summary: "检查单层和多层路径是否存在。",
    title: "检查字段路径",
  },
  {
    code: `import { hasOwn } from "@iceywu/utils/object";

const profile = Object.create({ inherited: true });
profile.id = 7;

return {
  id: hasOwn(profile, "id"),
  inherited: hasOwn(profile, "inherited"),
};`,
    exportName: "hasOwn",
    summary: "安全调用 hasOwnProperty，避免原型链误判。",
    title: "自有属性判断",
  },
  {
    code: `import { removeEmptyValues } from "@iceywu/utils/object";

return removeEmptyValues({
  id: 7,
  emptyString: "",
  emptyObject: {},
  keepZero: 0,
  nested: {
    city: "Hangzhou",
    tags: [],
  },
});`,
    exportName: "removeEmptyValues",
    summary: "递归移除对象里的空值、空对象和空数组。",
    title: "清洗空值",
  },
  {
    code: `import { removeTreeData } from "@iceywu/utils/object";

const tree = [
  {
    id: 1,
    children: [{ id: 11 }, { id: 12 }],
  },
  {
    id: 2,
    children: [{ id: 21 }],
  },
];

return removeTreeData(tree, (item) => item.id === 12 || item.id === 2);`,
    exportName: "removeTreeData",
    summary: "按条件递归删除树节点，并保留剩余结构。",
    title: "移除树节点",
  },
  {
    code: `import { set } from "@iceywu/utils/object";

const draft = { profile: {} };
set(draft, ["profile", "city"], "Hangzhou");

return draft;`,
    exportName: "set",
    summary: "通过别名 set() 为深层路径写入值。",
    title: "写入深层字段",
  },
  {
    code: `import { setObjValue } from "@iceywu/utils/object";

const draft = { settings: { theme: "light" } };
setObjValue(draft, ["settings", "layout", "density"], "compact");

return draft;`,
    exportName: "setObjValue",
    summary: "为对象路径注入新值，缺失层级会自动补齐。",
    title: "设置对象值",
  },
]);

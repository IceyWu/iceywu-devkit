import { createExamples } from "./helpers";

export const toolsExamples = createExamples("@iceywu/utils/tools", [
  {
    code: `import { UTools } from "@iceywu/utils/tools";

return {
  fileType: UTools.getFileType("https://iceywu.dev/readme.md"),
  formatted: UTools.formatNumber(1200345.67),
  sampleKeys: Object.keys(UTools).slice(0, 6),
};`,
    exportName: "UTools",
    summary: "通过工具对象统一访问常见格式化和文本处理能力。",
    title: "工具集合",
  },
  {
    code: `import { customDestr } from "@iceywu/utils/tools";

return {
  invalidWithFallback: customDestr("{oops}", { customVal: { ok: false } }),
  valid: customDestr('{"name":"iceywu","count":2}'),
};`,
    exportName: "customDestr",
    summary: "为解析失败场景提供自定义兜底值。",
    title: "自定义反序列化",
  },
  {
    code: `import { debounce } from "@iceywu/utils/tools";

const calls = [];
const handler = debounce((value) => calls.push(value), 10);

handler("first");
handler("second");
handler("third");

await new Promise((resolve) => setTimeout(resolve, 25));

return calls;`,
    exportName: "debounce",
    summary: "多次快速触发后只保留最后一次调用。",
    title: "防抖调用",
  },
  {
    code: `import { destr } from "@iceywu/utils/tools";

return {
  booleanValue: destr("true"),
  objectValue: destr('{"name":"iceywu","count":2}'),
  invalidPassthrough: destr("hello"),
};`,
    exportName: "destr",
    summary: "安全解析字符串，同时兼容原始值和非 JSON 文本。",
    title: "安全解析文本",
  },
  {
    code: `import { formatNumber } from "@iceywu/utils/tools";

return {
  integer: formatNumber(1234567),
  decimal: formatNumber(1234567.89),
};`,
    exportName: "formatNumber",
    summary: "为数字添加千分位分隔符。",
    title: "格式化数字",
  },
  {
    code: `import { getFileType } from "@iceywu/utils/tools";

return {
  image: getFileType("https://cdn.dev/avatar.png"),
  document: getFileType("report.docx"),
  code: getFileType("main.ts"),
  other: getFileType("archive.unknown"),
};`,
    exportName: "getFileType",
    summary: "根据后缀名判断文件所属类别。",
    title: "识别文件类型",
  },
  {
    code: `import { safeDestr } from "@iceywu/utils/tools";

let message = "";

try {
  safeDestr("{ invalid json }");
} catch (error) {
  message = error instanceof Error ? error.message : String(error);
}

return { message };`,
    exportName: "safeDestr",
    summary: "严格模式下遇到非法 JSON 会直接抛错。",
    title: "严格解析",
  },
  {
    code: `import { throttle } from "@iceywu/utils/tools";

const calls = [];
const handler = throttle((value) => calls.push(value), 15);

handler("first");
handler("second");
await new Promise((resolve) => setTimeout(resolve, 5));
handler("third");
await new Promise((resolve) => setTimeout(resolve, 25));

return calls;`,
    exportName: "throttle",
    summary: "连续触发时按节流间隔限制执行频率。",
    title: "节流调用",
  },
]);

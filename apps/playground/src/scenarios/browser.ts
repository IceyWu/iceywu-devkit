import { createExamples } from "./helpers";

export const downloadExamples = createExamples("@iceywu/utils/download", [
  {
    code: `import { createDownload } from "@iceywu/utils/download";

const events = [];
const originalCreateElement = document.createElement.bind(document);
const originalAppendChild = document.body.appendChild.bind(document.body);
const originalRemoveChild = document.body.removeChild.bind(document.body);
const originalCreateObjectURL = window.URL.createObjectURL.bind(window.URL);
const originalRevokeObjectURL = window.URL.revokeObjectURL.bind(window.URL);

document.createElement = (tagName) => {
  if (tagName === "a") {
    return {
      style: {},
      click() {
        events.push("click");
      },
      set href(value) {
        events.push("href:" + value);
      },
      set download(value) {
        events.push("download:" + value);
      },
    };
  }

  return originalCreateElement(tagName);
};

document.body.appendChild = (element) => {
  events.push("append");
  return element;
};

document.body.removeChild = (element) => {
  events.push("remove");
  return element;
};

window.URL.createObjectURL = (blob) => {
  events.push("create:" + blob.size);
  return "blob:playground";
};

window.URL.revokeObjectURL = (url) => {
  events.push("revoke:" + url);
};

try {
  createDownload(new Blob(["hello playground"]), "demo.txt");
  return events;
} finally {
  document.createElement = originalCreateElement;
  document.body.appendChild = originalAppendChild;
  document.body.removeChild = originalRemoveChild;
  window.URL.createObjectURL = originalCreateObjectURL;
  window.URL.revokeObjectURL = originalRevokeObjectURL;
}`,
    exportName: "createDownload",
    notes: ["示例不会真实下载文件，而是用 mock 记录浏览器调用顺序。"],
    summary: "模拟浏览器下载流程，观察 createDownload() 触发的 DOM 行为。",
    title: "创建下载链接",
  },
  {
    code: `import { downloadFile } from "@iceywu/utils/download";

const events = [];
const OriginalXHR = globalThis.XMLHttpRequest;
const originalCreateElement = document.createElement.bind(document);
const originalAppendChild = document.body.appendChild.bind(document.body);
const originalRemoveChild = document.body.removeChild.bind(document.body);
const originalCreateObjectURL = window.URL.createObjectURL.bind(window.URL);
const originalRevokeObjectURL = window.URL.revokeObjectURL.bind(window.URL);

class MockXHR {
  constructor() {
    this.headers = {};
    this.status = 200;
    this.response = new Blob(["mock file"]);
  }

  open(method, url) {
    events.push(["open", method, url]);
  }

  setRequestHeader(key, value) {
    this.headers[key] = value;
    events.push(["header", key, value]);
  }

  send() {
    events.push(["send"]);
    this.onprogress && this.onprogress({ loaded: 50, total: 100 });
    this.onload && this.onload.call(this);
  }

  abort() {
    events.push(["abort"]);
  }
}

document.createElement = (tagName) => {
  if (tagName === "a") {
    return {
      style: {},
      click() {
        events.push(["click"]);
      },
      set href(value) {
        events.push(["href", value]);
      },
      set download(value) {
        events.push(["download", value]);
      },
    };
  }

  return originalCreateElement(tagName);
};

document.body.appendChild = (element) => {
  events.push(["append"]);
  return element;
};

document.body.removeChild = (element) => {
  events.push(["remove"]);
  return element;
};

window.URL.createObjectURL = () => "blob:download-file";
window.URL.revokeObjectURL = () => {
  events.push(["revoke"]);
};
globalThis.XMLHttpRequest = MockXHR;

try {
  const controller = downloadFile(
    "/demo.txt",
    "demo.txt",
    {
      onSuccess(response) {
        events.push(["success", response.size]);
      },
      onProcess(progress) {
        events.push(["progress", progress.loaded, progress.total]);
      },
      onError() {
        events.push(["error"]);
      },
    },
    { header: { Authorization: "Bearer mock" } }
  );

  controller.stop();
  return events;
} finally {
  globalThis.XMLHttpRequest = OriginalXHR;
  document.createElement = originalCreateElement;
  document.body.appendChild = originalAppendChild;
  document.body.removeChild = originalRemoveChild;
  window.URL.createObjectURL = originalCreateObjectURL;
  window.URL.revokeObjectURL = originalRevokeObjectURL;
}`,
    exportName: "downloadFile",
    notes: ["通过 mock XHR、URL 和 DOM，避免真正发请求和下载文件。"],
    summary: "模拟带进度的文件下载流程，并验证 stop() 与回调是否触发。",
    title: "下载文件",
  },
]);

export const logExamples = createExamples("@iceywu/utils/log", [
  {
    code: `import { consolePlus } from "@iceywu/utils/log";

consolePlus.info("Playground", "module loaded", "colors ready");
consolePlus.success("Build", "vite", "pnpm");

return "查看 Console 面板，确认 consolePlus 的分组日志已输出。";`,
    exportName: "consolePlus",
    summary: "使用带颜色的 console 分组输出多段信息。",
    title: "增强日志输出",
  },
  {
    code: `import { typeColor } from "@iceywu/utils/log";

return {
  danger: typeColor("danger"),
  info: typeColor("info"),
  default: typeColor(),
};`,
    exportName: "typeColor",
    summary: "预览不同日志类型对应的颜色配置。",
    title: "日志配色",
  },
]);

export const networkExamples = createExamples("@iceywu/utils/network", [
  {
    code: `import { getResponse } from "@iceywu/utils/network";

const originalFetch = globalThis.fetch;

globalThis.fetch = async () =>
  new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("part-1"));
        controller.enqueue(new TextEncoder().encode("part-2"));
        controller.close();
      },
    })
  );

try {
  await getResponse();
  return "查看 Console 面板，确认流式响应内容按块输出。";
} finally {
  globalThis.fetch = originalFetch;
}`,
    exportName: "getResponse",
    notes: ["真实实现会请求固定地址，这里改为 mock fetch 保持示例可运行。"],
    summary: "模拟 fetch 流式响应，查看 getResponse() 如何逐块打印内容。",
    title: "读取响应流",
  },
  {
    code: `import { getStreamResponse } from "@iceywu/utils/network";

const chunks = [];
const response = new Response(
  new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("hello "));
      controller.enqueue(new TextEncoder().encode("playground"));
      controller.close();
    },
  })
);

const text = await getStreamResponse(response, (chunk) => chunks.push(chunk));

return {
  chunks,
  text,
};`,
    exportName: "getStreamResponse",
    summary: "读取 Response 流并在每次收到分片时回调。",
    title: "流式拼接文本",
  },
]);

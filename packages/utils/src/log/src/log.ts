/**
 * @description 根据日志类型返回颜色配置
 * @param type 日志类型
 * @returns 颜色配置
 */
export function typeColor(type = "default") {
  const baseColor = {
    color: "black",
    bg: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
  };
  switch (type) {
    case "primary":
      baseColor.color = "#fff";
      baseColor.bg = "linear-gradient(to top, #209cff 0%, #68e0cf 100%)";
      break;
    case "success":
      baseColor.color = "#fff";
      baseColor.bg = "linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)";
      break;
    case "info":
      baseColor.color = "#fff";
      baseColor.bg = "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)";
      break;
    case "warning":
      baseColor.color = "#fff";
      baseColor.bg = "linear-gradient(-60deg, #ff5858 0%, #f09819 100%)";
      break;
    case "danger":
      baseColor.color = "#fff";
      baseColor.bg =
        "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)";
      break;
    case "default":
      baseColor.color = "#fff";
      baseColor.bg = "linear-gradient(120deg, #e2e3e5 0%, #e2e3e5 100%)";
      break;
    default:
      break;
  }
  return baseColor;
}

function logFunc(type = "primary", title: string, ...contents: any[]) {
  const { color, bg } = typeColor(type);

  console.group(
    `%c ${title} `,
    `background-image:${bg};color:${color}; padding: 2px; border-radius: 4px;font-size:14px;`
  );
  for (let index = 0; index < contents.length; index++) {
    const element = contents[index] as any[];
    element.forEach((item: string) => {
      console.log(item);
    });
  }

  console.groupEnd();
}

/**
 * @description Console Plus
 * @example
 * ```
 * consolePlus.log("warning", "test");
 * consolePlus.error("error", "error test", "[Error]: ");
 * ```
 */
export const consolePlus = {
  log: (title: string, ...contents: any[]) =>
    logFunc("primary", title, contents),
  error: (title: string, ...contents: any[]) =>
    logFunc("danger", title, contents),
  warn: (title: string, ...contents: any[]) =>
    logFunc("warning", title, contents),
  info: (title: string, ...contents: any[]) => logFunc("info", title, contents),
  success: (title: string, ...contents: any[]) =>
    logFunc("success", title, contents),
};

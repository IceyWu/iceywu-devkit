import { CLI_CONFIG } from "../config.js";

export function validateAppName(appName: string | undefined | null) {
  if (!appName || typeof appName !== "string") {
    return {
      isValid: false,
      message: "应用名称不能为空",
    };
  }

  if (appName.match(CLI_CONFIG.project.invalidNamePattern)) {
    return {
      isValid: false,
      message: "应用名称存在非法字符，请使用英文字母、数字、短横线或下划线",
    };
  }

  if (appName.length > CLI_CONFIG.project.maxNameLength) {
    return {
      isValid: false,
      message: `应用名称长度不能超过${CLI_CONFIG.project.maxNameLength}个字符`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

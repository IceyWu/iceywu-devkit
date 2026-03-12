import { describe, expect, it } from "vitest";
import { formatTime } from "../src/lib/time.js";
import { validateAppName } from "../src/lib/validation.js";

describe("validateAppName", () => {
  it("accepts valid project names", () => {
    expect(validateAppName("my-app")).toEqual({
      isValid: true,
      message: "",
    });

    expect(validateAppName("my_project")).toEqual({
      isValid: true,
      message: "",
    });

    expect(validateAppName("project123")).toEqual({
      isValid: true,
      message: "",
    });
  });

  it("rejects invalid project names", () => {
    expect(validateAppName("")).toEqual({
      isValid: false,
      message: "应用名称不能为空",
    });

    expect(validateAppName("项目名称")).toEqual({
      isValid: false,
      message: "应用名称存在非法字符，请使用英文字母、数字、短横线或下划线",
    });

    expect(validateAppName("a".repeat(51))).toEqual({
      isValid: false,
      message: "应用名称长度不能超过50个字符",
    });
  });
});

describe("formatTime", () => {
  it("formats ISO time values in Asia/Shanghai timezone", () => {
    expect(formatTime("2023-01-01T00:00:00Z")).toBe("2023-01-01 08:00:00");
  });

  it("returns fallback text for empty values", () => {
    expect(formatTime("")).toBe("未知");
    expect(formatTime(null)).toBe("未知");
  });
});

import { describe, expect, it } from "vitest";
import { get, set } from "./base";

describe("object/base path helpers", () => {
  describe("get", () => {
    it("resolves dot/bracket paths and returns defaults on miss", () => {
      const obj = { a: [{ b: { c: 3 } }] };
      expect(get(obj, "a[0].b.c")).toBe(3);
      expect(get(obj, ["a", "0", "b", "c"])).toBe(3);
      expect(get(obj, "a.b.c", "default")).toBe("default");
    });

    it("returns the data itself when path is empty", () => {
      const obj = { a: 1 };
      expect(get(obj, undefined)).toBe(obj);
      expect(get(obj, "")).toBe(obj);
    });

    it("treats existing direct keys as a single path segment", () => {
      const obj = { "a.b.c": 42 };
      expect(get(obj, "a.b.c")).toBe(42);
    });

    it("substitutes the default when value is null and isIncludedNull is true", () => {
      expect(get({ a: null }, "a", "fallback")).toBe("fallback");
      expect(get({ a: null }, "a", "fallback", false)).toBeNull();
    });
  });

  describe("set", () => {
    it("creates nested objects and arrays as needed", () => {
      const obj: Record<string, unknown> = { a: [{ b: { c: 3 } }] };
      set(obj, "a[0].b.c", 4);
      expect((obj as any).a[0].b.c).toBe(4);

      const obj2: Record<string, unknown> = {};
      set(obj2, ["x", "0", "y", "z"], 5);
      expect((obj2 as any).x[0].y.z).toBe(5);
    });

    it("ignores prototype-pollution paths", () => {
      const target: Record<string, unknown> = {};
      set(target, "__proto__.polluted", "yes");
      expect(({} as any).polluted).toBeUndefined();
    });
  });
});

import { describe, expect, it } from "vitest";
import { arrayNth, compareObjects, deepClone, sortObj } from "./index";

describe("lodash-lite", () => {
  describe("sortObj", () => {
    it("returns a new object with keys in ascending order", () => {
      expect(Object.keys(sortObj({ b: 2, a: 1, c: 3 }))).toEqual([
        "a",
        "b",
        "c",
      ]);
    });
  });

  describe("deepClone", () => {
    it("clones nested plain objects without sharing references", () => {
      const src = { nested: { ok: true, list: [1, { x: 2 }] } };
      const copy = deepClone(src);
      expect(copy).toEqual(src);
      expect(copy).not.toBe(src);
      expect(copy.nested).not.toBe(src.nested);
      expect(copy.nested.list[1]).not.toBe(src.nested.list[1]);
    });

    it("preserves Date / RegExp / Map / Set", () => {
      const src = {
        d: new Date(123_456_789),
        r: /abc/giu,
        m: new Map<string, number>([["a", 1]]),
        s: new Set([1, 2, 3]),
      };
      const copy = deepClone(src);
      expect(copy.d).toEqual(src.d);
      expect(copy.d).not.toBe(src.d);
      expect(copy.r.source).toBe("abc");
      expect(copy.r.flags).toBe(src.r.flags);
      expect(copy.m.get("a")).toBe(1);
      expect(copy.m).not.toBe(src.m);
      expect([...copy.s]).toEqual([1, 2, 3]);
    });

    it("handles circular references", () => {
      const src: any = { name: "root" };
      src.self = src;
      const copy = deepClone(src);
      expect(copy.name).toBe("root");
      expect(copy.self).toBe(copy);
      expect(copy).not.toBe(src);
    });
  });

  describe("compareObjects", () => {
    it("returns only keys with changed values", () => {
      expect(compareObjects({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual({ b: 3 });
    });

    it("treats deep-equal nested values as unchanged", () => {
      const oldVal = { nested: { x: 1, y: [1, 2] } };
      const newVal = { nested: { x: 1, y: [1, 2] } };
      expect(compareObjects(oldVal, newVal)).toEqual({});
    });

    it("includes keys that exist only on the new value", () => {
      expect(compareObjects({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
    });

    it("treats NaN as equal to NaN", () => {
      expect(compareObjects({ a: Number.NaN }, { a: Number.NaN })).toEqual({});
    });
  });

  describe("arrayNth", () => {
    it("returns the element at positive and negative indices", () => {
      expect(arrayNth(["a", "b", "c"], 1)).toBe("b");
      expect(arrayNth(["a", "b", "c"], -1)).toBe("c");
    });

    it("falls back to defaultVal when out of range or empty", () => {
      expect(arrayNth([], 0, "fallback")).toBe("fallback");
      expect(arrayNth(["a"], 5, "fallback")).toBe("fallback");
    });
  });
});

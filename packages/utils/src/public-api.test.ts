import { describe, expect, it } from "vitest";
import { deepClone, to, toTry } from "./index";
import { getRandom } from "./shared";

describe("public api", () => {
  it("to returns data tuple on success", async () => {
    const [error, data] = await to(Promise.resolve("ok"));

    expect(error).toBeNull();
    expect(data).toBe("ok");
  });

  it("toTry returns error tuple on failure", async () => {
    const [error, data] = await toTry(() => {
      throw new Error("boom");
    });

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("boom");
    expect(data).toBeUndefined();
  });

  it("getRandom stays within inclusive bounds", () => {
    for (let index = 0; index < 50; index++) {
      const value = getRandom(2, 4);

      expect(value).toBeGreaterThanOrEqual(2);
      expect(value).toBeLessThanOrEqual(4);
    }
  });

  it("deepClone is available from the root entry", () => {
    const source = { nested: { ok: true } };
    const cloned = deepClone(source);

    expect(cloned).toEqual(source);
    expect(cloned).not.toBe(source);
    expect(cloned.nested).not.toBe(source.nested);
  });
});

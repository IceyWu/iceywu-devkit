import { describe, expect, it } from "vitest";
import { createCliApp } from "../src/app.js";

describe("createCliApp", () => {
  it("registers the expected top-level commands", () => {
    const cli = createCliApp();
    const commandNames = cli.commands.map((command) => command.name());

    expect(commandNames).toEqual(["create", "update", "ls"]);
  });

  it("uses icey as the CLI name", () => {
    const cli = createCliApp();
    expect(cli.name()).toBe("icey");
  });
});

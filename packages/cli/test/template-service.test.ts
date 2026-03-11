import { afterEach, describe, expect, it, vi } from "vitest";
import {
  filterRepos,
  getCloneUrl,
  getTemplateCacheTtlMs,
  getTemplateSources,
  isTemplateCacheExpired,
  parseTemplateMirrorEntry,
  toTemplateChoices,
} from "../src/services/template-service.js";

describe("template-service", () => {
  const repositories = [
    {
      name: "cloud-template",
      clone_url: "https://github.com/IceyWu/cloud-template.git",
      description: "template repo",
      topics: ["template", "vite"],
      private: false,
      archived: false,
      fork: false,
    },
    {
      name: "utils",
      clone_url: "https://github.com/IceyWu/utils.git",
      description: "library repo",
      topics: ["utils"],
      private: false,
      archived: false,
      fork: false,
    },
  ];

  it("filters repositories by topic", () => {
    expect(filterRepos(repositories, "template")).toHaveLength(1);
    expect(filterRepos(repositories, "vite")).toHaveLength(1);
    expect(filterRepos(repositories, "unknown")).toHaveLength(0);
  });

  it("builds clone URLs and prompt choices", () => {
    expect(getCloneUrl(repositories[0])).toBe(
      "https://github.com/IceyWu/cloud-template.git"
    );
    expect(toTemplateChoices(repositories)[0]).toEqual({
      label: "cloud-template",
      value: "https://github.com/IceyWu/cloud-template.git",
      hint: "template repo",
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds source order with optional mirrors", () => {
    vi.stubEnv(
      "ICEY_CLI_TEMPLATE_API_MIRRORS",
      "杭州镜像=https://mirror-a.example.com/repos, https://mirror-b.example.com/repos"
    );

    expect(getTemplateSources()).toEqual([
      {
        label: "GitHub API",
        url: "https://api.github.com/users/iceywu/repos?per_page=100&type=owner&sort=updated",
      },
      {
        label: "杭州镜像",
        url: "https://mirror-a.example.com/repos",
      },
      {
        label: "镜像源 2",
        url: "https://mirror-b.example.com/repos",
      },
    ]);
  });

  it("parses named mirrors and skips invalid entries", () => {
    expect(
      parseTemplateMirrorEntry("上海镜像=https://mirror.example.com/repos", 0)
    ).toEqual({
      label: "上海镜像",
      url: "https://mirror.example.com/repos",
    });
    expect(parseTemplateMirrorEntry("bad-entry=", 1)).toBeNull();
  });

  it("uses configurable cache ttl", () => {
    expect(getTemplateCacheTtlMs()).toBe(1000 * 60 * 60 * 12);

    vi.stubEnv("ICEY_CLI_TEMPLATE_CACHE_TTL_MS", "60000");

    expect(getTemplateCacheTtlMs()).toBe(60_000);
    expect(
      isTemplateCacheExpired(
        "2026-03-11T00:00:00.000Z",
        Date.parse("2026-03-11T00:01:01.000Z")
      )
    ).toBe(true);
    expect(
      isTemplateCacheExpired(
        "2026-03-11T00:00:30.000Z",
        Date.parse("2026-03-11T00:01:00.000Z")
      )
    ).toBe(false);
  });
});

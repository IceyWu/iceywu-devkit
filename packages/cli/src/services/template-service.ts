import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import {
  CLI_CONFIG,
  TEMPLATE_CACHE_TTL_ENV,
  TEMPLATE_MIRRORS_ENV,
} from "../config.js";
import { CliError, getErrorMessage } from "../lib/errors.js";
import type {
  GitHubRepo,
  RepositoryGroups,
  TemplateCacheRecord,
  TemplateChoice,
  TemplateGroupsResult,
  TemplateSource,
} from "../types/index.js";

export function filterRepos(repos: GitHubRepo[], key: string) {
  if (!(Array.isArray(repos) && key)) {
    return [];
  }

  return repos.filter(
    (repo) => Array.isArray(repo.topics) && repo.topics.includes(key)
  );
}

export function getCloneUrl(repo: GitHubRepo) {
  return repo.clone_url || repo.git_url || "";
}

function groupRepositories(repositories: GitHubRepo[]): RepositoryGroups {
  const publicRepos = repositories.filter(
    (repo) => !(repo.private || repo.archived)
  );
  const publicNonForkRepos = publicRepos.filter((repo) => !repo.fork);

  return {
    Templates: filterRepos(publicNonForkRepos, "template"),
    "Vite Ecosystem": filterRepos(publicNonForkRepos, "vite"),
    UnoCSS: filterRepos(publicRepos, "unocss"),
    All: publicNonForkRepos,
  };
}

export function toTemplateChoices(
  repositories: GitHubRepo[]
): TemplateChoice[] {
  return repositories.map((repo) => ({
    label: repo.name,
    value: getCloneUrl(repo),
    hint: repo.description || "暂无描述",
  }));
}

function getCacheFilePath() {
  return join(homedir(), ".icey-cli", CLI_CONFIG.github.cacheFileName);
}

export function getTemplateCacheTtlMs() {
  const value = process.env[TEMPLATE_CACHE_TTL_ENV];
  if (!value) {
    return CLI_CONFIG.github.cacheTtlMs;
  }

  const ttl = Number(value);
  return Number.isFinite(ttl) && ttl >= 0 ? ttl : CLI_CONFIG.github.cacheTtlMs;
}

export function parseTemplateMirrorEntry(
  entry: string,
  index: number
): TemplateSource | null {
  const normalized = entry.trim();
  if (!normalized) {
    return null;
  }

  const separatorIndex = normalized.indexOf("=");
  if (separatorIndex <= 0) {
    return {
      label: `镜像源 ${index + 1}`,
      url: normalized,
    };
  }

  const label = normalized.slice(0, separatorIndex).trim();
  const url = normalized.slice(separatorIndex + 1).trim();
  if (!(label && url)) {
    return null;
  }

  return { label, url };
}

export function getTemplateSources(): TemplateSource[] {
  const primaryUrl = `${CLI_CONFIG.github.apiBaseUrl}${CLI_CONFIG.github.reposPath}`;
  const mirrorValues = (process.env[TEMPLATE_MIRRORS_ENV] || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const sources: TemplateSource[] = [];

  const candidates: TemplateSource[] = [
    { label: "GitHub API", url: primaryUrl },
    ...mirrorValues
      .map((entry, index) => parseTemplateMirrorEntry(entry, index))
      .filter((source): source is TemplateSource => source !== null),
  ];

  for (const source of candidates) {
    if (seen.has(source.url)) {
      continue;
    }

    seen.add(source.url);
    sources.push(source);
  }

  return sources;
}

async function fetchRepositoriesFromUrl(
  source: TemplateSource
): Promise<GitHubRepo[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    CLI_CONFIG.github.timeoutMs
  );

  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": CLI_CONFIG.github.userAgent,
      },
    });

    if (!response.ok) {
      throw new CliError(
        `${source.label} 响应错误: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) {
      throw new CliError(`${source.label} 返回的模板数据格式不正确`);
    }

    return data as GitHubRepo[];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function writeTemplateCache(repositories: GitHubRepo[]) {
  const cacheFile = getCacheFilePath();
  const cacheRecord: TemplateCacheRecord = {
    fetchedAt: new Date().toISOString(),
    repositories,
  };

  await mkdir(dirname(cacheFile), { recursive: true });
  await writeFile(
    cacheFile,
    `${JSON.stringify(cacheRecord, null, 2)}\n`,
    "utf8"
  );
}

export function isTemplateCacheExpired(fetchedAt: string, now = Date.now()) {
  const fetchedTime = Date.parse(fetchedAt);
  if (Number.isNaN(fetchedTime)) {
    return true;
  }

  return now - fetchedTime > getTemplateCacheTtlMs();
}

async function readTemplateCache(): Promise<TemplateCacheRecord | null> {
  try {
    const raw = await readFile(getCacheFilePath(), "utf8");
    const data = JSON.parse(raw) as unknown;
    if (Array.isArray(data)) {
      return {
        fetchedAt: new Date(0).toISOString(),
        repositories: data as GitHubRepo[],
      };
    }

    if (!data || typeof data !== "object") {
      return null;
    }

    const cacheRecord = data as Partial<TemplateCacheRecord>;
    if (
      !Array.isArray(cacheRecord.repositories) ||
      typeof cacheRecord.fetchedAt !== "string"
    ) {
      return null;
    }

    return {
      fetchedAt: cacheRecord.fetchedAt,
      repositories: cacheRecord.repositories,
    };
  } catch {
    return null;
  }
}

export async function getTemplateGroups(): Promise<TemplateGroupsResult> {
  const sourceErrors: string[] = [];
  const sources = getTemplateSources();

  for (const source of sources) {
    try {
      const repositories = await fetchRepositoriesFromUrl(source);
      try {
        await writeTemplateCache(repositories);
      } catch {
        // 缓存写入失败不应影响当前模板获取结果。
      }

      return {
        groups: groupRepositories(repositories),
        fallbackReason:
          source.label === "GitHub API"
            ? undefined
            : `GitHub API 不可用，已切换到${source.label}。`,
      };
    } catch (error) {
      sourceErrors.push(getErrorMessage(error));
    }
  }

  const cacheRecord = await readTemplateCache();
  if (cacheRecord && !isTemplateCacheExpired(cacheRecord.fetchedAt)) {
    return {
      groups: groupRepositories(cacheRecord.repositories),
      fallbackReason: "GitHub API 和镜像源都不可用，已回退到本地缓存模板列表。",
    };
  }

  if (cacheRecord) {
    sourceErrors.push("本地缓存已过期");
  }

  return {
    groups: groupRepositories([]),
    fallbackReason: `模板列表获取失败：${sourceErrors.join("；") || `请检查网络，或通过 ${TEMPLATE_MIRRORS_ENV} 配置镜像源。`}`,
  };
}

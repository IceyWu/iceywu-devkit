export const CLI_NAME = "icey";
export const TEMPLATE_MIRRORS_ENV = "ICEY_CLI_TEMPLATE_API_MIRRORS";
export const TEMPLATE_CACHE_TTL_ENV = "ICEY_CLI_TEMPLATE_CACHE_TTL_MS";

export const CLI_CONFIG = {
  github: {
    owner: "iceywu",
    apiBaseUrl: "https://api.github.com",
    reposPath: "/users/iceywu/repos?per_page=100&type=owner&sort=updated",
    userAgent: "icey-cli",
    timeoutMs: 10_000,
    cacheFileName: "template-repositories.json",
    cacheTtlMs: 1000 * 60 * 60 * 12,
  },
  npm: {
    registryBaseUrl: "https://registry.npmjs.org",
    timeoutMs: 5000,
  },
  git: {
    cloneTimeoutMs: 60_000,
  },
  project: {
    maxNameLength: 50,
    invalidNamePattern: /[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g,
  },
} as const;

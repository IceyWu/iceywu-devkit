import semver from "semver";
import { CLI_CONFIG } from "../config.js";
import { CliError } from "../lib/errors.js";
import { getPackageMeta } from "../lib/package.js";

export async function fetchLatestVersion(packageName: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    CLI_CONFIG.npm.timeoutMs
  );

  try {
    const response = await fetch(
      `${CLI_CONFIG.npm.registryBaseUrl}/${packageName}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": CLI_CONFIG.github.userAgent,
        },
      }
    );

    if (!response.ok) {
      throw new CliError(
        `NPM API 响应错误: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as Record<string, unknown>;
    const distTags = data["dist-tags"] as Record<string, string> | undefined;
    if (!distTags?.latest) {
      throw new CliError("无法获取最新版本信息");
    }

    return distTags.latest;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkForUpdates() {
  const pkg = getPackageMeta();
  const latestVersion = await fetchLatestVersion(pkg.name);

  return {
    currentVersion: pkg.version,
    latestVersion,
    hasUpdate: semver.gt(latestVersion, pkg.version),
  };
}

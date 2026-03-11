import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execa } from "execa";
import { CLI_CONFIG } from "../config.js";
import { CliError } from "../lib/errors.js";
import type { ProjectMetadata } from "../types/index.js";

function resolveFromCwd(target: string) {
  return resolve(process.cwd(), target);
}

export function projectExists(projectName: string) {
  return existsSync(resolveFromCwd(projectName));
}

export async function ensureGitAvailable() {
  try {
    await execa`git --version`;
  } catch (error) {
    throw new CliError(
      "运行脚手架必须先安装 Git。",
      "请先安装 Git 并确认命令行可以直接执行 git。",
      { cause: error as Error }
    );
  }
}

export async function removeProjectDirectory(target: string) {
  await rm(resolveFromCwd(target), { recursive: true, force: true });
}

export async function cloneTemplateRepository(
  repository: string,
  appName: string
) {
  await execa({
    timeout: CLI_CONFIG.git.cloneTimeoutMs,
  })`git clone ${repository} ${appName}`;
  await rm(resolveFromCwd(`${appName}/.git`), { recursive: true, force: true });
}

export async function updateProjectPackageJson(
  projectName: string,
  info: ProjectMetadata
) {
  const packageJsonPath = resolveFromCwd(`${projectName}/package.json`);

  if (!existsSync(packageJsonPath)) {
    return;
  }

  const content = await readFile(packageJsonPath, "utf8");
  const pkg = JSON.parse(content) as Record<string, unknown>;

  for (const [key, value] of Object.entries(info)) {
    if (typeof value === "string" && value.trim()) {
      pkg[key] = value.trim();
    }
  }

  await mkdir(resolveFromCwd(projectName), { recursive: true });
  await writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
}

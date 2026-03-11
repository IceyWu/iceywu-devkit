import * as p from "@clack/prompts";
import boxen from "boxen";
import chalk from "chalk";
import { table } from "table";
import { CLI_NAME } from "../config.js";
import type { CliError } from "../lib/errors.js";
import { getErrorMessage } from "../lib/errors.js";
import { formatTime } from "../lib/time.js";
import type { GitHubRepo, PackageMeta } from "../types/index.js";

export function showBanner(pkg: PackageMeta) {
  const message = [
    `欢迎使用 ${CLI_NAME}`,
    "",
    pkg.description,
    `当前版本：${pkg.version}`,
    "为您提供多个情景下的项目模板，快捷搭建项目",
  ].join("\n");

  console.log(
    boxen(message, {
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
    })
  );
}

export function showHelpFooter() {
  console.log(
    `\nRun ${chalk.cyanBright(`${CLI_NAME} <command> --help`)} for detailed usage.`
  );
}

export function showInfo(message: string) {
  console.log(chalk.blue(`ℹ ${message}`));
}

export function showSuccess(message: string) {
  console.log(chalk.green(`✔ ${message}`));
}

export function showWarning(message: string) {
  console.log(chalk.yellow(`⚠ ${message}`));
}

export function showError(error: unknown) {
  console.error(chalk.red(`✖ ${getErrorMessage(error)}`));

  if (error instanceof Error && "hint" in error) {
    const cliError = error as CliError;
    if (cliError.hint) {
      console.error(chalk.yellow(`提示: ${cliError.hint}`));
    }
  }
}

export async function withSpinner<T>(
  message: string,
  task: () => Promise<T>,
  successMessage: string
) {
  const status = p.spinner();
  status.start(message);

  try {
    const result = await task();
    status.stop(successMessage);
    return result;
  } catch (error) {
    status.stop("操作失败");
    throw error;
  }
}

export function showTemplateTable(repositories: GitHubRepo[]) {
  const rows = repositories.map((item) => [
    chalk.greenBright(item.name),
    chalk.white(item.clone_url || item.svn_url || ""),
    chalk.white(item.description || "暂无描述"),
    chalk.white(formatTime(item.updated_at ?? "")),
  ]);

  rows.unshift([
    chalk.white("模板名称"),
    chalk.white("模板地址"),
    chalk.white("模板描述"),
    chalk.white("更新时间"),
  ]);

  console.log(table(rows));
}

export function showNextSteps(appName: string) {
  console.log("\n接下来你可以：\n");
  console.log(chalk.cyan(`  cd ${appName}`));
  console.log(chalk.cyan("  npm install"));
  console.log(chalk.cyan("  npm run dev\n"));
}

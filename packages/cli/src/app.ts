import { Command } from "commander";
import { runCreateCommand } from "./commands/create.js";
import { runListCommand } from "./commands/list.js";
import { runUpdateCommand } from "./commands/update.js";
import { CLI_NAME } from "./config.js";
import { getPackageMeta } from "./lib/package.js";
import { showBanner, showError, showHelpFooter } from "./ui/feedback.js";

function withErrorBoundary<T extends unknown[]>(
  handler: (...args: T) => Promise<void>
) {
  return async (...args: T) => {
    try {
      await handler(...args);
    } catch (error) {
      showError(error);
      process.exit(1);
    }
  };
}

export function createCliApp() {
  const pkg = getPackageMeta();
  const program = new Command();

  program
    .name(CLI_NAME)
    .description(pkg.description)
    .usage("<command> [options]")
    .version(pkg.version, "-v, --version")
    .showHelpAfterError()
    .on("--help", () => {
      showBanner(pkg);
      showHelpFooter();
    });

  program
    .command("create [app-name]")
    .description("创建一个新的项目（先选择模板，再输入项目名称）")
    .option("-t, --template <template>", "输入模板名称快速创建项目")
    .option("-f, --force", "强制覆盖本地同名项目")
    .option("-i, --ignore", "忽略项目相关描述,快速创建项目")
    .action(withErrorBoundary(runCreateCommand));

  program
    .command("update")
    .description("检查并提示版本更新")
    .action(withErrorBoundary(runUpdateCommand));

  program
    .command("ls")
    .description("查看所有可用的模板")
    .action(withErrorBoundary(runListCommand));

  return program;
}

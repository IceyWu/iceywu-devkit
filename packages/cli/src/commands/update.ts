import chalk from "chalk";
import { checkForUpdates } from "../services/version-service.js";
import { showInfo, showSuccess, withSpinner } from "../ui/feedback.js";

export async function runUpdateCommand() {
  const result = await withSpinner(
    "正在检查版本更新...",
    () => checkForUpdates(),
    "版本信息检查完成"
  );

  if (result.hasUpdate) {
    console.log("");
    showInfo(`发现新版本：${result.latestVersion}`);
    showInfo(`当前版本：${result.currentVersion}`);
    console.log(chalk.cyan("  npm install -g @iceywu/cli"));
    console.log("");
    return;
  }

  showSuccess(`当前已是最新版本：${result.currentVersion}`);
}

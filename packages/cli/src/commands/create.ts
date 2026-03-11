import { to } from "@iceywu/utils";
import { projectMessages } from "../data.js";
import { CliError } from "../lib/errors.js";
import { validateAppName } from "../lib/validation.js";
import {
  cloneTemplateRepository,
  ensureGitAvailable,
  projectExists,
  removeProjectDirectory,
  updateProjectPackageJson,
} from "../services/project-service.js";
import {
  getTemplateGroups,
  toTemplateChoices,
} from "../services/template-service.js";
import type { CreateProjectOptions, ProjectMetadata } from "../types/index.js";
import {
  showInfo,
  showNextSteps,
  showSuccess,
  showWarning,
  withSpinner,
} from "../ui/feedback.js";
import {
  confirmOverwrite,
  promptProjectMetadata,
  promptProjectName,
  selectTemplate,
} from "../ui/prompts.js";

export async function runCreateCommand(
  appName?: string,
  options: CreateProjectOptions = {}
) {
  await ensureGitAvailable();

  const [, result] = await to(getTemplateGroups());
  const groups = result?.groups;

  if (!groups) {
    throw new CliError("获取模板列表失败");
  }

  if (result?.fallbackReason) {
    showWarning(result.fallbackReason);
  }

  const templateList = groups.Templates;
  if (templateList.length === 0) {
    showWarning("暂无可用模板");
    return;
  }

  let repository = "";

  if (options.template) {
    const template = templateList.find(
      (item) => item.name === options.template
    );
    if (!template) {
      showWarning(`不存在模板 ${options.template}`);
      showInfo("运行 icey ls 查看所有可用模板");
      return;
    }
    repository = template.clone_url || template.git_url || "";
  } else {
    repository = await selectTemplate(toTemplateChoices(templateList));
  }

  const finalProjectName =
    appName?.trim() ||
    (await promptProjectName((input) => {
      const validation = validateAppName(input.trim());
      return validation.isValid ? undefined : validation.message;
    }));

  const validation = validateAppName(finalProjectName);
  if (!validation.isValid) {
    throw new CliError(validation.message);
  }

  if (projectExists(finalProjectName)) {
    if (options.force) {
      await removeProjectDirectory(finalProjectName);
      showSuccess(`已覆盖同名文件夹 ${finalProjectName}`);
    } else {
      const overwrite = await confirmOverwrite(finalProjectName);
      if (!overwrite) {
        showInfo("项目创建已取消");
        return;
      }

      await removeProjectDirectory(finalProjectName);
      showSuccess(`已覆盖同名文件夹 ${finalProjectName}`);
    }
  }

  const metadata: ProjectMetadata = options.ignore
    ? { name: finalProjectName }
    : await promptProjectMetadata(projectMessages, finalProjectName);

  await withSpinner(
    "正在拉取模板...",
    async () => {
      await cloneTemplateRepository(repository, finalProjectName);
      await updateProjectPackageJson(finalProjectName, metadata);
    },
    "模板拉取成功"
  );

  showSuccess(`项目创建成功！路径: ${process.cwd()}\\${finalProjectName}`);
  showNextSteps(finalProjectName);
}

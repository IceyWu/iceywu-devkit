import { cancel, confirm, isCancel, select, text } from "@clack/prompts";
import type { ProjectPromptField, TemplateChoice } from "../types/index.js";

function unwrapCancel<T>(value: T | symbol, message = "操作已取消"): T {
  if (isCancel(value)) {
    cancel(message);
    process.exit(0);
  }

  return value as T;
}

export async function selectTemplate(options: TemplateChoice[]) {
  const answer = await select({
    message: "请选择项目模板：",
    options,
  });

  return unwrapCancel(answer);
}

export async function confirmOverwrite(projectName: string) {
  const answer = await confirm({
    message: `已存在同名文件夹 ${projectName}，是否覆盖？`,
    active: "覆盖",
    inactive: "取消",
    initialValue: false,
  });

  return unwrapCancel(answer);
}

export async function promptProjectName(
  validate: (value: string | undefined) => string | Error | undefined
) {
  const answer = await text({
    message: "请输入项目名称：",
    placeholder: "my-project",
    validate,
  });

  return unwrapCancel(answer).trim();
}

export async function promptProjectMetadata(
  fields: ProjectPromptField[],
  projectName: string
) {
  const results: Record<string, string> = { name: projectName };

  for (const field of fields) {
    if (field.name === "name") {
      continue;
    }

    const answer = await text({
      message: field.message,
      defaultValue:
        field.name === "description" ? `A project named ${projectName}` : "",
    });

    results[field.name] = unwrapCancel(answer).trim();
  }

  return results;
}

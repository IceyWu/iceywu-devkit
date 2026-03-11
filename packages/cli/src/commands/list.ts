import { getTemplateGroups } from "../services/template-service.js";
import { showTemplateTable, showWarning } from "../ui/feedback.js";

export async function runListCommand() {
  const result = await getTemplateGroups();

  if (result.fallbackReason) {
    showWarning(result.fallbackReason);
  }

  const templates = result.groups.Templates;
  if (templates.length === 0) {
    showWarning("暂无可用模板");
    return;
  }

  showTemplateTable(templates);
}

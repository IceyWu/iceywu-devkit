<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { utilsModules } from "../catalog/utils-catalog";
import { executePlaygroundCode } from "../runtime/code-runner";
import type { PlaygroundRunResult } from "../types";
import CodePlayground from "./CodePlayground.vue";
import ExportCatalog from "./ExportCatalog.vue";
import ModuleSidebar from "./ModuleSidebar.vue";

defineOptions({
  components: {
    CodePlayground,
    ExportCatalog,
    ModuleSidebar,
  },
});

function countExamples() {
  return utilsModules.reduce(
    (count, moduleEntry) =>
      count +
      moduleEntry.exports.filter((exportEntry) => exportEntry.hasExample)
        .length,
    0
  );
}

function fallbackSnippet(importPath: string, exportName: string) {
  return `import { ${exportName} } from "${importPath}";\n\nreturn ${exportName};`;
}

const modulePath = ref(utilsModules[0]?.importPath ?? "");
const methodName = ref("");
const moduleQuery = ref("");
const methodQuery = ref("");
const interactiveOnly = ref(false);
const running = ref(false);
const result = ref<PlaygroundRunResult | null>(null);
const lastRunAt = ref("");
const drafts = ref<Record<string, string>>({});

const overview = computed(() => {
  const moduleCount = utilsModules.length;
  const methodCount = utilsModules.reduce(
    (count, moduleEntry) => count + moduleEntry.runtimeCount,
    0
  );

  return {
    exampleCount: countExamples(),
    methodCount,
    moduleCount,
  };
});

const filteredModules = computed(() => {
  const query = moduleQuery.value.trim().toLowerCase();

  return utilsModules.filter((moduleEntry) => {
    const matchedQuery =
      !query ||
      [moduleEntry.title, moduleEntry.importPath, moduleEntry.description].some(
        (field) => field.toLowerCase().includes(query)
      );

    const matchedInteractive =
      !interactiveOnly.value ||
      moduleEntry.exports.some((exportEntry) => exportEntry.hasExample);

    return matchedQuery && matchedInteractive;
  });
});

const activeModule = computed(() => {
  return (
    filteredModules.value.find(
      (moduleEntry) => moduleEntry.importPath === modulePath.value
    ) ??
    filteredModules.value[0] ??
    utilsModules[0]
  );
});

const filteredExports = computed(() => {
  const query = methodQuery.value.trim().toLowerCase();
  const exports = activeModule.value?.exports ?? [];

  return exports.filter((exportEntry) => {
    const matchedQuery =
      !query || exportEntry.exportName.toLowerCase().includes(query);
    const matchedInteractive = !interactiveOnly.value || exportEntry.hasExample;

    return matchedQuery && matchedInteractive;
  });
});

const activeMethod = computed(() => {
  return (
    filteredExports.value.find(
      (exportEntry) => exportEntry.exportName === methodName.value
    ) ?? filteredExports.value[0]
  );
});

const activeKey = computed(() => {
  if (!activeMethod.value) {
    return "";
  }

  return `${activeMethod.value.importPath}:${activeMethod.value.exportName}`;
});

const currentCode = computed({
  get() {
    if (!activeMethod.value) {
      return "";
    }

    return (
      drafts.value[activeKey.value] ??
      activeMethod.value.example?.code ??
      fallbackSnippet(
        activeMethod.value.importPath,
        activeMethod.value.exportName
      )
    );
  },
  set(value: string) {
    if (!activeKey.value) {
      return;
    }

    drafts.value = {
      ...drafts.value,
      [activeKey.value]: value,
    };
  },
});

watch(
  activeModule,
  (nextModule) => {
    if (!nextModule?.exports.length) {
      methodName.value = "";
      return;
    }

    if (
      !nextModule.exports.some(
        (exportEntry) => exportEntry.exportName === methodName.value
      )
    ) {
      methodName.value = nextModule.exports[0]?.exportName ?? "";
    }
  },
  { immediate: true }
);

watch(
  activeMethod,
  (nextMethod) => {
    if (
      !(nextMethod && activeKey.value) ||
      drafts.value[activeKey.value] !== undefined
    ) {
      return;
    }

    drafts.value = {
      ...drafts.value,
      [activeKey.value]:
        nextMethod.example?.code ??
        fallbackSnippet(nextMethod.importPath, nextMethod.exportName),
    };
  },
  { immediate: true }
);

function selectModule(nextImportPath: string) {
  modulePath.value = nextImportPath;
  result.value = null;
}

function selectMethod(nextMethodName: string) {
  methodName.value = nextMethodName;
  result.value = null;
}

function resetFilters() {
  moduleQuery.value = "";
  methodQuery.value = "";
  interactiveOnly.value = false;
}

function resetCurrentCode() {
  if (!(activeMethod.value && activeKey.value)) {
    return;
  }

  drafts.value = {
    ...drafts.value,
    [activeKey.value]:
      activeMethod.value.example?.code ??
      fallbackSnippet(
        activeMethod.value.importPath,
        activeMethod.value.exportName
      ),
  };
}

async function runCurrentCode() {
  if (!currentCode.value.trim()) {
    return;
  }

  running.value = true;
  result.value = await executePlaygroundCode(currentCode.value);
  lastRunAt.value = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  running.value = false;
}
</script>

<template>
  <div class="shell">
    <header class="hero panel">
      <div class="hero-main">
        <p class="eyebrow">IceyWu Utils Atlas</p>
        <h1>可编辑 Playground</h1>
        <p class="hero-copy">
          模块、导出、代码和结果都放进首屏。
        </p>
      </div>

      <div class="hero-metrics">
        <article class="hero-metric">
          <strong>{{ overview.moduleCount }}</strong>
          <span>公开入口</span>
        </article>
        <article class="hero-metric">
          <strong>{{ overview.methodCount }}</strong>
          <span>运行时导出</span>
        </article>
        <article class="hero-metric accent">
          <strong>{{ overview.exampleCount }}</strong>
          <span>默认 demo</span>
        </article>
      </div>
    </header>

    <main class="workspace">
      <ModuleSidebar
        :active-import-path="activeModule?.importPath || ''"
        :module-query="moduleQuery"
        :modules="filteredModules"
        :total-examples="overview.exampleCount"
        @select="selectModule"
        @update:module-query="moduleQuery = $event"
      />

      <ExportCatalog
        :active-export-name="activeMethod?.exportName || ''"
        :active-module="activeModule"
        :exports="filteredExports"
        :interactive-only="interactiveOnly"
        :method-query="methodQuery"
        @reset="resetFilters"
        @select="selectMethod"
        @toggle-interactive="interactiveOnly = !interactiveOnly"
        @update:method-query="methodQuery = $event"
      />

      <CodePlayground
        :active-method="activeMethod"
        :code="currentCode"
        :example="activeMethod?.example"
        :last-run-at="lastRunAt"
        :result="result"
        :running="running"
        @reset-code="resetCurrentCode"
        @run="runCurrentCode"
        @update:code="currentCode = $event"
      />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.hero {
  align-items: center;
  display: grid;
  flex-shrink: 0;
  gap: 12px;
  grid-template-columns: minmax(0, 1.2fr) auto;
  padding: 12px 16px;
}

.hero-main {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.eyebrow {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  margin: 0;
  text-transform: uppercase;
}

.hero h1 {
  font-size: clamp(1.3rem, 1.8vw, 1.7rem);
  line-height: 1.04;
  margin: 0;
  max-width: none;
}

.hero-copy {
  color: var(--muted-strong);
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
  max-width: none;
}

.hero-metrics {
  display: grid;
  align-self: start;
  gap: 8px;
  grid-template-columns: repeat(3, minmax(74px, 1fr));
}

.hero-metric {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  display: grid;
  gap: 4px;
  min-width: 74px;
  padding: 9px 11px;
}

.hero-metric strong {
  font-size: 1.35rem;
  line-height: 1;
}

.hero-metric span {
  color: var(--muted);
  font-size: 0.66rem;
}

.hero-metric.accent {
  background: var(--surface-accent);
  border-color: var(--accent-soft);
}

.workspace {
  align-items: stretch;
  display: grid;
  flex: 1;
  gap: 12px;
  grid-template-columns: 240px 320px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 1180px) {
  .workspace {
    grid-template-columns: 1fr;
    overflow: auto;
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .hero-main {
    align-items: start;
    display: grid;
    gap: 8px;
  }

  .hero h1 {
    max-width: none;
  }

  .hero-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
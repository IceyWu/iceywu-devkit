<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PlaygroundExportEntry, PlaygroundModuleEntry } from "../types";

const props = defineProps<{
  activeExportName: string;
  activeModule?: PlaygroundModuleEntry;
  exports: PlaygroundExportEntry[];
  interactiveOnly: boolean;
  methodQuery: string;
}>();

const emit = defineEmits<{
  reset: [];
  select: [exportName: string];
  toggleInteractive: [];
  "update:methodQuery": [value: string];
}>();

type RuntimeKind = PlaygroundExportEntry["runtimeKind"];

const groupMeta: Record<RuntimeKind, string> = {
  class: "Class",
  function: "Function",
  object: "Object",
  value: "Value",
};

const collapsedGroups = ref<Record<RuntimeKind, boolean>>({
  class: false,
  function: false,
  object: false,
  value: false,
});

const groupedExports = computed(() => {
  return (Object.keys(groupMeta) as RuntimeKind[])
    .map((runtimeKind) => ({
      exports: props.exports.filter(
        (exportEntry) => exportEntry.runtimeKind === runtimeKind
      ),
      runtimeKind,
      title: groupMeta[runtimeKind],
    }))
    .filter((group) => group.exports.length > 0);
});

const exportSummary = computed(() => {
  const demoCount = props.exports.filter(
    (exportEntry) => exportEntry.hasExample
  ).length;

  return {
    demoCount,
    totalCount: props.exports.length,
  };
});

watch(
  () => props.activeModule?.importPath,
  () => {
    collapsedGroups.value = {
      class: false,
      function: false,
      object: false,
      value: false,
    };
  },
  { immediate: true }
);

function toggleGroup(runtimeKind: RuntimeKind) {
  collapsedGroups.value[runtimeKind] = !collapsedGroups.value[runtimeKind];
}
</script>

<template>
  <section class="panel catalog-panel">
    <div class="catalog-header">
      <div>
        <p class="eyebrow">Module Workspace</p>
        <h2>{{ activeModule?.title || '未选择模块' }}</h2>
        <p class="catalog-description">{{ activeModule?.description || '请选择模块。' }}</p>
      </div>

      <div v-if="activeModule?.runtimeCount" class="catalog-summary">
        <article class="summary-chip accent">
          <strong>{{ exportSummary.demoCount }}</strong>
          <span>demo 覆盖</span>
        </article>
        <article class="summary-chip">
          <strong>{{ exportSummary.totalCount }}</strong>
          <span>当前方法</span>
        </article>
      </div>

      <div class="actions">
        <label class="field search-field">
          <span>搜索方法</span>
          <input
            :value="methodQuery"
            placeholder="to / diff / merge"
            type="text"
            @input="emit('update:methodQuery', ($event.target as HTMLInputElement).value)"
          >
        </label>
        <button :class="['filter-button', { active: interactiveOnly }]" type="button" @click="emit('toggleInteractive')">
          只看可运行
        </button>
        <button class="filter-button secondary" type="button" @click="emit('reset')">
          重置
        </button>
      </div>
    </div>

    <div v-if="!activeModule?.runtimeCount" class="empty-state">
      {{ activeModule?.emptyState || '当前入口没有运行时导出。' }}
    </div>
    <div v-else-if="!exports.length" class="empty-state">
      当前筛选条件下没有方法。
    </div>
    <div v-else class="export-grid scroll-panel">
      <section
        v-for="group in groupedExports"
        :key="group.runtimeKind"
        class="export-section"
      >
        <button
          class="section-header"
          type="button"
          @click="toggleGroup(group.runtimeKind)"
        >
          <div>
            <strong>{{ group.title }}</strong>
            <span>{{ group.exports.length }} 项</span>
          </div>
          <span class="section-toggle">{{ collapsedGroups[group.runtimeKind] ? '展开' : '收起' }}</span>
        </button>

        <div v-if="!collapsedGroups[group.runtimeKind]" class="section-list">
          <button
            v-for="exportEntry in group.exports"
            :key="`${exportEntry.importPath}:${exportEntry.exportName}`"
            :class="['export-card', { active: exportEntry.exportName === activeExportName }]"
            type="button"
            @click="emit('select', exportEntry.exportName)"
          >
            <div class="export-card-top">
              <strong>{{ exportEntry.exportName }}</strong>
              <span>{{ exportEntry.runtimeKind }}</span>
            </div>
            <p class="export-summary">
              {{ exportEntry.example?.summary || '目录浏览模式，当前没有绑定初始 demo。' }}
            </p>
            <div class="tags">
              <span :class="['tag', exportEntry.hasExample ? 'tag-live' : 'tag-catalog']">
                {{ exportEntry.hasExample ? 'runnable' : 'catalog' }}
              </span>
              <span class="tag tag-import">{{ exportEntry.importPath }}</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.catalog-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.catalog-header {
  align-items: end;
  border-bottom: 1px solid var(--line);
  display: grid;
  gap: 12px;
  padding-bottom: 14px;
  flex-shrink: 0;
}

.eyebrow {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  margin: 0;
  text-transform: uppercase;
}

.catalog-header h2 {
  font-size: 1.5rem;
  line-height: 1.05;
  margin: 4px 0 0;
}

.catalog-description {
  color: var(--muted-strong);
  font-size: 0.85rem;
  line-height: 1.35;
  margin: 4px 0 0;
}

.catalog-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-chip {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  display: grid;
  gap: 4px;
  min-width: 88px;
  padding: 9px 11px;
}

.summary-chip strong {
  font-size: 1rem;
  line-height: 1;
}

.summary-chip span {
  color: var(--muted);
  font-size: 0.66rem;
}

.summary-chip.accent {
  background: var(--surface-accent);
  border-color: var(--accent-soft);
}

.actions {
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-field {
  flex: 1 1 100%;
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  color: var(--muted);
  font-size: 0.78rem;
}

.field input {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  color: var(--text);
  font: inherit;
  outline: none;
  padding: 10px 12px;
}

.field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(212, 143, 68, 0.12);
}

.filter-button {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  color: var(--text);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  padding: 10px 14px;
}

.filter-button.active {
  background: var(--text);
  border-color: var(--text);
  color: #fff;
}

.filter-button.secondary {
  background: transparent;
}

.export-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 4px;
  padding-right: 4px;
}

.export-section {
  display: grid;
  gap: 8px;
}

.section-header {
  align-items: center;
  background: var(--surface-alt);
  border: 1px solid var(--line);
  border-radius: 14px;
  color: inherit;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  text-align: left;
}

.section-header strong {
  display: block;
  font-size: 0.86rem;
}

.section-header span,
.section-toggle {
  color: var(--muted);
  font-size: 0.72rem;
}

.section-list {
  display: grid;
  gap: 10px;
}

.export-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 8px;
  min-height: 92px;
  padding: 12px;
  text-align: left;
  transition: border-color 160ms ease, transform 160ms ease;
}

.export-card:hover {
  border-color: var(--line-strong);
  transform: translateY(-1px);
}

.export-card.active {
  background: var(--surface-accent);
  border-color: var(--accent-soft);
}

.export-card-top {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.export-card-top strong {
  font-size: 0.92rem;
}

.export-card-top span {
  color: var(--muted);
  font-size: 0.74rem;
  text-transform: uppercase;
}

.export-summary {
  color: var(--muted-strong);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  font-size: 0.78rem;
  line-height: 1.35;
  margin: 0;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  border-radius: 999px;
  font-size: 0.66rem;
  padding: 4px 8px;
}

.tag-live {
  background: rgba(58, 123, 102, 0.12);
  color: #1f5b49;
}

.tag-catalog,
.tag-import {
  background: var(--surface-alt);
  color: var(--muted);
}

.empty-state {
  background: var(--surface);
  border: 1px dashed var(--line-strong);
  border-radius: 20px;
  color: var(--muted);
  padding: 28px 16px;
  text-align: center;
}

@media (max-width: 880px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
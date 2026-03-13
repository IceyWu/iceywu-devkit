<script setup lang="ts">
import type { PlaygroundModuleEntry } from "../types";

defineProps<{
  activeImportPath: string;
  modules: PlaygroundModuleEntry[];
  moduleQuery: string;
  totalExamples: number;
}>();

const emit = defineEmits<{
  select: [importPath: string];
  "update:moduleQuery": [value: string];
}>();

function countExamples(moduleEntry: PlaygroundModuleEntry) {
  return moduleEntry.exports.filter((exportEntry) => exportEntry.hasExample)
    .length;
}
</script>

<template>
  <aside class="panel sidebar">
    <div class="panel-header">
      <div>
        <p class="eyebrow">Import Paths</p>
        <h2>模块入口</h2>
      </div>
      <div class="metric-chip">
        <strong>{{ modules.length }}</strong>
        <span>当前结果</span>
      </div>
    </div>

    <label class="field">
      <span>搜索模块</span>
      <input
        :value="moduleQuery"
        placeholder="root / object / tools"
        type="text"
        @input="emit('update:moduleQuery', ($event.target as HTMLInputElement).value)"
      >
    </label>

    <div class="metric-row">
      <article class="metric-card">
        <strong>{{ totalExamples }}</strong>
        <span>内置 demo</span>
      </article>
      <article class="metric-card">
        <strong>{{ modules.length }}</strong>
        <span>匹配模块</span>
      </article>
    </div>

    <div class="module-list scroll-panel">
      <button
        v-for="moduleEntry in modules"
        :key="moduleEntry.importPath"
        :class="['module-card', { active: moduleEntry.importPath === activeImportPath }]"
        type="button"
        @click="emit('select', moduleEntry.importPath)"
      >
        <div class="module-title-row">
          <strong>{{ moduleEntry.title }}</strong>
          <span>{{ moduleEntry.runtimeCount }} exports</span>
        </div>
        <p class="module-path">{{ moduleEntry.importPath }}</p>
        <p class="module-description">{{ moduleEntry.description }}</p>
        <p class="module-demo-count">{{ countExamples(moduleEntry) }} demos</p>
      </button>

      <div v-if="!modules.length" class="empty-state">
        当前没有匹配到模块。
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
}

.panel-header {
  align-items: start;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.panel-header h2 {
  font-size: 1.4rem;
  line-height: 1.05;
  margin: 4px 0 0;
}

.eyebrow {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  margin: 0;
  text-transform: uppercase;
}

.metric-chip,
.metric-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 18px;
}

.metric-chip {
  align-items: center;
  display: grid;
  min-width: 86px;
  padding: 8px 10px;
  text-align: right;
}

.metric-chip strong,
.metric-card strong {
  font-size: 1.05rem;
  line-height: 1;
}

.metric-chip span,
.metric-card span,
.field span,
.module-demo-count {
  color: var(--muted);
  font-size: 0.78rem;
}

.field {
  display: grid;
  gap: 8px;
  flex-shrink: 0;
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

.metric-row {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.metric-card {
  display: grid;
  gap: 4px;
  padding: 10px;
}

.module-list {
  display: grid;
  gap: 8px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

@media (max-width: 1180px) {
  .sidebar {
    max-height: none;
    position: static;
  }
}

.module-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 6px;
  padding: 12px;
  text-align: left;
  transition: border-color 160ms ease, transform 160ms ease;
}

.module-card:hover {
  border-color: var(--line-strong);
  transform: translateY(-1px);
}

.module-card.active {
  background: var(--surface-accent);
  border-color: var(--accent-soft);
}

.module-title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.module-title-row strong {
  font-size: 0.92rem;
}

.module-title-row span,
.module-path {
  color: var(--muted);
  font-size: 0.75rem;
}

.module-path {
  background: var(--surface-alt);
  border-radius: 999px;
  display: inline-flex;
  padding: 4px 10px;
  width: fit-content;
}

.module-description {
  color: var(--muted-strong);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  font-size: 0.78rem;
  line-height: 1.35;
  margin: 0;
  overflow: hidden;
}

.empty-state {
  background: var(--surface);
  border: 1px dashed var(--line-strong);
  border-radius: 20px;
  color: var(--muted);
  padding: 24px 16px;
  text-align: center;
}
</style>
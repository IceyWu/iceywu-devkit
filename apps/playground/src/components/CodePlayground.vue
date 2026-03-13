<script setup lang="ts">
import { computed } from "vue";
import type {
  PlaygroundExample,
  PlaygroundExportEntry,
  PlaygroundRunResult,
} from "../types";

const props = defineProps<{
  activeMethod?: PlaygroundExportEntry;
  code: string;
  example?: PlaygroundExample;
  lastRunAt: string;
  result: PlaygroundRunResult | null;
  running: boolean;
}>();

const emit = defineEmits<{
  resetCode: [];
  run: [];
  "update:code": [value: string];
}>();

function createDisplayReplacer() {
  const seen = new WeakSet<object>();

  return (_key: string, value: unknown) => {
    if (value instanceof Error) {
      return {
        message: value.message,
        name: value.name,
      };
    }

    if (value instanceof Map) {
      return { type: "Map", value: Array.from(value.entries()) };
    }

    if (value instanceof Set) {
      return { type: "Set", value: Array.from(value.values()) };
    }

    if (typeof value === "function") {
      return `[Function ${value.name || "anonymous"}]`;
    }

    if (typeof value === "bigint") {
      return `${value}n`;
    }

    if (value && typeof value === "object") {
      if (seen.has(value as object)) {
        return "[Circular]";
      }

      seen.add(value as object);
    }

    return value;
  };
}

function formatValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined) {
    return "undefined";
  }

  try {
    return JSON.stringify(value, createDisplayReplacer(), 2);
  } catch {
    return String(value);
  }
}

const outputText = computed(() => {
  if (props.running) {
    return "正在执行示例，请稍候...";
  }

  if (props.result) {
    return formatValue(props.result.value);
  }

  return props.example
    ? "点击运行，查看当前编辑代码的真实输出。"
    : "当前方法没有内置 demo，你也可以直接在编辑器里自己写代码。";
});

const logsText = computed(() => {
  if (!props.result?.logs.length) {
    return "暂无 console 输出。";
  }

  return props.result.logs
    .map((entry, index) => {
      const payload = entry.values.map((value) => formatValue(value)).join(" ");
      return `[${index + 1}] ${entry.level.toUpperCase()} ${payload}`;
    })
    .join("\n");
});
</script>

<template>
  <section class="playground-grid">
    <article class="panel editor-panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Editable Demo</p>
          <h2>{{ example?.title || activeMethod?.exportName || '代码编辑器' }}</h2>
          <p class="summary">
            {{ example?.summary || '直接编辑代码后运行。当前执行器支持 named import 和 namespace import。' }}
          </p>
        </div>

        <div class="heading-actions">
          <button class="action-button secondary" type="button" @click="emit('resetCode')">
            恢复初始代码
          </button>
          <button class="action-button primary" type="button" @click="emit('run')">
            {{ running ? '运行中...' : '运行代码' }}
          </button>
        </div>
      </div>

      <textarea
        :value="code"
        class="editor"
        spellcheck="false"
        @input="emit('update:code', ($event.target as HTMLTextAreaElement).value)"
      />

      <div v-if="example?.notes?.length" class="notes">
        <strong>说明</strong>
        <ul>
          <li v-for="note in example.notes" :key="note">{{ note }}</li>
        </ul>
      </div>
    </article>

    <article class="panel result-panel">
      <div class="panel-heading compact">
        <div>
          <p class="eyebrow">Runtime Output</p>
          <h2>{{ activeMethod?.exportName || '输出面板' }}</h2>
        </div>
        <div class="runtime-meta">
          <span v-if="result">{{ result.durationMs.toFixed(1) }} ms</span>
          <span v-if="lastRunAt">{{ lastRunAt }}</span>
        </div>
      </div>

      <div class="output-block">
        <strong>返回值</strong>
        <pre class="code-view scroll-panel">{{ outputText }}</pre>
      </div>

      <div class="output-block">
        <strong>Console</strong>
        <pre class="code-view scroll-panel">{{ logsText }}</pre>
      </div>

      <div class="output-block" v-if="example?.input !== undefined">
        <strong>初始输入</strong>
        <pre class="code-view scroll-panel">{{ formatValue(example.input) }}</pre>
      </div>
    </article>
  </section>
</template>

<style scoped>
.playground-grid {
  display: grid;
  align-items: stretch;
  gap: 12px;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  grid-template-rows: 1fr;
  height: 100%;
  min-height: 0;
}

.editor-panel,
.result-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.panel-heading {
  align-items: start;
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding-bottom: 12px;
  flex-shrink: 0;
}

.panel-heading.compact h2 {
  font-size: 1.35rem;
}

.eyebrow {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  margin: 0;
  text-transform: uppercase;
}

.panel-heading h2 {
  font-size: 1.45rem;
  line-height: 1.08;
  margin: 4px 0 0;
}

.summary {
  color: var(--muted-strong);
  font-size: 0.84rem;
  line-height: 1.35;
  margin: 8px 0 0;
  max-width: 54ch;
}

.heading-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  border: 1px solid var(--line);
  border-radius: 16px;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  padding: 10px 14px;
}

.action-button.primary {
  background: var(--text);
  border-color: var(--text);
  color: #fff;
}

.action-button.secondary {
  background: var(--surface);
  color: var(--text);
}

.editor {
  background: #101715;
  border: 1px solid #1a2623;
  border-radius: 18px;
  color: #edf5f1;
  flex: 1;
  font: 400 12px/1.6 var(--font-mono);
  min-height: 0;
  outline: none;
  padding: 14px;
  resize: none;
}

.runtime-meta {
  display: grid;
  gap: 6px;
  justify-items: end;
}

.runtime-meta span {
  background: var(--surface-alt);
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.68rem;
  padding: 4px 8px;
}

.output-block {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  min-height: 0;
}

.output-block strong,
.notes strong {
  font-size: 0.78rem;
  flex-shrink: 0;
}

.code-view {
  background: #121917;
  border: 1px solid #1a2623;
  border-radius: 16px;
  color: #edf5f1;
  flex: 1;
  font: 400 11px/1.5 var(--font-mono);
  margin: 0;
  min-height: 0;
  padding: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}

.notes {
  background: var(--surface-alt);
  border: 1px solid var(--line);
  border-radius: 18px;
  flex-shrink: 0;
  padding: 14px 16px;
}

.notes ul {
  color: var(--muted-strong);
  margin: 8px 0 0;
  padding-left: 18px;
}

.notes li + li {
  margin-top: 6px;
}

@media (max-width: 1040px) {
  .playground-grid {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(400px, auto) minmax(400px, auto);
    overflow: auto;
    height: auto;
  }

  .panel-heading {
    flex-direction: column;
  }

  .heading-actions {
    width: 100%;
  }

  .action-button {
    flex: 1;
  }
}
</style>
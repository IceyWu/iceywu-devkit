export interface PlaygroundExample {
  code: string;
  exportName: string;
  importPath: string;
  input?: unknown;
  notes?: string[];
  summary: string;
  title: string;
}

export interface PlaygroundLogEntry {
  level: "error" | "info" | "log" | "warn";
  values: unknown[];
}

export interface PlaygroundRunResult {
  durationMs: number;
  logs: PlaygroundLogEntry[];
  value: unknown;
}

export interface PlaygroundExportEntry {
  example?: PlaygroundExample;
  exportName: string;
  hasExample: boolean;
  importPath: string;
  runtimeKind: "class" | "function" | "object" | "value";
}

export interface PlaygroundModuleEntry {
  description: string;
  emptyState?: string;
  exports: PlaygroundExportEntry[];
  importPath: string;
  runtimeCount: number;
  title: string;
}

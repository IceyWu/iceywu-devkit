export interface GitHubRepo {
  archived?: boolean;
  clone_url?: string;
  description?: string | null;
  fork?: boolean;
  git_url?: string;
  name: string;
  private?: boolean;
  svn_url?: string;
  topics?: string[];
  updated_at?: string;
}

export interface RepositoryGroups {
  All: GitHubRepo[];
  Templates: GitHubRepo[];
  UnoCSS: GitHubRepo[];
  "Vite Ecosystem": GitHubRepo[];
}

export interface TemplateChoice {
  hint?: string;
  label: string;
  value: string;
}

export interface ProjectPromptField {
  message: string;
  name: string;
}

export interface CreateProjectOptions {
  force?: boolean;
  ignore?: boolean;
  template?: string;
}

export interface ProjectMetadata {
  description?: string;
  name?: string;
}

export interface TemplateGroupsResult {
  fallbackReason?: string;
  groups: RepositoryGroups;
}

export interface TemplateSource {
  label: string;
  url: string;
}

export interface TemplateCacheRecord {
  fetchedAt: string;
  repositories: GitHubRepo[];
}

export interface PackageMeta {
  description: string;
  name: string;
  version: string;
}

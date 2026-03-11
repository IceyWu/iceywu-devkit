# @iceywu/cli

TypeScript CLI package for project scaffolding and template discovery.

The legacy `icey-cli` source has been re-architected in this workspace package.

Current package goals:

- keep `@iceywu/utils` as a local workspace dependency
- publish the scoped package while preserving `icey` and `icey-cli` command aliases
- use TypeScript for command, service, and prompt boundaries
- use `@clack/prompts` for interaction and `execa` for subprocess execution
- keep the current command behavior stable while improving maintainability
- keep the source tree fully in TypeScript and fetch template data dynamically

Template discovery now uses this priority order:

- GitHub API
- mirror APIs from `ICEY_CLI_TEMPLATE_API_MIRRORS` (comma-separated URLs, supports `名称=URL`)
- local runtime cache written after a successful fetch

Optional runtime configuration:

- `ICEY_CLI_TEMPLATE_API_MIRRORS=杭州镜像=https://mirror-a.example.com/repos,备用镜像=https://mirror-b.example.com/repos`
- `ICEY_CLI_TEMPLATE_CACHE_TTL_MS=43200000` to control cache expiration in milliseconds

## Structure

- `src/app.ts`: CLI composition and command registration
- `src/commands/*`: user-facing command handlers
- `src/services/*`: GitHub, git, filesystem, and npm interactions
- `src/ui/*`: prompt wrappers and terminal feedback
- `src/lib/*`: validation, formatting, package metadata, and errors
- `src/types/*`: shared TypeScript models

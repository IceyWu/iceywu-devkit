# Command Design

## Design Priorities

- Keep commands scriptable first and interactive second
- Prefer explicit subcommands over overloaded flags
- Keep handlers small enough to test independently
- Separate command orchestration from prompt UI and filesystem side effects

## Preferred Tooling

- Use @clack/prompts for interaction
- Use execa for subprocess execution
- Keep validation and formatting logic in src/lib
- Use services for remote fetches and other side effects

## Template Discovery

Fetch template data in this order:

1. GitHub API
2. Mirror APIs from ICEY_CLI_TEMPLATE_API_MIRRORS
3. Local runtime cache after a successful fetch

## Runtime Configuration

- ICEY_CLI_TEMPLATE_API_MIRRORS supports a comma-separated list with optional display names in the form 名称=URL
- ICEY_CLI_TEMPLATE_CACHE_TTL_MS controls cache expiration in milliseconds

Example:

```text
ICEY_CLI_TEMPLATE_API_MIRRORS=杭州镜像=https://mirror-a.example.com/repos,备用镜像=https://mirror-b.example.com/repos
ICEY_CLI_TEMPLATE_CACHE_TTL_MS=43200000
```

## Change Rules

- Reusable string, array, object, and async helpers belong in @iceywu/utils only when they have non-CLI reuse value
- Prompt wording and terminal formatting belong in ui helpers, not in low-level services
- Validation should fail early and return actionable user-facing errors

# Workspace Layout

## Core Decision

Use one repository with two publishable workspace packages and one root-level Agent Skills area.

This keeps a single dependency graph and release surface for code while treating skills as repository content instead of npm packages.

## Package Boundaries

### @iceywu/utils

- Pure utility library
- No CLI logic
- Can be consumed by external apps and by @iceywu/cli
- Keep the root entry curated and stable
- Publish larger utility domains through explicit subpath exports when that improves clarity and tree-shaking

### @iceywu/cli

- User-facing executable
- Depends on @iceywu/utils through workspace:*
- Owns command parsing, terminal IO, templates, and remote fetching
- Implemented as a layered TypeScript CLI

### skills

- Not treated as a workspace package
- Versioned with the repository
- Compatible with the Agent Skills folder convention
- Each skill should be independently installable by directory name

## Placement Rules

- New publishable code belongs under packages
- Agent instructions belong under skills/{skill-name}/SKILL.md
- Internal tooling that is not part of a skill belongs under tools or another non-skill area

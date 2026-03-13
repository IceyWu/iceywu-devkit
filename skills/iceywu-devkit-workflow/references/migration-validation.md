# Migration And Validation

## Migration Phases

### Phase 1

- Stabilize workspace layout
- Add build, check, and skill validation scripts
- Completed

### Phase 2

- Migrate current utils source into packages/utils
- Migrate current icey-cli source into packages/cli
- Replace published dependency on @iceywu/utils with a local workspace dependency
- Completed

### Phase 3

- Rewrite skill content around the new monorepo commands
- Add per-skill references and optional scripts only when needed
- CLI TypeScript refactor completed with @clack/prompts and execa

## Verified State

- pnpm install succeeds at the monorepo root
- pnpm check succeeds for skills validation and package validation
- pnpm build succeeds for both @iceywu/utils and @iceywu/cli
- pnpm test succeeds for both migrated packages

## Repository Commands

```bash
pnpm install
pnpm build
pnpm check
pnpm test
pnpm validate:skills
```

## What Not To Keep

- Do not keep code generators inside installable skills unless agents must execute them directly
- Do not force skills to become a workspace package
- Do not mirror the old repository layout if it does not serve the current dependency model

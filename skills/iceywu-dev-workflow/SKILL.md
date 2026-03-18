---
name: iceywu-dev-workflow
description: IceyWu day-to-day development workflow for making focused changes, validating locally, and preparing safe repository updates. Use when coordinating edits across packages, docs, and release-related tasks.
metadata:
  author: IceyWu
  version: "2026.3.18"
  source: Derived from repository scripts, AGENTS.md, and workspace conventions
---

# IceyWu Dev Workflow

> Use this skill when the task is about how to work inside the repository rather than a single package API.

## Preferences

- Make small, reviewable changes
- Validate the narrowest affected scope first
- Escalate to repository-wide checks before release

## Quick Reference

### Common Commands

```bash
pnpm build
pnpm check
pnpm test
```

### Workflow Rules

```text
1. Prefer package-local validation during development.
2. Run repository-level checks before publish or merge.
3. Keep release blockers visible and fix root causes instead of bypassing checks.
```

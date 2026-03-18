---
name: pnpm
description: Node.js package manager with strict dependency resolution. Use when running pnpm workspace commands, managing lockfiles, or changing dependency versions in this repository.
metadata:
  author: IceyWu
  version: "2026.3.18"
  source: Derived from pnpm workspace usage in this repository
---

# pnpm

> Use this skill when the task touches dependencies, lockfiles, workspace filters, or package scripts.

## Preferences

- Use workspace filters to limit blast radius
- Keep the shared lockfile up to date
- Prefer deterministic installs and reproducible CI

## Quick Reference

### Common Commands

```bash
pnpm install
pnpm --filter @iceywu/utils build
pnpm --filter @iceywu/utils test
pnpm --filter @iceywu/utils up --latest <package>
```

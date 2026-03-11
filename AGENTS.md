# IceyWu Agent Skills

This repository follows the Agent Skills layout.

## Available Skills

- `iceywu-utils`
- `iceywu-cli`
- `iceywu-devkit-workflow`

## Repository Layout

- `skills/` contains installable skills
- `packages/` contains product code managed by pnpm workspace
- `docs/` contains design notes and migration guidance

## Usage

Install all skills from this repository:

```bash
npx skills add <owner>/iceywu-devkit --skill='*'
```

Install one skill only:

```bash
npx skills add <owner>/iceywu-devkit --skill iceywu-utils
```

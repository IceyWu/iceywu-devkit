# Skills Maintenance

This folder owns the **upstream-sync** infrastructure for skills under `skills/` that mirror external sources.

In-house skills authored directly in this repo (e.g. `iceywu-utils`, `iceywu-cli`, `iceywu-devkit-workflow`) are **not** managed here — edit them directly under `skills/<name>/`.

## Layout

```
internal/skills-maintenance/
├── README.md              this file
├── sync.config.json       declarative list of synced skills + locked upstream SHA
└── sync.mjs               sync runner (pnpm sync:skills)
```

## How a sync works

1. Read `sync.config.json`. Each entry declares:
   - `skill` — the local skill directory under `skills/`
   - `repo` — upstream git repository (HTTPS)
   - `ref` — branch or tag to track (e.g. `main`)
   - `sourcePath` — path inside the upstream repo to copy
   - `lockedSha` — last verified upstream SHA (rewritten by the runner)
2. The runner shallow-clones each upstream into a temp directory, copies the declared `sourcePath` into the skill folder, writes `skills/<skill>/GENERATION.md` with the upstream URL + SHA + timestamp, and updates `lockedSha`.
3. After running, validate everything: `pnpm validate:skills`.

## Commands

```bash
pnpm sync:skills              # sync every entry in sync.config.json
pnpm sync:skills -- vue       # sync only the named skill
```

The runner requires `git` on `PATH`. It does **not** auto-commit; review the diff and commit by hand.

## CI Cadence

`.github/workflows/skills-sync.yml` runs the sync weekly and opens a PR titled `chore(skills): sync upstream`. Merging it carries the new SHA into `sync.config.json`.

## Adding a New Upstream Skill

1. Create the local skill directory `skills/<name>/` with a placeholder `SKILL.md` describing intent.
2. Add an entry to `sync.config.json`.
3. Run `pnpm sync:skills -- <name>` and review the result.
4. Open a PR including the `lockedSha` update.

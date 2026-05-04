#!/usr/bin/env node
/**
 * Sync upstream-mirrored skills into skills/<name>/.
 *
 * Reads internal/skills-maintenance/sync.config.json, then for each entry:
 *   1. Shallow-clones the upstream repo into a temp directory.
 *   2. Copies <sourcePath>/* into skills/<skill>/.
 *   3. Writes skills/<skill>/GENERATION.md with the upstream URL + SHA + timestamp.
 *   4. Updates the entry's lockedSha in sync.config.json.
 *
 * Usage:
 *   node internal/skills-maintenance/sync.mjs              # sync all entries
 *   node internal/skills-maintenance/sync.mjs vue          # sync one skill
 *
 * Requires `git` on PATH. Does not auto-commit; review the diff first.
 */

import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");
const CONFIG_PATH = join(HERE, "sync.config.json");

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited with status ${result.status}`);
  }
}

function captureStdout(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    stdio: ["ignore", "pipe", "inherit"],
    encoding: "utf8",
    ...opts,
  });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited with status ${result.status}`);
  }
  return result.stdout.trim();
}

function loadConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
}

function saveConfig(config) {
  writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
}

function syncSkill(entry) {
  const { skill, repo, ref, sourcePath } = entry;
  const skillDir = join(REPO_ROOT, "skills", skill);
  const tempDir = mkdtempSync(join(tmpdir(), `skills-sync-${skill}-`));
  console.log(`[${skill}] cloning ${repo}@${ref} into ${tempDir}`);

  try {
    run("git", ["clone", "--depth", "1", "--branch", ref, repo, tempDir]);
    const sha = captureStdout("git", ["rev-parse", "HEAD"], { cwd: tempDir });
    const upstreamSource = join(tempDir, sourcePath);

    rmSync(skillDir, { recursive: true, force: true });
    cpSync(upstreamSource, skillDir, { recursive: true });

    const generation = [
      "# Generation Info",
      "",
      `- **Source:** ${repo}/tree/${sha}/${sourcePath}`,
      `- **Git SHA:** \`${sha}\``,
      `- **Generated:** ${new Date().toISOString().slice(0, 10)}`,
      "",
    ].join("\n");
    writeFileSync(join(skillDir, "GENERATION.md"), generation);

    entry.lockedSha = sha;
    console.log(`[${skill}] synced -> ${sha}`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function main() {
  const config = loadConfig();
  const filter = process.argv[2];
  const targets = filter
    ? config.skills.filter((entry) => entry.skill === filter)
    : config.skills;

  if (targets.length === 0) {
    console.error(filter ? `no skill named "${filter}" in sync config` : "no skills configured");
    process.exit(1);
  }

  for (const entry of targets) {
    try {
      syncSkill(entry);
    } catch (error) {
      console.error(`[${entry.skill}] sync failed: ${error.message}`);
      process.exit(1);
    }
  }

  saveConfig(config);
  console.log(`\nDone. Reviewed ${targets.length} skill(s). Run \`pnpm validate:skills\` next.`);
}

main();

#!/usr/bin/env node
/**
 * Validate every directory under skills/ against the Agent Skills spec
 * (https://agentskills.io/specification).
 *
 * Per-skill checks:
 *  - SKILL.md exists.
 *  - Has a fenced YAML frontmatter block (--- ... ---).
 *  - Frontmatter `name` matches the spec format and equals the directory name.
 *  - Frontmatter `description` is 1-1024 chars.
 *  - SKILL.md body is <= MAX_BODY_LINES lines (progressive-disclosure budget).
 *  - Every relative markdown link in SKILL.md resolves on disk.
 *
 * Repo-level checks:
 *  - AGENTS.md exists at the repository root.
 *  - skills/ exists and contains at least one skill directory.
 *
 * Run with: node tools/validate-skills.mjs (or `pnpm validate:skills`).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const MAX_BODY_LINES = 500;
const DESCRIPTION_MIN = 1;
const DESCRIPTION_MAX = 1024;

const NAME_RE = /^(?!-)(?!.*--)[a-z0-9-]{1,64}(?<!-)$/;
const FRONTMATTER_LINE_RE = /^(\s*)([A-Za-z0-9_-]+):\s*(.*)$/;
const LINK_RE = /\[[^\]]+\]\(([^)]+)\)/g;
const NEWLINE_RE = /\r?\n/;
const USE_WHEN_RE = /use when/i;

const root = process.cwd();
const agentsFile = join(root, "AGENTS.md");
const skillsDir = join(root, "skills");

const errors = [];
const warnings = [];

function err(skill, message) {
  errors.push(`${skill}: ${message}`);
}

function warn(skill, message) {
  warnings.push(`${skill}: ${message}`);
}

function unquote(value) {
  if (value.length < 2) {
    return value;
  }
  const first = value[0];
  const last = value.at(-1);
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}

function findFrontmatterRange(lines, skill) {
  if (lines[0] !== "---") {
    err(skill, "SKILL.md must start with a YAML frontmatter block (---)");
    return null;
  }
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      return { start: 1, end: i };
    }
  }
  err(skill, "SKILL.md frontmatter is missing its closing ---");
  return null;
}

function parseFrontmatterLine(line, lineIndex, skill) {
  if (line.includes("\t")) {
    err(skill, `frontmatter line ${lineIndex + 1} uses tab indentation; YAML requires spaces`);
    return null;
  }
  const match = line.match(FRONTMATTER_LINE_RE);
  if (!match) {
    err(skill, `cannot parse frontmatter line ${lineIndex + 1}: ${JSON.stringify(line)}`);
    return null;
  }
  const [, indent, key, rawValue] = match;
  return { indent: indent.length, key, value: unquote(rawValue.trim()) };
}

/**
 * Minimal YAML frontmatter parser for the agentskills.io spec subset:
 *  - `key: value` at root level.
 *  - One nested level under `metadata:` indented by exactly two spaces.
 *  - Quoted scalars (single or double) are unwrapped.
 *  - Tab indentation is rejected.
 */
function parseFrontmatter(source, skill) {
  const lines = source.split(NEWLINE_RE);
  const range = findFrontmatterRange(lines, skill);
  if (!range) {
    return null;
  }

  const data = {};
  let nested = null;

  for (let i = range.start; i < range.end; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }
    const parsed = parseFrontmatterLine(raw, i, skill);
    if (!parsed) {
      return null;
    }
    if (parsed.indent === 0) {
      if (parsed.value === "") {
        data[parsed.key] = {};
        nested = data[parsed.key];
      } else {
        data[parsed.key] = parsed.value;
        nested = null;
      }
    } else if (parsed.indent === 2 && nested) {
      nested[parsed.key] = parsed.value;
    } else {
      err(skill, `unexpected indentation on frontmatter line ${i + 1}`);
      return null;
    }
  }

  data.__bodyStart = range.end + 1;
  return data;
}

function validateName(skill, dirName, name) {
  if (!name) {
    err(skill, "frontmatter is missing required field: name");
    return;
  }
  if (!NAME_RE.test(name)) {
    err(
      skill,
      `name "${name}" violates spec (lowercase a-z 0-9 -, 1-64 chars, no leading/trailing or consecutive hyphens)`
    );
  }
  if (name !== dirName) {
    err(skill, `name "${name}" must equal directory name "${dirName}"`);
  }
}

function validateDescription(skill, description) {
  if (!description) {
    err(skill, "frontmatter is missing required field: description");
    return;
  }
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    err(
      skill,
      `description length ${description.length} is outside spec bounds [${DESCRIPTION_MIN}, ${DESCRIPTION_MAX}]`
    );
  }
  if (!USE_WHEN_RE.test(description)) {
    warn(skill, 'description is missing a "Use when ..." trigger phrase');
  }
}

function validateBody(skill, source, bodyStart) {
  const bodyLines = source.split(NEWLINE_RE).slice(bodyStart);
  if (bodyLines.length > MAX_BODY_LINES) {
    err(
      skill,
      `SKILL.md body has ${bodyLines.length} lines, exceeding the ${MAX_BODY_LINES}-line progressive-disclosure budget; move detail into references/`
    );
  }
}

function isExternalLink(target) {
  return (
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("data:")
  );
}

function validateLinks(skill, skillDir, source) {
  const seen = new Set();
  const matches = source.matchAll(LINK_RE);
  for (const match of matches) {
    const target = match[1].split("#")[0].split("?")[0];
    if (!target || isExternalLink(target) || seen.has(target)) {
      continue;
    }
    seen.add(target);
    const resolved = resolve(skillDir, target);
    if (!existsSync(resolved)) {
      err(
        skill,
        `broken relative link: ${target} (resolved to ${relative(root, resolved)})`
      );
    }
  }
}

function validateSkill(dirName, dir) {
  const skillId = `skills/${dirName}`;
  const skillFile = join(dir, "SKILL.md");
  if (!existsSync(skillFile)) {
    err(skillId, "missing SKILL.md");
    return;
  }
  const source = readFileSync(skillFile, "utf8");
  const front = parseFrontmatter(source, skillId);
  if (!front) {
    return;
  }
  validateName(skillId, dirName, front.name);
  validateDescription(skillId, front.description);
  validateBody(skillId, source, front.__bodyStart);
  validateLinks(skillId, dir, source);
}

function listSkills() {
  return readdirSync(skillsDir)
    .map((name) => ({ name, path: join(skillsDir, name) }))
    .filter(({ path }) => statSync(path).isDirectory());
}

function main() {
  if (!existsSync(agentsFile)) {
    errors.push("repo: missing AGENTS.md at repository root");
  }
  if (!existsSync(skillsDir)) {
    errors.push("repo: missing skills/ directory at repository root");
    return;
  }

  const skills = listSkills();
  if (skills.length === 0) {
    errors.push("repo: skills/ contains no skill directories");
    return;
  }

  for (const { name, path } of skills) {
    validateSkill(name, path);
  }

  if (warnings.length) {
    for (const w of warnings) {
      console.warn(`warn  ${w}`);
    }
  }
  if (errors.length) {
    console.error(`\nFound ${errors.length} skill validation error(s):`);
    for (const e of errors) {
      console.error(`  - ${e}`);
    }
    process.exit(1);
  }

  const trailing = warnings.length ? ` (${warnings.length} warning(s))` : "";
  console.log(`Validated ${skills.length} skill(s) successfully${trailing}.`);
}

main();

if (errors.length) {
  process.exit(1);
}

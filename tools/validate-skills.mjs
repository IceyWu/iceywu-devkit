import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const agentsFile = join(root, "AGENTS.md");
const skillsDir = join(root, "skills");

if (!existsSync(agentsFile)) {
  console.error("Missing AGENTS.md at repository root");
  process.exit(1);
}

if (!existsSync(skillsDir)) {
  console.error("Missing skills directory at repository root");
  process.exit(1);
}

const skillDirs = readdirSync(skillsDir)
  .map((name) => join(skillsDir, name))
  .filter((path) => statSync(path).isDirectory());

if (skillDirs.length === 0) {
  console.error("No skills found under skills/");
  process.exit(1);
}

const invalidSkills = skillDirs.filter(
  (dir) => !existsSync(join(dir, "SKILL.md"))
);

if (invalidSkills.length > 0) {
  console.error("Each skill directory must include SKILL.md");
  invalidSkills.forEach((dir) => console.error(`- ${dir}`));
  process.exit(1);
}

console.log(`Validated ${skillDirs.length} skills successfully.`);

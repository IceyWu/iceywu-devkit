import { access } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const packageJson = require("../package.json");
const relativePrefix = /^\.\//;

async function assertFileExists(relativePath) {
  const filePath = join(packageRoot, relativePath);
  await access(filePath);
}

async function validateExportFiles() {
  const exportEntries = Object.entries(packageJson.exports);

  for (const [, conditions] of exportEntries) {
    for (const condition of Object.values(conditions)) {
      await assertFileExists(condition.types.replace(relativePrefix, ""));
      await assertFileExists(condition.default.replace(relativePrefix, ""));
    }
  }
}

async function validateRuntimeImports() {
  const runtimeChecks = {
    ".": ["to", "toTry", "toPro"],
    "./promise": ["to", "toTry", "toPro"],
    "./is": ["isString"],
    "./shared": ["getRandom"],
    "./array": ["diff"],
    "./async-task": ["getAsyncTask", "all", "sleep"],
    "./download": ["createDownload", "downloadFile"],
    "./lodash-lite": ["sortObj"],
    "./log": ["consolePlus", "typeColor"],
    "./network": ["getStreamResponse"],
    "./object": ["getObjVal", "deepMerge"],
    "./tools": ["destr", "getFileType"],
    "./to-pro": ["toPro"],
  };

  for (const [subpath, exportNames] of Object.entries(runtimeChecks)) {
    const specifier =
      subpath === "." ? "@iceywu/utils" : `@iceywu/utils/${subpath.slice(2)}`;
    const module = await import(specifier);

    for (const exportName of exportNames) {
      if (!(exportName in module)) {
        throw new TypeError(
          `Export '${exportName}' is missing from '${subpath}'`
        );
      }
    }
  }
}

await validateExportFiles();
await validateRuntimeImports();

console.log("Verified package exports successfully.");

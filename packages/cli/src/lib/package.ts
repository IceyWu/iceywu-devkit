import { existsSync, readFileSync } from "node:fs";
import type { PackageMeta } from "../types/index.js";

let cache: PackageMeta | undefined;

export function getPackageMeta(): PackageMeta {
  if (cache) {
    return cache;
  }

  const candidates = [
    new URL("../package.json", import.meta.url),
    new URL("../../package.json", import.meta.url),
  ];

  const packageJsonUrl = candidates.find((url) => existsSync(url));
  if (!packageJsonUrl) {
    throw new Error("Unable to locate package.json for @iceywu/cli");
  }

  const raw = readFileSync(packageJsonUrl, "utf8");
  cache = JSON.parse(raw) as PackageMeta;
  return cache;
}

import { createRequire } from "node:module";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, type PluginOption } from "vite";

const require = createRequire(import.meta.url);
const tailwindcss = require("@tailwindcss/vite").default as () => PluginOption;

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "@iceywu/utils/promise",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/promise.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/async-task",
        replacement: fileURLToPath(
          new URL(
            "../../packages/utils/src/asyncTask/index.ts",
            import.meta.url
          )
        ),
      },
      {
        find: "@iceywu/utils/array",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/array/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/download",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/download/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/is",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/is/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/lodash-lite",
        replacement: fileURLToPath(
          new URL(
            "../../packages/utils/src/lodash-lite/index.ts",
            import.meta.url
          )
        ),
      },
      {
        find: "@iceywu/utils/log",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/log/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/network",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/network/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/object",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/object/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/shared",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/shared/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/tools",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/tools/index.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/to-pro",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/to/toPro.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils/types",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/types.ts", import.meta.url)
        ),
      },
      {
        find: "@iceywu/utils",
        replacement: fileURLToPath(
          new URL("../../packages/utils/src/index.ts", import.meta.url)
        ),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
});

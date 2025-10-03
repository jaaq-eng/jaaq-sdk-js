/// <reference types="node" />
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  dts: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2020",
  platform: "neutral", // not asume node or browser.
  define: {
    "process.env.JAAQ_API_URL": JSON.stringify(process.env.JAAQ_API_URL),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  esbuildPlugins: [TsconfigPathsPlugin({})],
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".cjs" };
  },
});

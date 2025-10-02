/// <reference types="node" />
import { defineConfig } from "tsup";
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";

const { JAAQ_API_URL, NODE_ENV } = process.env;

console.log("[build] NODE_ENV:", NODE_ENV, "JAAQ_API_URL:", JAAQ_API_URL);

export default defineConfig({
  define: {
    "process.env.JAAQ_API_URL": JAAQ_API_URL
      ? JSON.stringify(JAAQ_API_URL)
      : "undefined",
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV ?? "production"),
  },
  entry: ["src/index.ts"],
  outDir: "dist",
  dts: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  splitting: false,
  clean: true,
  target: "es2020",
  treeshake: true,
  minify: false,
  platform: "neutral", // not asume node or browser.
  skipNodeModulesBundle: true, // do not bundle node_modules
  esbuildPlugins: [TsconfigPathsPlugin({})],
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".cjs" };
  },
});

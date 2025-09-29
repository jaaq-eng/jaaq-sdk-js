import { defineConfig } from "tsup";
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";

export default defineConfig({
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

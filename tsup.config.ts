/// <reference types="node" />
import { defineConfig } from "tsup";
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";
import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";

const envName = process.env.NODE_ENV ?? "development";
const candidateByName = path.resolve(process.cwd(), `.env.${envName}`);
const candidateDefault = path.resolve(process.cwd(), `.env`);

if (fs.existsSync(candidateByName)) {
  dotenv.config({ path: candidateByName, override: false });
} else if (fs.existsSync(candidateDefault)) {
  dotenv.config({ path: candidateDefault, override: false });
}

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

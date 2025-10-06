import { defineConfig, configDefaults } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["tests/build/**/*.test.ts", "tests/build/**/*.spec.ts"],
    exclude: [...configDefaults.exclude],
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/core"),
      "@resources": path.resolve(__dirname, "src/resources"),
      "@gen": path.resolve(__dirname, "src/gen"),
      "@tests": path.resolve(__dirname, "tests"),
    },
  },
});

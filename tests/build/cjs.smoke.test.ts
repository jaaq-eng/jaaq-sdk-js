import { describe, it, expect, beforeAll } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
import * as dotenv from "dotenv";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdk = require("../../dist/index.cjs");

function loadEnvForTests() {
  const envName = process.env.NODE_ENV ?? "development";
  const byName = path.resolve(process.cwd(), `.env.${envName}`);
  const def = path.resolve(process.cwd(), `.env`);
  if (fs.existsSync(byName)) dotenv.config({ path: byName, override: false });
  else if (fs.existsSync(def)) dotenv.config({ path: def, override: false });
}

beforeAll(loadEnvForTests);

const distCjs = path.resolve(process.cwd(), "dist", "index.cjs");
const code = fs.readFileSync(distCjs, "utf8");

describe("cjs build", () => {
  it("exposes public API", () => {
    expect(Object.keys(sdk)).toEqual(
      expect.arrayContaining(["createJaaqClient", "JaaqClient", "BASE_URL"])
    );
  });

  it("should not contain process.env references", () => {
    expect(code).not.toMatch(/process\.env/);
  });

  it("should inline the expected BASE_URL literal and export it", () => {
    const expected = process.env.JAAQ_API_URL ?? "https://api.jaaq.app/v1";
    expect(code).toContain(expected);
    expect(sdk.BASE_URL).toBe(expected);
  });
});

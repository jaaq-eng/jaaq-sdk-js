import { describe, it, expect } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdk = require("../../dist/index.cjs");

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

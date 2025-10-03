import { describe, it, expect } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
// @ts-ignore
import * as sdk from "../../dist/index.mjs";

const distMjs = path.resolve(process.cwd(), "dist", "index.mjs");
const code = fs.readFileSync(distMjs, "utf8");

describe("esm build", () => {
  it("exposes public API", () => {
    expect(Object.keys(sdk)).toEqual(
      expect.arrayContaining(["createJaaqClient", "JaaqClient", "BASE_URL"])
    );
  });

  it("should not contain process.env references", () => {
    expect(code).not.toMatch(/process\.env/);
  });

  it("should inline the expected BASE_URL literal and export it", () => {
    const expected = process.env.JAAQ_API_URL;
    expect(code).toContain(expected);
    expect(sdk.BASE_URL).toBeDefined();
    expect(sdk.BASE_URL).toBe(expected);
  });
});

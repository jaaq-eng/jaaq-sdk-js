import { describe, it, expect } from "vitest";
// @ts-ignore
const sdk = require("../../dist/index.cjs");

describe("cjs build", () => {
  it("expose public API", () => {
    expect(Object.keys(sdk)).toEqual(
      expect.arrayContaining(["createJaaqClient", "JaaqClient", "BASE_URL"])
    );
  });
});

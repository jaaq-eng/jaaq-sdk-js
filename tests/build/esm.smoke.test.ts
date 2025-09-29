import { describe, it, expect } from "vitest";
import * as sdk from "../../dist/index.mjs";

describe("esm build", () => {
  it("expose public API", () => {
    expect(Object.keys(sdk)).toEqual(
      expect.arrayContaining(["createJaaqClient", "JaaqClient", "BASE_URL"])
    );
  });
});

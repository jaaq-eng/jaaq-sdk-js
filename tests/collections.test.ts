import { describe, it, expect, beforeEach } from "vitest";
import { JaaqClient } from "@src/index";
import collections from "@tests/mocks/collections.json";
import collection from "@tests/mocks/collection.json";

describe("collections resource", () => {
  let sdk: JaaqClient;

  beforeEach(() => {
    sdk = JaaqClient.init({
      baseUrl: "http://localhost:3000",
      apiKey: "test-key",
      clientId: "acme",
    });
  });

  it("list returns collections", async () => {
    const res = await sdk.collections.list();
    expect(res.length).toBe(collections.collections.length);
    expect(res[0].id).toBe(collections.collections[0].id);
  });

  it("getById returns a single collection", async () => {
    const res = await sdk.collections.getById(collection.collection.id);
    expect(res.id).toBe(collection.collection.id);
    expect(res.name).toBe(collection.collection.name);
  });
});

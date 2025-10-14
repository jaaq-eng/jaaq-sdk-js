import { describe, it, expect, beforeEach } from "vitest";
import { JaaqClient } from "@src/index";
import collectionsResp from "@tests/mocks/collections.json";
import collectionResp from "@tests/mocks/collection.json";

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
    expect(res.length).toBe(collectionsResp.collections.length);
    expect(res[0].id).toBe(collectionsResp.collections[0].id);
  });

  it("getById returns a single collection", async () => {
    const res = await sdk.collections.getById(collectionResp.collection.id);
    expect(res.id).toBe(collectionResp.collection.id);
    expect(res.name).toBe(collectionResp.collection.name);
  });
});

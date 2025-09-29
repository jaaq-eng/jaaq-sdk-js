import { describe, it, expect } from "vitest";
import { createJaaqClient } from "@src/index";
import videos from "@tests/mocks/videos.json";

describe("videos resource", () => {
  it("getVideos returns list", async () => {
    const sdk = createJaaqClient({
      baseUrl: "http://localhost:3000",
      apiKey: "test-key",
      clientId: "acme",
    });

    const res = await sdk.videos.getVideos();
    expect(res.items.length).toBe(videos.items.length);
    expect(res.total).toBe(videos.total);
  });
});

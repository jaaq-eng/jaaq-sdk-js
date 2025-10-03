import { describe, it, expect } from "vitest";
import { JaaqClient } from "@src/index";
import videos from "@tests/mocks/videos.json";

describe("videos resource", () => {
  it("getById returns a single video", async () => {
    const sdk = JaaqClient.init({
      baseUrl: "http://localhost:3000",
      apiKey: "test-key",
      clientId: "acme",
    });

    const res = await sdk.videos.getById(videos.video.id);
    expect(res.id).toBe(videos.video.id);
    expect(res.videoId).toBe(videos.video.videoId);
  });
});

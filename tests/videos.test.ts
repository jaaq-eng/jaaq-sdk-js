import { describe, it, expect } from 'vitest';
import { JaaqClient } from '@src/index';
import videoResp from '@tests/mocks/video.json';

describe('videos resource', () => {
  it('getById returns a single video', async () => {
    const sdk = JaaqClient.init({
      baseUrl: 'http://localhost:3000',
      apiKey: 'test-key',
      clientId: 'acme',
    });

    const res = await sdk.videos.getById(videoResp.video.id);
    expect(res.id).toBe(videoResp.video.id);
    expect(res.videoId).toBe(videoResp.video.videoId);
  });
});

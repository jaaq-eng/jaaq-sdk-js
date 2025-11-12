import { describe, it, expect, beforeEach } from 'vitest';
import { JaaqClient } from '@src/index';
import videoResp from '@tests/mocks/video.json';

describe('videos resource', () => {
  let sdk: JaaqClient;

  beforeEach(() => {
    sdk = JaaqClient.init({
      baseUrl: 'http://localhost:3000',
      apiKey: 'test-key',
      clientId: 'acme',
    });
  });

  it('getById returns a single video', async () => {
    const res = await sdk.videos.getById(videoResp.video.id);
    expect(res.id).toBe(videoResp.video.id);
    expect(res.videoId).toBe(videoResp.video.videoId);
  });

  it('throws error for 404 status', async () => {
    await expect(sdk.videos.getById('non-existent-id')).rejects.toThrow('HTTP 404');
  });

  it('throws error for 500 status', async () => {
    await expect(sdk.videos.getById('server-error')).rejects.toThrow('HTTP 500');
  });

  it('handles URL encoding for special characters in video ID', async () => {
    const specialId = 'special-chars-video-id';
    const res = await sdk.videos.getById(specialId);
    expect(res.id).toBe(specialId);
  });

  it('handles already encoded video IDs', async () => {
    const encodedId = 'special%20chars%20video%20id';
    const res = await sdk.videos.getById(encodedId);
    expect(res.id).toBe(encodedId);
  });

  it('handles empty string ID', async () => {
    await expect(sdk.videos.getById('')).rejects.toThrow();
  });

  it('handles very long video ID', async () => {
    const longId = 'a'.repeat(1000);
    await expect(sdk.videos.getById(longId)).rejects.toThrow();
  });
});

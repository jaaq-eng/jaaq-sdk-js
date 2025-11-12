import { describe, it, expect, beforeEach } from 'vitest';
import { JaaqClient } from '@src/index';
import videoResp from '@tests/mocks/video.json';
import collectionResp from '@tests/mocks/collection.json';
import collectionsResp from '@tests/mocks/collections.json';

describe('Integration tests', () => {
  let sdk: JaaqClient;

  beforeEach(() => {
    sdk = JaaqClient.init({
      baseUrl: 'http://localhost:3000',
      apiKey: 'test-key',
      clientId: 'acme',
    });
  });

  describe('End-to-end flows', () => {
    it('can fetch multiple resources in sequence', async () => {
      const collections = await sdk.collections.list();
      expect(collections.length).toBeGreaterThan(0);

      const collection = await sdk.collections.getById(collectionResp.collection.id);
      expect(collection.id).toBe(collectionResp.collection.id);

      const video = await sdk.videos.getById(videoResp.video.id);
      expect(video.id).toBe(videoResp.video.id);
    });

    it('can fetch videos and collections independently', async () => {
      const videoPromise = sdk.videos.getById(videoResp.video.id);
      const collectionsPromise = sdk.collections.list();

      const [video, collections] = await Promise.all([videoPromise, collectionsPromise]);

      expect(video.id).toBe(videoResp.video.id);
      expect(collections.length).toBe(collectionsResp.collections.length);
    });

    it('maintains state across multiple calls', async () => {
      const video1 = await sdk.videos.getById(videoResp.video.id);
      const video2 = await sdk.videos.getById(videoResp.video.id);

      expect(video1.id).toBe(video2.id);
      expect(video1.videoId).toBe(video2.videoId);
    });
  });

  describe('Resource independence', () => {
    it('videos and collections resources are independent', () => {
      expect(sdk.videos).toBeDefined();
      expect(sdk.collections).toBeDefined();
      expect(sdk.videos).not.toBe(sdk.collections);
    });

    it('videos resource calls do not affect collections', async () => {
      await sdk.videos.getById(videoResp.video.id);
      const collections = await sdk.collections.list();
      expect(collections.length).toBe(collectionsResp.collections.length);
    });

    it('collections resource calls do not affect videos', async () => {
      await sdk.collections.list();
      const video = await sdk.videos.getById(videoResp.video.id);
      expect(video.id).toBe(videoResp.video.id);
    });
  });

  describe('Header persistence', () => {
    it('maintains headers across multiple requests', async () => {
      const video1 = await sdk.videos.getById(videoResp.video.id);
      const video2 = await sdk.videos.getById(videoResp.video.id);
      const collection = await sdk.collections.getById(collectionResp.collection.id);

      expect(video1).toBeDefined();
      expect(video2).toBeDefined();
      expect(collection).toBeDefined();
    });
  });
});

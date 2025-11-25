import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JaaqClient, createJaaqClient } from '@src/index';

describe('SDK initialization', () => {
  const originalEnv = process.env.JAAQ_API_URL;

  beforeEach(() => {
    delete process.env.JAAQ_API_URL;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.JAAQ_API_URL = originalEnv;
    }
  });

  describe('JaaqClient.init and createJaaqClient', () => {
    it('both methods create equivalent clients', () => {
      const config = {
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'acme',
      };

      const clientFromInit = JaaqClient.init(config);
      const clientFromFactory = createJaaqClient(config);

      expect(Object.keys(clientFromInit)).toEqual(expect.arrayContaining(['videos', 'collections']));
      expect(Object.keys(clientFromFactory)).toEqual(expect.arrayContaining(['videos', 'collections']));
      expect(typeof clientFromInit.videos.getById).toBe('function');
      expect(typeof clientFromFactory.videos.getById).toBe('function');
      expect(typeof clientFromInit.collections.list).toBe('function');
      expect(typeof clientFromFactory.collections.list).toBe('function');
    });
  });

  describe('BASE_URL fallback', () => {
    it('uses BASE_URL from environment when baseUrl not provided', () => {
      process.env.JAAQ_API_URL = 'https://api.example.com';

      const client = JaaqClient.init({
        apiKey: 'test-key',
        clientId: 'test-client',
      });

      expect(client).toBeDefined();
      expect(client.videos).toBeDefined();
      expect(client.collections).toBeDefined();
    });

    it('uses provided baseUrl over environment variable', () => {
      process.env.JAAQ_API_URL = 'https://api.example.com';

      const customBaseUrl = 'https://custom.api.com';
      const client = JaaqClient.init({
        baseUrl: customBaseUrl,
        apiKey: 'test-key',
        clientId: 'test-client',
      });

      expect(client).toBeDefined();
    });
  });

  describe('Custom fetch injection', () => {
    it('uses custom fetch implementation', () => {
      const customFetch = vi.fn(async () => {
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const client = JaaqClient.init({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: customFetch,
      });

      expect(client).toBeDefined();
    });

    it('falls back to globalThis.fetch when custom fetch not provided', () => {
      const client = JaaqClient.init({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
      });

      expect(client).toBeDefined();
    });
  });
});

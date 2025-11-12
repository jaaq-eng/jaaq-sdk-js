import { describe, it, expect, beforeEach } from 'vitest';
import { JaaqClient } from '@src/index';
import collectionsResp from '@tests/mocks/collections.json';
import collectionResp from '@tests/mocks/collection.json';

describe('collections resource', () => {
  let sdk: JaaqClient;

  beforeEach(() => {
    sdk = JaaqClient.init({
      baseUrl: 'http://localhost:3000',
      apiKey: 'test-key',
      clientId: 'acme',
    });
  });

  it('list returns collections', async () => {
    const res = await sdk.collections.list();
    expect(res.length).toBe(collectionsResp.collections.length);
    expect(res[0].id).toBe(collectionsResp.collections[0].id);
  });

  it('getById returns a single collection', async () => {
    const res = await sdk.collections.getById(collectionResp.collection.id);
    expect(res.id).toBe(collectionResp.collection.id);
    expect(res.name).toBe(collectionResp.collection.name);
  });

  it('getById throws error for 404 status', async () => {
    await expect(sdk.collections.getById('non-existent-id')).rejects.toThrow('HTTP 404');
  });

  it('getById throws error for 500 status', async () => {
    await expect(sdk.collections.getById('server-error')).rejects.toThrow('HTTP 500');
  });

  it('handles URL encoding for special characters in collection ID', async () => {
    const specialId = 'special-chars-collection-id';
    const res = await sdk.collections.getById(specialId);
    expect(res.id).toBe(specialId);
  });

  it('handles already encoded collection IDs', async () => {
    const encodedId = 'special%20chars%20collection%20id';
    const res = await sdk.collections.getById(encodedId);
    expect(res.id).toBe(encodedId);
  });

  it('handles empty string ID', async () => {
    await expect(sdk.collections.getById('')).rejects.toThrow();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createHttpClient } from '@core/httpClient';
import { JaaqClient } from '@src/index';

describe('Error handling', () => {
  describe('Network errors', () => {
    it('handles connection failures', async () => {
      const failingFetch = vi.fn(async () => {
        throw new Error('Network request failed');
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: failingFetch,
      });

      await expect(http.get('test/get')).rejects.toThrow('Network request failed');
    });

    it('handles DNS errors', async () => {
      const dnsErrorFetch = vi.fn(async () => {
        throw new Error('getaddrinfo ENOTFOUND');
      });

      const http = createHttpClient({
        baseUrl: 'http://invalid-domain-12345.com',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: dnsErrorFetch,
      });

      await expect(http.get('test')).rejects.toThrow('getaddrinfo ENOTFOUND');
    });
  });

  describe('Invalid responses', () => {
    it('handles non-JSON responses', async () => {
      const htmlFetch = vi.fn(async () => {
        return new Response('<html><body>Not JSON</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: htmlFetch,
      });

      await expect(http.get('test')).rejects.toThrow();
    });

    it('handles malformed JSON responses', async () => {
      const malformedJsonFetch = vi.fn(async () => {
        return new Response('{ invalid json }', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: malformedJsonFetch,
      });

      await expect(http.get('test')).rejects.toThrow();
    });

    it('handles empty response body with 200 status', async () => {
      const emptyFetch = vi.fn(async () => {
        return new Response('', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: emptyFetch,
      });

      await expect(http.get('test')).rejects.toThrow();
    });
  });

  describe('HTTP error parsing', () => {
    it('extracts error message from response body', async () => {
      const errorFetch = vi.fn(async () => {
        return new Response(JSON.stringify({ error: 'Custom error message', code: 'ERR001' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: errorFetch,
      });

      try {
        await http.get('test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain('HTTP 400');
        expect(err.message).toContain('Custom error message');
      }
    });

    it('handles error response with empty body', async () => {
      const emptyErrorFetch = vi.fn(async () => {
        return new Response('', {
          status: 500,
          statusText: 'Internal Server Error',
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: emptyErrorFetch,
      });

      try {
        await http.get('test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain('HTTP 500');
      }
    });
  });

  describe('SDK-level error handling', () => {
    it('propagates errors from videos resource', async () => {
      const sdk = JaaqClient.init({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'acme',
      });

      await expect(sdk.videos.getById('non-existent-id')).rejects.toThrow('HTTP 404');
    });

    it('propagates errors from collections resource', async () => {
      const sdk = JaaqClient.init({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'acme',
      });

      await expect(sdk.collections.getById('non-existent-id')).rejects.toThrow('HTTP 404');
    });
  });
});

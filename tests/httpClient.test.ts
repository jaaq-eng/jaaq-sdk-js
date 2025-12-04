import { describe, it, expect, vi } from 'vitest';
import { createHttpClient } from '@core/httpClient';

describe('httpClient', () => {
  describe('HTTP methods', () => {
    it('GET request succeeds', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const result = await http.get<{ method: string; success: boolean }>('test/get');
      expect(result.method).toBe('GET');
      expect(result.success).toBe(true);
    });

    it('POST request with body succeeds', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const body = { name: 'test', value: 123 };
      const result = await http.post<{ method: string; body: unknown; success: boolean }>('test/post', body);
      expect(result.method).toBe('POST');
      expect(result.body).toEqual(body);
      expect(result.success).toBe(true);
    });

    it('PUT request with body succeeds', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const body = { id: '1', name: 'updated' };
      const result = await http.put<{ method: string; body: unknown; success: boolean }>('test/put', body);
      expect(result.method).toBe('PUT');
      expect(result.body).toEqual(body);
      expect(result.success).toBe(true);
    });

    it('PATCH request with body succeeds', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const body = { name: 'patched' };
      const result = await http.patch<{ method: string; body: unknown; success: boolean }>('test/patch', body);
      expect(result.method).toBe('PATCH');
      expect(result.body).toEqual(body);
      expect(result.success).toBe(true);
    });

    it('DELETE request succeeds', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const result = await http.delete<{ method: string; success: boolean }>('test/delete');
      expect(result.method).toBe('DELETE');
      expect(result.success).toBe(true);
    });

    it('POST request with undefined body does not include body', async () => {
      const customFetch = vi.fn(async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
        expect(init?.body).toBeUndefined();
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: customFetch,
      });

      await http.post('test/post', undefined);
      expect(customFetch).toHaveBeenCalled();
    });
  });

  describe('Headers', () => {
    it('includes default headers: Content-Type and apiKey', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'my-api-key',
        clientId: 'my-client-id',
        fetch: globalThis.fetch,
      });

      const result = await http.get<{ headers: Record<string, string> }>('test/check-headers');
      expect(result.headers['content-type']).toBe('application/json');
      expect(result.headers['x-api-key']).toBe('my-api-key');
    });

    it('allows overriding headers per request', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'my-api-key',
        clientId: 'my-client-id',
        fetch: globalThis.fetch,
      });

      const result = await http.get<{ headers: Record<string, string> }>('test/check-headers', {
        headers: {
          'X-Request-Specific': 'request-value',
        },
      });
      expect(result.headers['x-request-specific']).toBe('request-value');
    });
  });

  describe('Error handling', () => {
    it('throws error for 400 status', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      await expect(http.get('test/400')).rejects.toThrow('HTTP 400');
    });

    it('throws error for 404 status', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      await expect(http.get('test/404')).rejects.toThrow('HTTP 404');
    });

    it('throws error for 500 status', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      await expect(http.get('test/500')).rejects.toThrow('HTTP 500');
    });

    it('includes error message from response body', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      try {
        await http.get('test/400');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain('HTTP 400');
      }
    });
  });

  describe('Special responses', () => {
    it('handles 204 No Content response', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const result = await http.get('test/204');
      expect(result).toBeUndefined();
    });
  });

  describe('URL handling', () => {
    it('joins baseUrl and relative path correctly', async () => {
      const customFetch = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
        expect(input).toBe('http://localhost:3000/b2b/v1/test-client/test/get');
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: customFetch,
      });

      await http.get('test/get');
      expect(customFetch).toHaveBeenCalled();
    });

    it('handles baseUrl with trailing slash', async () => {
      const customFetch = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
        expect(input).toBe('http://localhost:3000/b2b/v1/test-client/test/get');
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000/',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: customFetch,
      });

      await http.get('test/get');
      expect(customFetch).toHaveBeenCalled();
    });

    it('handles path with leading slash', async () => {
      const customFetch = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
        expect(input).toBe('http://localhost:3000/b2b/v1/test-client/test/get');
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: customFetch,
      });

      await http.get('/test/get');
      expect(customFetch).toHaveBeenCalled();
    });

    it('preserves absolute URLs', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const result = await http.get<{ absolute: boolean }>('https://absolute-url.com/test');
      expect(result.absolute).toBe(true);
    });
  });

  describe('Fetch injection', () => {
    it('uses custom fetch implementation', async () => {
      const customFetch = vi.fn(async () => {
        return new Response(JSON.stringify({ custom: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: customFetch,
      });

      const result = await http.get<{ custom: boolean }>('test/get');
      expect(result.custom).toBe(true);
      expect(customFetch).toHaveBeenCalled();
    });

    it('throws error when no fetch implementation is available', () => {
      const originalFetch = globalThis.fetch;
      delete (globalThis as { fetch?: unknown }).fetch;

      expect(() => {
        createHttpClient({
          baseUrl: 'http://localhost:3000',
          apiKey: 'test-key',
          clientId: 'test-client',
        });
      }).toThrow('No fetch implementation found');

      globalThis.fetch = originalFetch;
    });
  });

  describe('Body serialization', () => {
    it('serializes body to JSON string', async () => {
      const customFetch = vi.fn(async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
        expect(init?.body).toBe(JSON.stringify({ test: 'value', number: 42 }));
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: customFetch,
      });

      const body = { test: 'value', number: 42 };
      await http.post('test/post', body);
      expect(customFetch).toHaveBeenCalled();
    });

    it('handles complex nested objects', async () => {
      const http = createHttpClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
        clientId: 'test-client',
        fetch: globalThis.fetch,
      });

      const body = {
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
      };
      const result = await http.post<{ body: unknown }>('test/post', body);
      expect(result.body).toEqual(body);
    });
  });
});

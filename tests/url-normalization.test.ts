import { describe, it, expect, vi } from 'vitest';
import { createHttpClient } from '@core/httpClient';

describe('URL normalization (joinUrl)', () => {
  it('normalizes with various path shapes and preserves absolute URLs', async () => {
    const fetchFn = vi.fn(
      async (_input: any) =>
        new globalThis.Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );

    const http = createHttpClient({
      baseUrl: 'https://api.example.com/',
      apiKey: 'xxxxx',
      clientId: 'my-client-id',
      fetch: fetchFn,
    });
    await http.get<{ ok: boolean }>('b2b/videos');
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.example.com/b2b/v1/my-client-id/b2b/videos');

    await http.get<{ ok: boolean }>('/b2b/videos');
    expect(fetchFn.mock.calls[1][0]).toBe('https://api.example.com/b2b/v1/my-client-id/b2b/videos');

    const http2 = createHttpClient({
      baseUrl: 'https://api.example.com',
      apiKey: 'xxxxx',
      clientId: 'my-client-id',
      fetch: fetchFn,
    });
    await http2.get<{ ok: boolean }>('/b2b/videos');
    expect(fetchFn.mock.calls[2][0]).toBe('https://api.example.com/b2b/v1/my-client-id/b2b/videos');

    await http2.get<{ ok: boolean }>('https://other.com/abs');
    expect(fetchFn.mock.calls[3][0]).toBe('https://other.com/abs');
  });
});

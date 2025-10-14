export type FetchLike = typeof globalThis.fetch;
type RequestOptions = Parameters<typeof globalThis.fetch>[1];
type FetchResponse = Awaited<ReturnType<FetchLike>>;

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  clientId: string;
  apiKeyHeaderName?: string;
  fetch?: FetchLike;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T>(_path: string, _init?: RequestOptions): Promise<T>;
  post<T>(_path: string, _body?: unknown, _init?: RequestOptions): Promise<T>;
  put<T>(_path: string, _body?: unknown, _init?: RequestOptions): Promise<T>;
  patch<T>(_path: string, _body?: unknown, _init?: RequestOptions): Promise<T>;
  delete<T>(_path: string, _init?: RequestOptions): Promise<T>;
}

async function parseJson<T>(res: FetchResponse): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export function createHttpClient(config: HttpClientConfig): HttpClient {
  const { baseUrl, apiKey, clientId, fetch: fetchImpl, headers, apiKeyHeaderName = 'x-api-key' } = config;

  const f: FetchLike | undefined = fetchImpl ?? (globalThis.fetch as FetchLike | undefined);
  if (!f) {
    throw new Error('No fetch implementation found. Provide one in SDKConfig.fetch for Node or custom environments.');
  }

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    [apiKeyHeaderName]: apiKey,
    'x-client-id': clientId,
    ...headers,
  };

  const fullUrl = (path: string) => (path.startsWith('http') ? path : `${baseUrl}/${path}`);

  const request = async <T>(method: string, path: string, init?: RequestOptions, body?: unknown) => {
    const reqInit: RequestOptions = {
      method,
      headers: {
        ...baseHeaders,
        ...(init?.headers as Record<string, string> | undefined),
      },
      ...init,
    };
    if (body !== undefined) reqInit.body = JSON.stringify(body);
    const res = await f(fullUrl(path), reqInit);
    return parseJson<T>(res);
  };

  return {
    get: <T>(path: string, init?: RequestOptions) => request<T>('GET', path, init),
    post: <T>(path: string, body?: unknown, init?: RequestOptions) => request<T>('POST', path, init, body),
    put: <T>(path: string, body?: unknown, init?: RequestOptions) => request<T>('PUT', path, init, body),
    patch: <T>(path: string, body?: unknown, init?: RequestOptions) => request<T>('PATCH', path, init, body),
    delete: <T>(path: string, init?: RequestOptions) => request<T>('DELETE', path, init),
  };
}

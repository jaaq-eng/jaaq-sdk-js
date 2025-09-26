export type FetchLike = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

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
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  delete<T>(path: string, init?: RequestInit): Promise<T>;
}

function withTimeout<T>(promise: Promise<T>, ms?: number): Promise<T> {
  if (!ms) return promise;
  return new Promise((resolve, reject) => {
    const id = setTimeout(
      () => reject(new Error(`Request timed out after ${ms}ms`)),
      ms
    );
    promise.then(
      (res) => {
        clearTimeout(id);
        resolve(res);
      },
      (err) => {
        clearTimeout(id);
        reject(err);
      }
    );
  });
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export function createHttpClient(cfg: HttpClientConfig): HttpClient {
  const {
    baseUrl,
    apiKey,
    clientId,
    fetch: fetchImpl,
    timeoutMs,
    headers,
    apiKeyHeaderName = "x-api-key",
  } = cfg;

  const f: FetchLike | undefined =
    fetchImpl ?? (globalThis.fetch as FetchLike | undefined);
  if (!f) {
    throw new Error(
      "No fetch implementation found. Provide one in SDKConfig.fetch for Node or custom environments."
    );
  }

  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    [apiKeyHeaderName]: apiKey,
    "x-client-id": clientId,
    ...headers,
  };

  const fullUrl = (path: string) =>
    path.startsWith("http")
      ? path
      : `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const request = <T>(
    method: string,
    path: string,
    init?: RequestInit,
    body?: unknown
  ) => {
    const reqInit: RequestInit = {
      method,
      headers: {
        ...baseHeaders,
        ...(init?.headers as Record<string, string> | undefined),
      },
      ...init,
    };
    if (body !== undefined) reqInit.body = JSON.stringify(body);

    return withTimeout(
      f(fullUrl(path), reqInit).then((r) => parseJson<T>(r)),
      timeoutMs
    );
  };

  return {
    get: <T>(path: string, init?: RequestInit) => request<T>("GET", path, init),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("POST", path, init, body),
    put: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("PUT", path, init, body),
    patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("PATCH", path, init, body),
    delete: <T>(path: string, init?: RequestInit) =>
      request<T>("DELETE", path, init),
  };
}

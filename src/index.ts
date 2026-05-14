import { createHttpClient, type HttpClient, type FetchLike } from '@core/httpClient';
import {
  createCollectionsResource,
  createCollectionsResourceV2,
  createVideosResource,
  createVideosResourceV2,
  type VideosResource,
  type VideosResourceV2,
  type CollectionsResource,
  type CollectionsResourceV2,
} from '@src/resources';

// Public type exports for consumers (barrel)
export * from '@src/types';

export const BASE_URL = process.env.JAAQ_API_URL || 'https://api.jaaq.app';

export interface SDKConfig {
  baseUrl?: string; // Pending to approve
  apiVersion?: string; // Optional API version override (defaults to 'v1')
  apiKey: string; // Provided by backend per client
  clientId: string; // Provided by each consuming company at init
  fetch?: FetchLike; // Optional fetch injection (Node/custom envs) // Pending to approve
  timeoutMs?: number;
}

export type V1 = {
  videos: VideosResource;
  collections: CollectionsResource;
};

export type V2 = {
  videos: VideosResourceV2;
  collections: CollectionsResourceV2;
};

export type ClientVersion = V1 | V2;

export class JaaqClient<T extends ClientVersion = V1> {
  public readonly videos: T['videos'];
  public readonly collections: T['collections'];

  // Keep constructor private to enforce controlled instantiation.
  private constructor(http: HttpClient, apiVersion: string) {
    if (apiVersion === 'v2') {
      this.videos = createVideosResourceV2(http);
      this.collections = createCollectionsResourceV2(http);
    } else {
      this.videos = createVideosResource(http);
      this.collections = createCollectionsResource(http);
    }
  }

  /**
   * Public "friend" constructor that remains inside the class boundary.
   * This method is callable from the module-level build function
   * without exposing `new JaaqClient(...)` to consumers.
   */
  static fromHttp<T extends ClientVersion = V1>(http: HttpClient, apiVersion: string): JaaqClient<T> {
    return new JaaqClient(http, apiVersion);
  }

  /**
   * OO-friendly static initializer.
   * Delegates to the single source of truth: `buildClient`.
   */
  static init<T extends ClientVersion = V1>(config: SDKConfig): JaaqClient<T> {
    return buildClient(config);
  }
}

/**
 * Canonical factory (idiomatic for JS/TS).
 * Delegates to the single source of truth: `buildClient`.
 */
export function createJaaqClient<T extends ClientVersion = V1>(config: SDKConfig): JaaqClient<T> {
  return buildClient(config);
}

export function createJaaqClientV1(config: SDKConfig): JaaqClient<V1> {
  return createJaaqClient({ ...config, apiVersion: 'v1' });
}

export function createJaaqClientV2(config: SDKConfig): JaaqClient<V2> {
  return createJaaqClient({ ...config, apiVersion: 'v2' });
}

/**
 * Single source of truth for constructing the client.
 * Both `createJaaqClient` and `JaaqClient.init` call this function.
 * The constructor stays private; instantiation is funneled via `JaaqClient.fromHttp`.
 */
function buildClient<T extends ClientVersion = V1>(config: SDKConfig): JaaqClient<T> {
  const { baseUrl = BASE_URL, apiKey, clientId, fetch: fetchImpl, apiVersion = 'v1' } = config;

  const http = createHttpClient({
    baseUrl,
    apiKey,
    clientId,
    fetch: fetchImpl ?? (globalThis.fetch as FetchLike | undefined),
    apiVersion,
  });

  return JaaqClient.fromHttp(http, apiVersion);
}

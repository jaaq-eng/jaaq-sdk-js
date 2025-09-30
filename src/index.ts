// src/index.ts

import {
  createHttpClient,
  type HttpClient,
  type FetchLike,
} from "@core/httpClient";
import { createVideosResource, type VideosResource } from "@resources/videos";

export const BASE_URL = process.env.JAAQ_API_URL ?? "https://api.jaaq.app/v1";
export interface SDKConfig {
  baseUrl?: string; // Pending to approve
  apiKey: string; // Provided by backend per client
  clientId: string; // Provided by each consuming company at init
  fetch?: FetchLike; // Optional fetch injection (Node/custom envs) // Pending to approve
  timeoutMs?: number;
  headers?: Record<string, string>; // Pending to approve
  apiKeyHeaderName?: string;
}

export class JaaqClient {
  public readonly videos: VideosResource;

  // Keep constructor private to enforce controlled instantiation.
  private constructor(private readonly http: HttpClient) {
    this.videos = createVideosResource(http);
  }

  /**
   * Public "friend" constructor that remains inside the class boundary.
   * This method is callable from the module-level build function
   * without exposing `new JaaqClient(...)` to consumers.
   */
  static fromHttp(http: HttpClient): JaaqClient {
    return new JaaqClient(http);
  }

  /**
   * OO-friendly static initializer.
   * Delegates to the single source of truth: `buildClient`.
   */
  static init(config: SDKConfig): JaaqClient {
    return buildClient(config);
  }
}

/**
 * Canonical factory (idiomatic for JS/TS).
 * Delegates to the single source of truth: `buildClient`.
 */
export function createJaaqClient(config: SDKConfig): JaaqClient {
  return buildClient(config);
}

/**
 * Single source of truth for constructing the client.
 * Both `createJaaqClient` and `JaaqClient.init` call this function.
 * The constructor stays private; instantiation is funneled via `JaaqClient.fromHttp`.
 */
function buildClient(config: SDKConfig): JaaqClient {
  const {
    baseUrl = BASE_URL,
    apiKey,
    clientId,
    fetch: fetchImpl,
    timeoutMs,
    headers,
    apiKeyHeaderName = "x-api-key",
  } = config;

  const http = createHttpClient({
    baseUrl,
    apiKey,
    clientId,
    apiKeyHeaderName,
    fetch: fetchImpl ?? (globalThis.fetch as FetchLike | undefined),
    timeoutMs,
    headers,
  });

  return JaaqClient.fromHttp(http);
}

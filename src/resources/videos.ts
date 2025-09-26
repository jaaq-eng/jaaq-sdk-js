import type { HttpClient } from "@core/httpClient";
import type { paths, components } from "@gen/openapi";

// Prefer stable schema alias:
type GetVideosResponse = components["schemas"]["GetVideosResponse"];
// Infer query params directly from path:
type GetVideosParams =
  | paths["/videos"]["get"]["parameters"]["query"]
  | undefined;

export interface VideosResource {
  getVideos(params?: GetVideosParams): Promise<GetVideosResponse>;
}

function toQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function createVideosResource(http: HttpClient): VideosResource {
  return {
    async getVideos(params) {
      const path = `/videos${toQueryString(
        params as Record<string, unknown> | undefined
      )}`;
      return http.get<GetVideosResponse>(path);
    },
  };
}

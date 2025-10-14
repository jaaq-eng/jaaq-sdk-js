import type { HttpClient } from '@core/httpClient';
import type { Video } from '@src/types/videos';

export interface VideosResource {
  getById(_id: string): Promise<Video>;
}

export function createVideosResource(http: HttpClient): VideosResource {
  return {
    async getById(id: string) {
      const path = `b2b/videos/${encodeURIComponent(id)}`;
      return http.get<Video>(path);
    },
  };
}

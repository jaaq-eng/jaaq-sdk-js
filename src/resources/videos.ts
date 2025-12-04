import type { HttpClient } from '@core/httpClient';
import type { VideoDTO } from '@src/types/videos';

export type VideosResource = {
  getById(_id: string): Promise<VideoDTO>;
};

export function createVideosResource(http: HttpClient): VideosResource {
  return {
    async getById(id: string) {
      const path = `/videos/${encodeURIComponent(id)}`;
      const response = await http.get<{ video: VideoDTO }>(path);
      return response.video;
    },
  };
}

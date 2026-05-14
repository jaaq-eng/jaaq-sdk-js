import type { HttpClient } from '@core/httpClient';
import type { VideoV2DTO } from '@src/types';

export type VideosResourceV2 = {
  getById(_id: string): Promise<VideoV2DTO>;
};

export function createVideosResourceV2(http: HttpClient): VideosResourceV2 {
  return {
    async getById(id: string) {
      const path = `/videos/${encodeURIComponent(id)}`;
      const response = await http.get<{ video: VideoV2DTO }>(path);
      return response.video;
    },
  };
}

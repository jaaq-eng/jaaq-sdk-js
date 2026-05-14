import type { VideoV2DTO } from './videos';

type VideoGroupV2DTO = {
  id: string;
  title: string;
  videos: VideoV2DTO[];
};

export type { VideoGroupV2DTO };

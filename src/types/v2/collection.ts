import type { VideoGroupV2DTO } from './videoGroup';

type CollectionV2DTO = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  idleVideo: {
    id: string;
    duration: number;
    videoUrl: string;
    isCroppable: boolean;
  } | null;
  videoGroups: VideoGroupV2DTO[];
};

export type { CollectionV2DTO };

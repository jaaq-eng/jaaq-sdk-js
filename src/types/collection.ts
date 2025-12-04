import type { VideoDTO } from '@src/types/videos';

type CollectionDTO = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  videos: VideoDTO[];
};

export type { CollectionDTO };

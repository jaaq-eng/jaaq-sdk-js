import type { VideoDTO } from './videos';

type CollectionDTO = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  videos: VideoDTO[];
};

export type { CollectionDTO };

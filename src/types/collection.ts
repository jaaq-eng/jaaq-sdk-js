import type { Video } from '@src/types/videos';

type Collection = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  videos: Video[];
};

export type { Collection };

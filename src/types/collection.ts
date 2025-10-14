import type { Video } from '@src/types/videos';

interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  videos: Video[];
}

export type { Collection };

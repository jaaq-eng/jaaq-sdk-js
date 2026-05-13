import { VideoGroupV2DTO } from './videoGroup';

type CollectionV2DTO = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  videoGroups: VideoGroupV2DTO[];
};

export type { CollectionV2DTO };

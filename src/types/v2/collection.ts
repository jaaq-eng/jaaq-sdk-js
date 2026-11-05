import type { VideoGroupV2DTO } from './videoGroup';

type CollectionV2DTO = {
  id: string;
  name: string;
  description: string;
  // Only returned by getById: the series linked from the website given by its `subdomain` option
  series?: string[];
  imageUrl: string;
  idleVideo: {
    id: string;
    duration: number;
    videoUrl: string;
    isCroppable: boolean;
  } | null;
  videoGroups: VideoGroupV2DTO[];
};

type GetCollectionByIdV2Options = {
  // Subdomain of the JAAQ website showing the collection, e.g. "natwest" for natwest.jaaq.org
  subdomain?: string;
};

export type { CollectionV2DTO, GetCollectionByIdV2Options };

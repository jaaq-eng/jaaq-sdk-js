import { CreatorV2DTO } from './creator';

type VideoV2DTO = {
  id: string;
  videoId: string;
  question: string;
  transcription: string;
  subtitle: string;
  videoUrl: string;
  tags: string[];
  severity: number | null;
  duration: number;
  description: string;
  creator?: CreatorV2DTO;
};

export type { VideoV2DTO };

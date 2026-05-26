import type { CreatorV2DTO } from './creator';
import type { CtaV2DTO } from './cta';
import type { SubtitleV2DTO } from './subtitle';

type VideoV2DTO = {
  id: string;
  videoId: string;
  question: string;
  transcription: string;
  subtitles: SubtitleV2DTO[];
  videoUrl: string;
  tags: string[];
  severity: number | null;
  cta: CtaV2DTO | null;
  duration: number;
  description: string;
  creator?: CreatorV2DTO;
};

export type { VideoV2DTO };

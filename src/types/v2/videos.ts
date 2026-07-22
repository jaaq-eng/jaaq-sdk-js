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
  isCroppable: boolean | null;
  duration: number;
  description: string;
  creator?: CreatorV2DTO;
  cta?: CtaV2DTO;
  allowFeedbackWidget?: boolean;
};

export type { VideoV2DTO };

import type { CreatorV2DTO } from './creator';

type CtaDTO = {
  url?: string;
  label?: string;
  labelColor?: string;
};

type VideoV2DTO = {
  id: string;
  videoId: string;
  question: string;
  transcription: string;
  subtitle: string;
  videoUrl: string;
  tags: string[];
  severity: number | null;
  cta: CtaDTO | null;
  duration: number;
  description: string;
  creator?: CreatorV2DTO;
};

export type { VideoV2DTO };

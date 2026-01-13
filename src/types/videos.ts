type VideoDTO = {
  id: string;
  videoId: string;
  question: string;
  status: number;
  transcription: string;
  subtitle: string;
  createdAt: string;
  videoUrl: string;
  published: boolean;
  tags: string[];
  severity: number | null;
  duration: number;
  description: string;
  creator?: string;
  creatorImage?: string;
  creatorBiography?: string;
};

export type { VideoDTO };

interface Video {
  id: string;
  videoId: string;
  questionId: string;
  question: string;
  status: number | null;
  transcription: string | null;
  createdAt: string;
  modifiedAt: string;
  videoUrl: string;
  published: boolean;
  tags: string[];
  severity: number | null;
  duration: number;
  subTopics: string[];
  description: string;
}

export type { Video };

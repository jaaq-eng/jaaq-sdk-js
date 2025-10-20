type ISODateTimeString = string;

interface ApiError {
  description: string;
  error: string;
}

export type { ISODateTimeString, ApiError };

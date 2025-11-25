import { createJaaqClient } from '@jaaq/jaaq-sdk-js';

const API_KEY = import.meta.env.VITE_JAAQ_API_KEY;
const CLIENT_ID = import.meta.env.VITE_JAAQ_CLIENT_ID;
const API_URL = import.meta.env.VITE_JAAQ_API_URL;

if (!API_KEY || !CLIENT_ID) {
  throw new Error('Missing JAAQ credentials. Please set VITE_JAAQ_API_KEY and VITE_JAAQ_CLIENT_ID in .env file');
}

export const jaaqClient = createJaaqClient({
  apiKey: API_KEY,
  clientId: CLIENT_ID,
  ...(API_URL && { baseUrl: API_URL }),
});

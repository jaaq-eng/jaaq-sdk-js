import { setupServer } from 'msw/node';
import { videosHandlers } from '@tests/handlers/videos';
import { collectionsHandlers } from '@tests/handlers/collections';
import { httpClientHandlers } from '@tests/handlers/httpClient';

export const server = setupServer(...videosHandlers, ...collectionsHandlers, ...httpClientHandlers);

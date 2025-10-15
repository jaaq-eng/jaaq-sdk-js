import { setupServer } from 'msw/node';
import { videosHandlers } from '@tests/handlers/videos';
import { collectionsHandlers } from '@tests/handlers/collections';

export const server = setupServer(...videosHandlers, ...collectionsHandlers);

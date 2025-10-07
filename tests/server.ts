import { setupServer } from 'msw/node';
import { videosHandlers } from '@tests/handlers/videos';

export const server = setupServer(...videosHandlers);

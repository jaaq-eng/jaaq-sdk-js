import { http, HttpResponse } from 'msw';
import videoResp from '@tests/mocks/video.json';

export const videosHandlers = [
  http.get('http://localhost:3000/b2b/v1/:clientId/videos/', () => {
    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),
  http.get('http://localhost:3000/b2b/v1/:clientId/videos/:id', ({ params }) => {
    const { id } = params as { id: string };

    if (!id || id === '') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    let decodedId: string;
    try {
      decodedId = decodeURIComponent(id);
    } catch {
      decodedId = id;
    }

    if (decodedId === 'server-error' || id === 'server-error') {
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    if (decodedId === videoResp.video.id || id === videoResp.video.id) {
      return HttpResponse.json({ video: videoResp.video }, { status: 200 });
    }

    if (decodedId === 'special-chars-video-id' || id === 'special-chars-video-id') {
      return HttpResponse.json({ video: { ...videoResp.video, id: 'special-chars-video-id' } }, { status: 200 });
    }

    if (id === 'special%20chars%20video%20id') {
      return HttpResponse.json({ video: { ...videoResp.video, id: 'special%20chars%20video%20id' } }, { status: 200 });
    }

    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),
];

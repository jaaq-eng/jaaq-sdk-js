import { http, HttpResponse } from 'msw';
import videoResp from '@tests/mocks/video.json';
import videoV2Resp from '@tests/mocks/video-v2.json';

export const videosHandlers = [
  http.get('http://localhost:3000/b2b/:version/subscription/:clientId/videos/', () => {
    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),
  http.get('http://localhost:3000/b2b/:version/subscription/:clientId/videos/:id', ({ params }) => {
    const { id, version } = params as { id: string; version: string };

    if (!id || id === '') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    const data = version === 'v2' ? videoV2Resp : videoResp;

    let decodedId: string;
    try {
      decodedId = decodeURIComponent(id);
    } catch {
      decodedId = id;
    }

    if (decodedId === 'server-error' || id === 'server-error') {
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    if (decodedId === data.video.id || id === data.video.id) {
      return HttpResponse.json({ video: data.video }, { status: 200 });
    }

    if (decodedId === 'special-chars-video-id' || id === 'special-chars-video-id') {
      return HttpResponse.json({ video: { ...data.video, id: 'special-chars-video-id' } }, { status: 200 });
    }

    if (id === 'special%20chars%20video%20id') {
      return HttpResponse.json({ video: { ...data.video, id: 'special%20chars%20video%20id' } }, { status: 200 });
    }

    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),
];

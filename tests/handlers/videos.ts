import { http, HttpResponse } from 'msw';
import videoResp from '@tests/mocks/video.json';

export const videosHandlers = [
  http.get('http://localhost:3000/b2b/videos/:id', ({ params }) => {
    const { id } = params as { id: string };
    if (id === videoResp.video.id) {
      return HttpResponse.json(videoResp.video, { status: 200 });
    }
    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),
];

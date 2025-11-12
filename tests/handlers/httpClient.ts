import { http, HttpResponse } from 'msw';

export const httpClientHandlers = [
  http.get('http://localhost:3000/test/get', () => {
    return HttpResponse.json({ method: 'GET', success: true }, { status: 200 });
  }),

  http.post('http://localhost:3000/test/post', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ method: 'POST', body, success: true }, { status: 200 });
  }),

  http.put('http://localhost:3000/test/put', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ method: 'PUT', body, success: true }, { status: 200 });
  }),

  http.patch('http://localhost:3000/test/patch', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ method: 'PATCH', body, success: true }, { status: 200 });
  }),

  http.delete('http://localhost:3000/test/delete', () => {
    return HttpResponse.json({ method: 'DELETE', success: true }, { status: 200 });
  }),

  http.get('http://localhost:3000/test/204', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('http://localhost:3000/test/400', () => {
    return HttpResponse.json({ error: 'Bad Request' }, { status: 400 });
  }),

  http.get('http://localhost:3000/test/404', () => {
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
  }),

  http.get('http://localhost:3000/test/500', () => {
    return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }),

  http.get('http://localhost:3000/test/empty-body', () => {
    return new HttpResponse('', { status: 200, headers: { 'Content-Type': 'application/json' } });
  }),

  http.get('http://localhost:3000/test/invalid-json', () => {
    return new HttpResponse('not json', { status: 200, headers: { 'Content-Type': 'application/json' } });
  }),

  http.get('http://localhost:3000/test/check-headers', async ({ request }) => {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    return HttpResponse.json({ headers }, { status: 200 });
  }),

  http.post('http://localhost:3000/test/check-headers', async ({ request }) => {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    return HttpResponse.json({ headers }, { status: 200 });
  }),

  http.get('https://absolute-url.com/test', () => {
    return HttpResponse.json({ absolute: true }, { status: 200 });
  }),
];

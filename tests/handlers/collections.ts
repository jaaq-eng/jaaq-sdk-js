import { http, HttpResponse } from 'msw';
import collections from '@tests/mocks/collections.json';
import collection from '@tests/mocks/collection.json';

export const collectionsHandlers = [
  http.get('http://localhost:3000/b2b/v1/:clientId/collections', ({ request }) => {
    const url = new URL(request.url);
    if (url.pathname.endsWith('/') && !url.pathname.endsWith('/collections')) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return HttpResponse.json(collections, { status: 200 });
  }),
  http.get('http://localhost:3000/b2b/v1/:clientId/collections/:id', ({ params }) => {
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

    if (decodedId === collection.collection.id || id === collection.collection.id) {
      return HttpResponse.json({ collection: collection.collection }, { status: 200 });
    }

    if (decodedId === 'special-chars-collection-id' || id === 'special-chars-collection-id') {
      return HttpResponse.json({ collection: { ...collection.collection, id: 'special-chars-collection-id' } }, { status: 200 });
    }

    if (id === 'special%20chars%20collection%20id') {
      return HttpResponse.json({ collection: { ...collection.collection, id: 'special%20chars%20collection%20id' } }, { status: 200 });
    }

    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),
];

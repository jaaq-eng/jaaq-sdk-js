import { http, HttpResponse } from 'msw';
import collections from '@tests/mocks/collections.json';
import collectionsV2 from '@tests/mocks/collections-v2.json';
import collection from '@tests/mocks/collection.json';
import collectionV2 from '@tests/mocks/collection-v2.json';

export const collectionsHandlers = [
  http.get('http://localhost:3000/b2b/:version/subscription/:clientId/collections', ({ request, params }) => {
    const { version } = params as { version: string };

    const url = new URL(request.url);
    if (url.pathname.endsWith('/') && !url.pathname.endsWith('/collections')) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    const collectionsData = version === 'v2' ? collectionsV2 : collections;

    return HttpResponse.json(collectionsData, { status: 200 });
  }),
  http.get('http://localhost:3000/b2b/:version/subscription/:clientId/collections/:id', ({ params }) => {
    const { id, version } = params as { id: string; version: string };

    if (!id || id === '') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    const collectionData = version === 'v2' ? collectionV2 : collection;

    let decodedId: string;
    try {
      decodedId = decodeURIComponent(id);
    } catch {
      decodedId = id;
    }

    if (decodedId === 'server-error' || id === 'server-error') {
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    if (decodedId === collectionData.collection.id || id === collectionData.collection.id) {
      return HttpResponse.json({ collection: collectionData.collection }, { status: 200 });
    }

    if (decodedId === 'special-chars-collection-id' || id === 'special-chars-collection-id') {
      return HttpResponse.json({ collection: { ...collectionData.collection, id: 'special-chars-collection-id' } }, { status: 200 });
    }

    if (id === 'special%20chars%20collection%20id') {
      return HttpResponse.json({ collection: { ...collectionData.collection, id: 'special%20chars%20collection%20id' } }, { status: 200 });
    }

    return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
  }),
];

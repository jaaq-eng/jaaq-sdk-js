import { http, HttpResponse } from "msw";
import collections from "@tests/mocks/collections.json";
import collection from "@tests/mocks/collection.json";

export const collectionsHandlers = [
  http.get("http://localhost:3000/b2b/collections", () => {
    return HttpResponse.json(collections.collections, { status: 200 });
  }),
  http.get("http://localhost:3000/b2b/collections/:id", ({ params }) => {
    const { id } = params as { id: string };
    if (id === collection.collection.id) {
      return HttpResponse.json(collection.collection, { status: 200 });
    }
    return HttpResponse.json({ message: "Not Found" }, { status: 404 });
  }),
];

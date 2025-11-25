import type { HttpClient } from '@core/httpClient';
import type { Collection } from '@src/types/collection';

export interface CollectionsResource {
  list(): Promise<Collection[]>;
  getById(_id: string): Promise<Collection>;
}

export function createCollectionsResource(http: HttpClient): CollectionsResource {
  return {
    async list() {
      const path = 'b2b/collections';
      const response = await http.get<{ collections: Collection[] }>(path);
      return response.collections;
    },
    async getById(id: string) {
      const path = `b2b/collections/${encodeURIComponent(id)}`;
      const response = await http.get<{ collection: Collection }>(path);
      return response.collection;
    },
  };
}

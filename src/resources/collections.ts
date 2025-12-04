import type { HttpClient } from '@core/httpClient';
import type { CollectionDTO } from '@src/types/collection';

export type CollectionsResource = {
  list(): Promise<CollectionDTO[]>;
  getById(_id: string): Promise<CollectionDTO>;
};

export function createCollectionsResource(http: HttpClient): CollectionsResource {
  return {
    async list() {
      const path = '/collections';
      const response = await http.get<{ collections: CollectionDTO[] }>(path);
      return response.collections;
    },
    async getById(id: string) {
      const path = `/collections/${encodeURIComponent(id)}`;
      const response = await http.get<{ collection: CollectionDTO }>(path);
      return response.collection;
    },
  };
}

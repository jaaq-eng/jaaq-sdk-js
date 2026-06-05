import type { HttpClient } from '@core/httpClient';
import type { CollectionV2DTO } from '@src/types';

export type CollectionsResourceV2 = {
  list(): Promise<CollectionV2DTO[]>;
  getById(_id: string): Promise<CollectionV2DTO>;
};

export function createCollectionsResourceV2(http: HttpClient): CollectionsResourceV2 {
  return {
    async list() {
      const path = '/collections';
      const response = await http.get<{ collections: CollectionV2DTO[] }>(path);
      return response.collections;
    },
    async getById(id: string) {
      const path = `/collections/${encodeURIComponent(id)}`;
      const response = await http.get<{ collection: CollectionV2DTO }>(path);
      return response.collection;
    },
  };
}

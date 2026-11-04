import type { HttpClient } from '@core/httpClient';
import type { CollectionV2DTO, GetCollectionByIdV2Options } from '@src/types';

export type CollectionsResourceV2 = {
  list(): Promise<CollectionV2DTO[]>;
  getById(_id: string, _options?: GetCollectionByIdV2Options): Promise<CollectionV2DTO>;
};

export function createCollectionsResourceV2(http: HttpClient): CollectionsResourceV2 {
  return {
    async list() {
      const path = '/collections';
      const response = await http.get<{ collections: CollectionV2DTO[] }>(path);
      return response.collections;
    },
    async getById(id: string, options?: GetCollectionByIdV2Options) {
      const query = options?.subdomain !== undefined ? `?subdomain=${encodeURIComponent(options.subdomain)}` : '';
      const path = `/collections/${encodeURIComponent(id)}${query}`;
      const response = await http.get<{ collection: CollectionV2DTO }>(path);
      return response.collection;
    },
  };
}

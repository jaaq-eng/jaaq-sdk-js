import type { HttpClient } from '@core/httpClient';
import type { CollectionSummaryV2DTO, CollectionV2DTO, GetCollectionByIdV2Options } from '@src/types';

export type CollectionsResourceV2 = {
  list(): Promise<CollectionV2DTO[]>;
  getById(_id: string, _options?: GetCollectionByIdV2Options): Promise<CollectionV2DTO>;
  getSummaryById(_id: string, _options?: GetCollectionByIdV2Options): Promise<CollectionSummaryV2DTO>;
};

const subdomainQuery = (options?: GetCollectionByIdV2Options) =>
  options?.subdomain !== undefined ? `?subdomain=${encodeURIComponent(options.subdomain)}` : '';

export function createCollectionsResourceV2(http: HttpClient): CollectionsResourceV2 {
  return {
    async list() {
      const path = '/collections';
      const response = await http.get<{ collections: CollectionV2DTO[] }>(path);
      return response.collections;
    },
    async getById(id: string, options?: GetCollectionByIdV2Options) {
      const path = `/collections/${encodeURIComponent(id)}${subdomainQuery(options)}`;
      const response = await http.get<{ collection: CollectionV2DTO }>(path);
      return response.collection;
    },
    async getSummaryById(id: string, options?: GetCollectionByIdV2Options) {
      const path = `/collections/${encodeURIComponent(id)}/summary${subdomainQuery(options)}`;
      const response = await http.get<{ collection: CollectionSummaryV2DTO }>(path);
      return response.collection;
    },
  };
}

import type { HttpClient } from "@core/httpClient";
import type { Collection } from "@src/types/collection";

export interface CollectionsResource {
  list(): Promise<Collection[]>;
  getById(id: string): Promise<Collection>;
}

export function createCollectionsResource(
  http: HttpClient
): CollectionsResource {
  return {
    async list() {
      const path = "/b2b/collections";
      return http.get<Collection[]>(path);
    },
    async getById(id: string) {
      const path = `/b2b/collections/${encodeURIComponent(id)}`;
      return http.get<Collection>(path);
    },
  };
}

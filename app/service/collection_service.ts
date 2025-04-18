import type { CollectionNameServerResponse } from "app/types/server";

export class CollectionService {
  static async getCollectionName(id: string) {
    const response = await fetch(`/api/collection/${encodeURIComponent(id)}`);

    const result = (await response.json()) as CollectionNameServerResponse;

    return result.data;
  }
}

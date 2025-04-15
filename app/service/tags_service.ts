import type { ServerTagResponse } from "app/types/server";

export class TagsService {
  static async fetchPaginated(startCursor: string = "") {
    const result = await fetch(`/api/tags?startCursor=${startCursor}`);

    const data = (await result.json()) as ServerTagResponse;

    return data;
  }

  static async createTag(name: string) {
    const form = new FormData();
    form.append("name", name);

    const result = await fetch("/api/tags", {
      method: "POST",
      body: form,
    });

    const data = await result.json();

    return data;
  }
}

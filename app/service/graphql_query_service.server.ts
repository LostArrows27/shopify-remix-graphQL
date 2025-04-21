import type { AdminApiContextWithoutRest } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/admin/types";

export class GraphQlQueryService {
  static async queryProductWithCollectionAndTag(
    admin: AdminApiContextWithoutRest,
    startCursor: string | null,
  ) {
    const response = await admin.graphql(
      `#graphql
                    query {
                        products(first: 20 ${startCursor != "cursor" ? `, after: "${startCursor}"` : ""}) {
                            nodes {
                                id
                                title
                                variants(first: 10) {
                                    nodes {
                                        id
                                        title
                                        price
                                    }
                                }
                                collections(first: 20) {
                                  nodes {
                                      id
                                      title
                                  }
                                }
                                tags
                            }
                            pageInfo {
                                endCursor
                                hasNextPage
                                hasPreviousPage
                            }
                        }
                    }
                `,
    );

    return response;
  }

  static async queryCollectionName(
    admin: AdminApiContextWithoutRest,
    collectionId: string,
  ) {
    const response = await admin.graphql(
      `#graphql
            query {
                collection (id: "${collectionId}") {
                    title
                }
            }
        `,
    );

    return response;
  }

  static async queryProductWithMedia(
    admin: AdminApiContextWithoutRest,
    startCursor: string | null,
  ) {
    const response = await admin.graphql(
      `#graphql
            query {
                products(first: 7 ${startCursor != "cursor" ? `, after: "${startCursor}"` : ""}) {
                    nodes {
                        id
                        title
                        variants(first: 10) {
                            nodes {
                                id
                                title
                                price
                            }
                        }
                        media(first: 1) {
                            nodes {
                                preview {
                                    image {
                                        url
                                    }
                                }
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                }
            }
        `,
    );

    return response;
  }

  static async queryCollectionWithMedia(
    admin: AdminApiContextWithoutRest,
    collectionId: string,
    startCursor: string | null,
  ) {
    const response = await admin.graphql(
      `#graphql
            {
                collection(id: "${collectionId}") {
                    products(first: 7 ${startCursor != "cursor" ? `, after: "${startCursor}"` : ""}) {
                    nodes {
                        id
                        title
                        variants(first: 10) {
                            nodes {
                                id
                                title
                                price
                            }
                        }
                        media(first: 1) {
                            nodes {
                                preview {
                                    image {
                                        url
                                    }
                                }
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                    }
                }
            }
        `,
    );

    return response;
  }

  static async queryProductByIds(
    admin: AdminApiContextWithoutRest,
    selectedIds: string[],
  ) {
    const idsForQuery = selectedIds.map((id: string) => `"${id}"`).join(", ");
    const response = await admin.graphql(
      `#graphql
        query GetProductsByIds {
          nodes(ids: [${idsForQuery}]) {
            id
            ... on Product {
              title
              variants(first: 10) {
                nodes {
                  title
                  price
                }
              }
              media(first: 1) {
                nodes {
                  preview {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
    );

    return response;
  }

  static async queryProductByTags(
    admin: AdminApiContextWithoutRest,
    tags: string[],
    startCursor: string | null,
  ) {
    // format: "tag:Test9 AND tag:Test1"
    const tagsForQuery = tags.reduce((acc, tag, index) => {
      return index === 0 ? `tag:${tag}` : `${acc} OR tag:${tag}`;
    }, "");

    const response = await admin.graphql(
      `#graphql
          query {
                products(query: "${tagsForQuery}", first: 7 ${startCursor != "cursor" ? `, after: "${startCursor}"` : ""}) {
                    nodes {
                        id
                        title
                        variants(first: 10) {
                            nodes {
                                id
                                title
                                price
                            }
                        }
                        media(first: 1) {
                            nodes {
                                preview {
                                    image {
                                        url
                                    }
                                }
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                }
          }
      `,
    );

    return response;
  }

  static async queryProductTags(
    admin: AdminApiContextWithoutRest,
    startCursor: string | null,
  ) {
    const response = await admin.graphql(
      `#graphql
        query {
          productTags(first: 10 ${startCursor != "cursor" ? `, after: "${startCursor}"` : ""}) {
              nodes,
              pageInfo {
                endCursor,
                hasNextPage,
              }
          }
        }
    `,
    );

    return response;
  }
}

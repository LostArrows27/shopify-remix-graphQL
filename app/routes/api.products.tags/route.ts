import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { authenticate } from "app/shopify.server";
import type { ProductResponseData, ShopifyPageInfo } from "app/types/server";
import { serverResponseWithProductPagination } from "app/utils/map_product_response";

/**
 * @description get all product by tag with pagination
 * @method GET
 * @route /api/products/tags?startCursor={startCursor}&tags={tags}
 * @param {number} startCursor - graphql cursor for pagination
 * @param {string} tags - comma separated tags. Example: "tag1,tag2"
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const startCursor = url.searchParams.get("startCursor") || null;
    const tagString = url.searchParams.get("tags") || null;

    if (!tagString || !startCursor) {
      throw new Error("Missing required parameters");
    }

    const tags = JSON.parse(decodeURIComponent(tagString)) as string[];

    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error("Invalid tags format. Expected an array of strings.");
    }

    // format: "tag:Test9 AND tag:Test1"
    const tagsForQuery = tags.reduce((acc, tag, index) => {
      return index === 0 ? `tag:${tag}` : `${acc} OR tag:${tag}`;
    }, "");

    const { admin } = await authenticate.admin(request);

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

    const result = (await response.json()).data;

    return serverResponseWithProductPagination({
      pageInfo: result.products.pageInfo as ShopifyPageInfo,
      products: result.products as ProductResponseData,
      message: "Products with tags fetched successfully",
    });
  } catch (error) {
    console.log("Error loader products tags: ", error);
    return ServerResponse.error({
      data: {
        products: [],
      },
      message: "Error loading products by tags",
    });
  }
};

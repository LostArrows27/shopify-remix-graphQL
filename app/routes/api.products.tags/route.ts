import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { GraphQlQueryService } from "app/service/graphql_query_service.server";
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

    const { admin } = await authenticate.admin(request);

    const response = await GraphQlQueryService.queryProductByTags(
      admin,
      tags,
      startCursor,
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

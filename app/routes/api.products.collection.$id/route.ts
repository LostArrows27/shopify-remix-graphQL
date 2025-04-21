import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { GraphQlQueryService } from "app/service/graphql_query_service.server";
import { authenticate } from "app/shopify.server";
import type { ShopifyPageInfo, ProductResponseData } from "app/types/server";
import { serverResponseWithProductPagination } from "app/utils/map_product_response";

/**
 * @description get collection name based on ID
 * @method GET
 * @route /api/products/collection/$id?startCursor={startCursor}
 * @param {number} id - collection ID
 * @param {number} startCursor - graphql cursor for pagination
 */
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);

    const startCursor = url.searchParams.get("startCursor") || "";

    if (!startCursor) {
      throw new Error("Missing startCursor params");
    }

    const { id } = params;

    const collectionId = decodeURIComponent(id as string);

    const { admin } = await authenticate.admin(request);

    const response = await GraphQlQueryService.queryCollectionWithMedia(
      admin,
      collectionId,
      startCursor,
    );

    const result = (await response.json()).data;

    return serverResponseWithProductPagination({
      pageInfo: result.collection.products.pageInfo as ShopifyPageInfo,
      products: result.collection.products as ProductResponseData,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(`Error getting product with collectionID ${params.id}:`, error);
    return ServerResponse.error({
      data: {
        products: [],
      },
      message: "Failed to collection product",
    });
  }
};

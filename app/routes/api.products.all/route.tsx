import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { GraphQlQueryService } from "app/service/graphql_query_service.server";
import { authenticate } from "app/shopify.server";
import type { ProductResponseData, ShopifyPageInfo } from "app/types/server";
import { serverResponseWithProductPagination } from "app/utils/map_product_response";

/**
 * @description get all products information with pagination
 * @method GET
 * @route /api/products/all?startCursor={startCursor}
 * @param {number} startCursor - graphql cursor for pagination
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);

    const url = new URL(request.url);

    const startCursor = url.searchParams.get("startCursor") || "";

    if (!startCursor) {
      throw new Error("Missing required parameters: startCursor");
    }

    const response = await GraphQlQueryService.queryProductWithMedia(
      admin,
      startCursor,
    );

    const result = (await response.json()).data;

    return serverResponseWithProductPagination({
      pageInfo: result.products.pageInfo as ShopifyPageInfo,
      products: result.products as ProductResponseData,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log("Error fetching all products:", error);

    return ServerResponse.error({
      data: [],
      message: "Failed to fetch products",
    });
  }
};

import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { GraphQlQueryService } from "app/service/graphql_query_service.server";
import { authenticate } from "app/shopify.server";

/**
 * @description get product affected with pagination
 * @method GET
 * @route /api/affected?startCursor={startCursor}
 * @param {number} startCursor - graphql cursor for pagination
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);

    const startCursor = url.searchParams.get("startCursor") || null;

    if (!startCursor) {
      throw new Error("Missing required parameters: startCursor");
    }

    const { admin } = await authenticate.admin(request);

    const response = await GraphQlQueryService.queryProductWithCollectionAndTag(
      admin,
      startCursor,
    );

    const result = (await response.json()).data;

    return result;
  } catch (error) {
    console.log("Error fetching affected products:", error);

    return ServerResponse.error({
      data: [],
      message: "Failed to fetch affected products",
    });
  }
};

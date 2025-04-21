import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { GraphQlQueryService } from "app/service/graphql_query_service.server";
import { PricingRuleService } from "app/service/pricing_rule_service.server";
import { ShopifyService } from "app/service/shopify_service.server";
import { authenticate } from "app/shopify.server";
import type {
  AffectedProductServerResponse,
  AffectedProductWithRuleData,
  AffectedProductResponse,
} from "app/types/server";

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

    // NOTE: 1. get products list (pagination)
    const response = await GraphQlQueryService.queryProductWithCollectionAndTag(
      admin,
      startCursor,
    );

    const result = (await response.json()).data as AffectedProductResponse;

    // NOTE: 2. get affected rules (all/specific/collection/tags)
    const shopName = await ShopifyService.getShopifyShopName(admin);

    const affectedRules: AffectedProductWithRuleData =
      await PricingRuleService.getAffectedRules(
        result.products.nodes,
        shopName,
      );

    // NOTE: 3. return product with rules and pagination
    return ServerResponse.success<AffectedProductServerResponse>({
      data: {
        products: affectedRules,
        pageInfo: {
          startCursor: result.products.pageInfo.endCursor,
          hasNextPage: result.products.pageInfo.hasNextPage,
          hasPreviousPage: result.products.pageInfo.hasPreviousPage,
        },
      },
      message: "Products with rules fetched successfully",
    });
  } catch (error) {
    console.log("Error fetching affected products:", error);

    return ServerResponse.error({
      data: [],
      message: "Failed to fetch affected products",
    });
  }
};

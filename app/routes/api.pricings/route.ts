import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { PricingRuleService } from "app/service/pricing_rule_service.server";
import { ShopifyService } from "app/service/shopify_service.server";
import { authenticate } from "app/shopify.server";
import type { PricingRuleResponse } from "app/types/server";

/**
 * @description get all pricings with pagination
 * @method GET
 * @route /api/pricings/list?page=1
 * @param {number} page - page number
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);

    const shopName = await ShopifyService.getShopifyShopName(admin);

    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;

    const result = await PricingRuleService.getPaginatedPricingRules(
      page,
      shopName,
    );

    return ServerResponse.success<PricingRuleResponse>({
      data: result,
      message: "Fetched pricing rules successfully",
    });
  } catch (error) {
    console.log("Error fetching pricing rules:", error);

    return ServerResponse.error<PricingRuleResponse>({
      data: null,
      message: "Error fetching pricing rules",
    });
  }
};

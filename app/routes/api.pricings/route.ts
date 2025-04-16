import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { PricingRuleService } from "app/service/pricing_rule_service.server";
import type { PricingRulePageData } from "app/types/server";

/*
 * @description get all pricings with pagination
 * @method GET
 * @route /api/pricings?page={page}
 * @param {number} page - page number
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;

    const result = await PricingRuleService.getPaginatedPricingRules(page);

    return ServerResponse.success<PricingRulePageData>({
      data: result,
      message: "Fetched pricing rules successfully",
    });
  } catch (error) {
    console.log("Error fetching pricing rules:", error);

    return ServerResponse.error<PricingRulePageData>({
      data: null,
      message: "Error fetching pricing rules",
    });
  }
};

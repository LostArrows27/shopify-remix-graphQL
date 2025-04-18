import type { PricingRule } from "app/types/app";
import type { ProductData, ProductServerResponse } from "app/types/server";

export class ProductService {
  static async getAppliedProducts(
    pricingRule: PricingRule,
  ): Promise<ProductData[]> {
    const selectedIds = pricingRule.ruleApplications.map(
      (ruleApplication) => ruleApplication.entityId,
    );

    switch (pricingRule.applicationType) {
      case "all":
        return [];
      case "specific_products":
        const form = new FormData();

        form.append("ids", JSON.stringify(selectedIds));

        const result = await fetch("/api/products/selected", {
          method: "POST",
          body: form,
        });

        const data = (await result.json()) as ProductServerResponse;

        return data.data;
      case "collections":
        return [];
      case "tags":
        return [];
      default:
        return [];
    }
  }
}

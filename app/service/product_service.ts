import type { PricingRule } from "app/types/app";
import type { ProductPageData, ProductServerResponse } from "app/types/server";

export class ProductService {
  static async getAppliedProducts(
    pricingRule: PricingRule,
    startCursor: string = "cursor",
    tags: string[] = [],
  ): Promise<ProductPageData> {
    const selectedIds = pricingRule.ruleApplications.map(
      (ruleApplication) => ruleApplication.entityId,
    );

    switch (pricingRule.applicationType) {
      case "all":
        const allProductRes = await fetch(
          `/api/products/all?startCursor=${startCursor}`,
        );

        const allProductData =
          (await allProductRes.json()) as ProductServerResponse;

        return allProductData.data;
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
        return {
          products: [],
        };
      case "tags":
        const tagStr = encodeURIComponent(JSON.stringify(tags));

        const tagRes = await fetch(
          `/api/products/tags?startCursor=${startCursor}&tags=${tagStr}`,
        );

        const tagData = (await tagRes.json()) as ProductServerResponse;

        return tagData.data;
      default:
        return {
          products: [],
        };
    }
  }
}

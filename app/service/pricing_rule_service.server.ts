import type { PricingRuleFormData } from "app/types/app";

import db from "../db.server";

export class PricingRuleService {
  static async createPricingRule(
    selectedIds: string[],
    ruleInformation: PricingRuleFormData,
    shopName: string,
  ) {
    try {
      const { name, priority, status, appliedProductType, priceType, amount } =
        ruleInformation;

      console.log("Creating pricing rule with data:", {
        selectedIds,
        name,
        priority,
        status,
        appliedProductType,
        priceType,
        amount,
      });

      const rule = await db.pricingRule.create({
        data: {
          name,
          priority,
          status: status === "enable" ? true : false,
          applicationType: appliedProductType,
          customPriceType: priceType,
          customPriceValue: amount,
          shop: shopName,
        },
      });

      if (selectedIds.length > 0 && appliedProductType !== "all") {
        await db.ruleApplication.createMany({
          data: selectedIds.map((entityId) => ({
            entityType: appliedProductType,
            entityId,
            pricingRuleId: rule.id,
          })),
        });
      }

      return {
        status: "success",
        message: "Pricing rule created successfully.",
      };
    } catch (error) {
      throw error;
    }
  }
}

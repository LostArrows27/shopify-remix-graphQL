import type { PricingRule, PricingRuleFormData } from "app/types/app";
import db from "../db.server";
import type { PricingRulePageData } from "app/types/server";

export class PricingRuleService {
  static RULES_PAGE_LIMIT = 25;

  static async getPaginatedPricingRules(
    page: number,
    shopName: string,
  ): Promise<PricingRulePageData> {
    try {
      const offset = (page - 1) * this.RULES_PAGE_LIMIT;

      const [totalCount, pricingRules] = (await Promise.all([
        db.pricingRule.count(),
        db.pricingRule.findMany({
          skip: offset, // skip -> first pos to start
          take: this.RULES_PAGE_LIMIT, // take -> number of items to take (from first pos)
          orderBy: {
            createdAt: "desc",
          },
          where: {
            shop: shopName,
          },
          include: {
            ruleApplications: true,
          },
        }),
      ])) as unknown as [number, PricingRule[]];

      return {
        pageInfo: {
          total: totalCount,
          page: page,
          hasNext: totalCount > offset + this.RULES_PAGE_LIMIT,
          hasPrevious: page > 1,
        },
        pricingRules,
      };
    } catch (error) {
      throw error;
    }
  }

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

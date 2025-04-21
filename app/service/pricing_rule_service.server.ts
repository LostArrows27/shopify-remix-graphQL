import type { PricingRule, PricingRuleFormData } from "app/types/app";
import db from "../db.server";
import type { AffectedProduct, PricingRulePageData } from "app/types/server";

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

  // NOTE: fetch all pricing rules affected a product id
  static async getAffectedRules(products: AffectedProduct[], shopName: string) {
    try {
      const productIds = products.map((product) => product.id);
      const tags = [...new Set(products.flatMap((product) => product.tags))];
      const collectionIds = [
        ...new Set(
          products.flatMap((product) =>
            product.collections.nodes.map((node) => node.id),
          ),
        ),
      ];

      const potentialRule = (await db.pricingRule.findMany({
        where: {
          shop: shopName,
          status: true,
          OR: [
            {
              applicationType: "all",
            },
            {
              applicationType: "specific_products",
              ruleApplications: {
                some: {
                  entityType: "specific_products",
                  entityId: { in: productIds },
                },
              },
            },
            {
              applicationType: "tags",
              ruleApplications: {
                some: {
                  entityType: "tags",
                  entityId: { in: tags },
                },
              },
            },
            {
              applicationType: "collections",
              ruleApplications: {
                some: {
                  entityType: "collections",
                  entityId: { in: collectionIds },
                },
              },
            },
          ],
        },
        include: {
          ruleApplications: true,
        },
        orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
      })) as PricingRule[];

      return products.map((product) => ({
        product,
        rules: potentialRule
          .filter(
            (rule) =>
              rule.applicationType === "all" ||
              rule.ruleApplications.some(
                (app) =>
                  app.entityType === "tags" &&
                  product.tags.includes(app.entityId),
              ) ||
              rule.ruleApplications.some(
                (app) =>
                  app.entityType === "collections" &&
                  product.collections.nodes
                    .map((collection) => collection.id)
                    .includes(app.entityId),
              ) ||
              rule.ruleApplications.some(
                (app) =>
                  app.entityType === "specific_products" &&
                  app.entityId === product.id,
              ),
          )
          .map((rule) => ({
            id: rule.id,
            priority: rule.priority,
            createdAt: rule.createdAt,
            status: rule.status,
            applicationType: rule.applicationType,
            customPriceType: rule.customPriceType,
            customPriceValue: parseInt(rule.customPriceValue.toString(), 10),
          })),
      }));
    } catch (error) {
      throw error;
    }
  }
}

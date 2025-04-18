import type {
  Session,
  PricingRule as PricingSchema,
  ShopifyTag,
  RuleApplication as RuleApplicationSchema,
} from "@prisma/client";
import type { pricingRuleSchema } from "app/schema/pricing_rule_schema";
import type { z } from "zod";
import type { AppliedProductType, CustomPriceType } from "./enum";
import type { Collection, Product } from "@shopify/app-bridge-react";

export type { Session, ShopifyTag };

export type PricingRuleFormData = z.infer<typeof pricingRuleSchema>;

export type AppliedProductTypeList = {
  label: string;
  value: AppliedProductType;
}[];

export type SelectedType = {
  id: string;
  title: string;
  imageUrl?: string;
};

export type ProductType = Product;

export type CollectionType = Collection;

export type RuleApplication = RuleApplicationSchema & {
  entityType: AppliedProductType;
};

export type PricingRule = PricingSchema & {
  applicationType: AppliedProductType;
  customPriceType: CustomPriceType;
  ruleApplications: RuleApplication[];
};

export type PricingRuleWithAppliedProducts = PricingRule & {
  appliedProducts: SelectedType[];
};

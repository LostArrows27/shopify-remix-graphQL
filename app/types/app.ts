import type { Session, PricingRule, ShopifyTag } from "@prisma/client";
import type { pricingRuleSchema } from "app/schema/pricing_rule_schema";
import type { z } from "zod";
import type { AppliedProductType } from "./enum";
import type { Collection, Product } from "@shopify/app-bridge-react";

export type { Session, PricingRule, ShopifyTag };

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

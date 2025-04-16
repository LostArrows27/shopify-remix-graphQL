import type { PricingRule } from "./app";

export type ResponseStatus = "success" | "error";

export type ServerResponseType = {
  message: string;
  status: ResponseStatus;
};

export type AdminTagResponse = {
  data: {
    productTags: {
      nodes: string[];
      pageInfo: {
        endCursor: string;
        hasNextPage: false;
      };
    };
  };
};

// Tag API

export type ServerTagData = {
  productTags: string[];
  pageInfo: {
    startCursor: string;
    hasNextPage: boolean;
  };
} | null;

// Pricing Rule API

export type PricingRulePageData = {
  pricingRules: PricingRule[];
  pageInfo: {
    total: number;
    page: number;
    hasNext: boolean;
  };
} | null;

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

export type ServerTagResponse = ServerResponseType & {
  data: ServerTagData;
};

// Pricing Rule API

export type PageInfo = {
  total: number;
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PricingRulePageData = {
  pricingRules: PricingRule[];
  pageInfo: PageInfo;
} | null;

export type PricingRulePagination = NonNullable<PricingRulePageData>;

export type PricingRuleResponse = ServerResponseType & {
  data: PricingRulePageData;
};

// Product API
export type ProductResponseData = {
  nodes: {
    id: string;
    title: string;
    variants: {
      nodes: {
        title: string;
        price: string;
      }[];
    };
    media: {
      nodes: {
        preview: {
          image: {
            url: string;
          };
        };
      }[];
    };
  }[];
};

export type ProductData = {
  title: string;
  variants: {
    title: string;
    price: number;
  }[];
  imageUrl: string;
};

export type ProductServerResponse = ServerResponseType & {
  data: ProductData[];
};

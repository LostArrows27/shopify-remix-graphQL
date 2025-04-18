import type { PricingRule } from "./app";

export type ResponseStatus = "success" | "error";

export type ServerResponseType = {
  message: string;
  status: ResponseStatus;
};

export type ShopifyPageInfo = {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ServerPageInfo = {
  startCursor: string;
  hasNextPage: boolean;
};

export type AdminTagResponse = {
  data: {
    productTags: {
      nodes: string[];
      pageInfo: ShopifyPageInfo;
    };
  };
};

// Tag API

export type ServerTagData = {
  productTags: string[];
  pageInfo: ServerPageInfo;
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

// all product API

export type ProductPageInfo = ServerPageInfo & {
  hasPreviousPage: boolean;
};

export type ProductServerResponse = ServerResponseType & {
  data: {
    products: ProductData[];
    pageInfo?: ProductPageInfo;
  };
};

export type ProductPageData = ProductServerResponse["data"];

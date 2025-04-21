import type { PricingRuleService } from "app/service/pricing_rule_service.server";
import type { PricingRule } from "./app";

export type ResponseStatus = "success" | "error";

export type ServerResponseType = {
  message: string;
  status: ResponseStatus;
};

export type ProductMedia = {
  nodes: {
    preview: {
      image: {
        url: string;
      };
    };
  }[];
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
    media: ProductMedia;
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

// collection name API

export type CollectionNameResponse = {
  data: string;
};

export type CollectionNameServerResponse = CollectionNameResponse &
  ServerResponseType;

// effected product API
export type AffectedProduct = {
  id: string;
  title: string;
  variants: {
    nodes: {
      id: string;
      title: string;
      price: string;
    }[];
  };
  media: ProductMedia;
  collections: {
    nodes: {
      id: string;
      title: string;
    }[];
  };
  tags: string[];
};

export type AffectedProductResponse = {
  products: {
    nodes: AffectedProduct[];
    pageInfo: ShopifyPageInfo;
  };
};

export type AffectedProductWithRuleData = Awaited<
  ReturnType<typeof PricingRuleService.getAffectedRules>
>;

export type AffectedProductServerResponse = ServerResponseType & {
  data: {
    products: AffectedProductWithRuleData;
    pageInfo: ProductPageInfo;
  };
};

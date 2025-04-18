import { ServerResponse } from "app/libs/server_response";
import type {
  ProductData,
  ProductResponseData,
  ProductServerResponse,
  ShopifyPageInfo,
} from "app/types/server";

const mapProductData = (data: ProductResponseData): ProductData[] => {
  return data.nodes.map((product) => ({
    title: product.title,
    variants: product.variants.nodes.map((variant) => ({
      title: variant.title,
      price: parseFloat(variant.price),
    })),
    imageUrl: product.media.nodes[0]?.preview.image.url,
  }));
};

export const serverResponseWithProductPagination = ({
  pageInfo,
  products,
  message = "Products fetched successfully",
}: {
  pageInfo: ShopifyPageInfo | undefined;
  products: ProductResponseData;
  message: string;
}) => {
  const returnData: ProductData[] = mapProductData(products);

  return ServerResponse.success<ProductServerResponse>({
    data: {
      products: returnData,
      pageInfo: pageInfo
        ? {
            startCursor: pageInfo.endCursor,
            hasNextPage: pageInfo.hasNextPage,
            hasPreviousPage: pageInfo.hasPreviousPage,
          }
        : undefined,
    },
    message: message,
  });
};

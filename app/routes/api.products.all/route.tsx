import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { authenticate } from "app/shopify.server";
import type {
  ProductResponseData,
  ShopifyPageInfo,
  ProductData,
  ProductServerResponse,
} from "app/types/server";
/**
 * @description get all products information with pagination
 * @method GET
 * @route /api/products/all?startCursor={startCursor}
 * @param {number} startCursor - graphql cursor for pagination
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);

    const url = new URL(request.url);

    const startCursor = url.searchParams.get("startCursor") || "";

    if (!startCursor) {
      throw new Error("Missing required parameters: startCursor");
    }

    const response = await admin.graphql(
      `#graphql
            query {
                products(first: 7 ${startCursor != "cursor" ? `, after: "${startCursor}"` : ""}) {
                    nodes {
                        id
                        title
                        variants(first: 10) {
                            nodes {
                                id
                                title
                                price
                            }
                        }
                        media(first: 1) {
                            nodes {
                                preview {
                                    image {
                                        url
                                    }
                                }
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                }
            }
        `,
    );

    const result = (await response.json()).data;

    const productDatas = result.products as ProductResponseData;

    const pageInfo = result.products.pageInfo as ShopifyPageInfo;

    const returnData: ProductData[] = productDatas.nodes.map((product) => ({
      title: product.title,
      variants: product.variants.nodes.map((variant) => ({
        title: variant.title,
        price: parseFloat(variant.price),
      })),
      imageUrl: product.media.nodes[0]?.preview.image.url,
    }));

    return ServerResponse.success<ProductServerResponse>({
      data: {
        products: returnData,
        pageInfo: {
          startCursor: pageInfo.endCursor,
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
        },
      },
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log("Error fetching all products:", error);

    return ServerResponse.error({
      data: [],
      message: "Failed to fetch products",
    });
  }
};

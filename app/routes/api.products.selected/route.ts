import type { ActionFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { authenticate } from "app/shopify.server";
import type { ProductResponseData } from "app/types/server";
import { serverResponseWithProductPagination } from "app/utils/map_product_response";

/**
 * @description get products information by ids
 * @method POST
 * @route /api/products/selected
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    if (request.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const form = await request.formData();

    const selectedIds = JSON.parse(form.get("ids") as string);

    const idsForQuery = selectedIds.map((id: string) => `"${id}"`).join(", ");

    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
      `#graphql
        query GetProductsByIds {
          nodes(ids: [${idsForQuery}]) {
            id
            ... on Product {
              title
              variants(first: 10) {
                nodes {
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
          }
        }
      `,
    );

    const data = (await response.json()).data as ProductResponseData;

    return serverResponseWithProductPagination({
      pageInfo: undefined,
      products: data,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log("Error fetching products:", error);
    return ServerResponse.error({
      data: {
        products: [],
      },
      message: "Failed to fetch products",
    });
  }
};

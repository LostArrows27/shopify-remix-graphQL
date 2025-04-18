import type { LoaderFunctionArgs } from "@remix-run/node";
import { ServerResponse } from "app/libs/server_response";
import { authenticate } from "app/shopify.server";
import type { CollectionNameResponse } from "app/types/server";

/**
 * @description get collection name based on ID
 * @method GET
 * @route /api/collection/$id
 * @param {number} id - collection ID
 */
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const { id } = params;

    const collectionId = decodeURIComponent(id as string);

    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
      `#graphql
          query {
              collection (id: "${collectionId}") {
                  title
              }
          }
      `,
    );

    const data = await response.json();

    return ServerResponse.success<CollectionNameResponse>({
      data: data.data.collection.title,
      message: "Fetched collection name successfully",
    });
  } catch (error) {
    console.log("Error getting collection name:", error);
    return ServerResponse.error<CollectionNameResponse>({
      data: params.id,
      message: "Failed to get collection name",
    });
  }
};

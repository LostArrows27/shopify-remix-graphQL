import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import type { AdminTagResponse, ServerTagResponse } from "app/types/server";
import db from "../../db.server";
import { ShopifyService } from "app/service/shopify_service.server";

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
          productTags(first: 10 ${startCursor != "cursor" ? `, after: "${startCursor}"` : ""}) {
              nodes,
              pageInfo {
                endCursor,
                hasNextPage,
              }
          }
        }
    `,
    );

    const data = (await response.json()) as AdminTagResponse;

    // NOTE: fetch all tags from db if first time -> "cursor"

    const dbTags: string[] = [];

    if (startCursor === "cursor") {
      const shopName = await ShopifyService.getShopifyShopName(admin);

      const dbTagsResult = await db.shopifyTag.findMany({
        where: {
          shop: shopName,
        },
      });

      dbTags.push(...dbTagsResult.map((tag) => tag.name));
    }

    const responseData: ServerTagResponse = {
      data: {
        productTags: data.data.productTags.nodes.concat(dbTags),
        pageInfo: {
          startCursor: data.data.productTags.pageInfo.endCursor,
          hasNextPage: data.data.productTags.pageInfo.hasNextPage,
        },
      },
      status: "success",
    };

    return Response.json(responseData);
  } catch (error) {
    console.log("Error fetching tags:", (error as Error).message);

    return Response.json({
      status: "error",
      message: "Failed to fetch tags",
      data: {
        productTags: [],
        pageInfo: {
          startCursor: "",
          hasNextPage: false,
        },
      },
    } as ServerTagResponse);
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    if (request.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const { admin } = await authenticate.admin(request);

    const shopName = await ShopifyService.getShopifyShopName(admin);

    if (!shopName) {
      throw new Error("Shop not found");
    }

    const body = await request.formData();

    const name = body.get("name") as string;

    if (!name) {
      throw new Error("Missing required parameters: name");
    }

    await db.shopifyTag.create({
      data: {
        name: name,
        shop: shopName,
      },
    });

    return Response.json({
      status: "success",
      message: "Tag created successfully",
    });
  } catch (error) {
    console.log("Error creating tag:", (error as Error).message);

    return Response.json({
      status: "error",
      message: "Failed to create tag",
    });
  }
};

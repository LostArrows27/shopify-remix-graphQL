import type { AdminApiContextWithoutRest } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/admin/types";

export class ShopifyService {
  static async getShopifyShopName(admin: AdminApiContextWithoutRest) {
    const response = await admin.graphql(
      `#graphql
            query shopInfo {
                shop {
                  id
                }
            }
          `,
    );

    const shopName = (await response.json()).data.shop.id;

    if (!shopName) {
      throw new Error("Shop not found");
    }

    return shopName as string;
  }
}

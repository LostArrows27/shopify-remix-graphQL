import { useAppBridge } from "@shopify/app-bridge-react";

export const useRedirectToProductPage = (id: string) => {
  const app = useAppBridge();

  const redirect = () => {
    const numericId = id.includes("gid://shopify/Product/")
      ? id.replace("gid://shopify/Product/", "")
      : id;

    const shopName = app.config.shop!.split(".")[0];

    window.open(
      `https://admin.shopify.com/store/${shopName}/products/${numericId}`,
      "_top",
    );
  };

  return {
    redirect,
  }
};

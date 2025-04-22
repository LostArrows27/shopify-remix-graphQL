import { Icon } from "@shopify/polaris";
import { ViewIcon } from "@shopify/polaris-icons";
import style from "./style.module.css";
import { useRedirectToProductPage } from "app/hooks/use_redirect_to_product_page";

const ProductLinkButton = ({ id }: { id: string }) => {
  const { redirect } = useRedirectToProductPage(id);

  return (
    <div
      onClick={() => {
        redirect();
      }}
      className={style["product-button"]}
    >
      <Icon source={ViewIcon} />
    </div>
  );
};

export default ProductLinkButton;

import { Button, Popover, ActionList } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { MenuHorizontalIcon } from "@shopify/polaris-icons";
import style from "./style.module.css";

import type { AffectedProductWithRuleData } from "app/types/server";
import { useRedirectToProductPage } from "app/hooks/use_redirect_to_product_page";
import { useAffectedRuleModal } from "app/hooks/use_affected_rule_modal";
import { useActiveRuleModal } from "app/hooks/use_active_rule_modal";

interface IProductActionPopover {
  product: AffectedProductWithRuleData[number];
}

function ProductActionPopover({ product }: IProductActionPopover) {
  const [popoverActive, setPopoverActive] = useState(false);

  const openAffectedRuleModal = useAffectedRuleModal(
    (state) => state.openModal,
  );

  const openActiveRulesModal = useActiveRuleModal((state) => state.openModal);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const { redirect } = useRedirectToProductPage(product.product.id);

  return (
    <div
      className={style["product-action"]}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Popover
        active={popoverActive}
        activator={
          <div className={style["product-popover"]}>
            <Button onClick={togglePopoverActive} icon={MenuHorizontalIcon} />
          </div>
        }
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: "View rule priority",
              onAction: () => {
                openActiveRulesModal(product.rules);
                togglePopoverActive();
              },
            },
            {
              content: "Check variant pricing",
              onAction: () => {
                openAffectedRuleModal(product);
                togglePopoverActive();
              },
            },
            {
              content: "Edit product details",
              onAction: () => {
                redirect();
                togglePopoverActive();
              },
            },
          ]}
        />
      </Popover>
    </div>
  );
}

export default ProductActionPopover;

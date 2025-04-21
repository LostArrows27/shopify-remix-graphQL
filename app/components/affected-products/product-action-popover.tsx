import { Button, Popover, ActionList } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { MenuHorizontalIcon } from "@shopify/polaris-icons";
import style from "./style.module.css";

function ProductActionPopover() {
  const [popoverActive, setPopoverActive] = useState(true);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

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
            { content: "View affected rules" },
            { content: "View product page" },
          ]}
        />
      </Popover>
    </div>
  );
}

export default ProductActionPopover;

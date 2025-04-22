import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { BlockStack, Box } from "@shopify/polaris";
import AppliedProductTable from "./applied_product_table";
import { useViewRuleModalStore } from "app/hooks/use_view_rule_modal";
import RuleDescription from "../rule-description";

const ViewRuleModal = () => {
  const pricingRule = useViewRuleModalStore((state) => state.pricingRule);

  const closeModal = useViewRuleModalStore((state) => state.closeModal);

  return (
    <Modal open={pricingRule != undefined} id="view-rule-modal" variant="large">
      <Box padding={"400"}>
        <BlockStack gap={"400"}>
          <RuleDescription pricingRule={pricingRule} />
          {pricingRule && <AppliedProductTable pricingRule={pricingRule} />}
        </BlockStack>
      </Box>
      <TitleBar title="Pricing rule information">
        <button variant="primary" onClick={() => closeModal()}>
          Done
        </button>
      </TitleBar>
    </Modal>
  );
};

export default ViewRuleModal;

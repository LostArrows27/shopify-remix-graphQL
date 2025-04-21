import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { BlockStack, Box, EmptyState } from "@shopify/polaris";
import { useAffectedRuleModal } from "app/hooks/use_affected_rule_modal";

const AffectedRuleModal = () => {
  const productData = useAffectedRuleModal((state) => state.productData);

  const closeModal = useAffectedRuleModal((state) => state.closeModal);

  const haveRules = productData && productData?.rules.length > 0;

  return (
    <Modal open={!!productData} id="affected-rule-modal">
      {haveRules ? (
        <Box padding={"400"}>
          <BlockStack gap={"400"}></BlockStack>
        </Box>
      ) : (
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading="No affected rules"
        >
          <p>
            This product does not have any affected rules. Please check the
            product details to see if there are any other issues.
          </p>
        </EmptyState>
      )}
      <TitleBar title="Affected Rules">
        <button variant="primary" onClick={() => closeModal()}>
          Done
        </button>
      </TitleBar>
    </Modal>
  );
};

export default AffectedRuleModal;

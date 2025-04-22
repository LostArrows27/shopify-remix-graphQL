import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { BlockStack, Box, EmptyState, Text } from "@shopify/polaris";
import { useActiveRuleModal } from "app/hooks/use_active_rule_modal";
import ActiveRuleListTable from "./active_rule_list_table";
import { useNavigate } from "@remix-run/react";

const ActiveRuleModal = () => {
  const pricingRules = useActiveRuleModal((state) => state.pricingRules);

  const closeModal = useActiveRuleModal((state) => state.closeModal);

  const haveRules = pricingRules && pricingRules?.length > 0;

  const navigator = useNavigate();

  return (
    <Modal variant="large" open={!!pricingRules} id="active-rule-modal">
      {haveRules ? (
        <Box paddingBlock={"500"}>
          <BlockStack gap={"500"}>
            <ActiveRuleListTable rules={pricingRules} />
          </BlockStack>
        </Box>
      ) : (
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading="No active rules"
          action={{
            content: "View rules list",
            onAction: () => {
              closeModal();
              navigator("/app/pricing/list");
            },
          }}
          secondaryAction={{
            content: "Learn more",
            onAction: () => {
              closeModal();
            },
          }}
        >
          <Text as={"p"} variant="bodyMd" fontWeight="regular">
            This product does not have any active rules. Please check the
            product details to see if there are any other issues.
          </Text>
        </EmptyState>
      )}
      <TitleBar title="Active Rules">
        {haveRules && (
          <button variant="primary" onClick={() => closeModal()}>
            Done
          </button>
        )}
      </TitleBar>
    </Modal>
  );
};

export default ActiveRuleModal;

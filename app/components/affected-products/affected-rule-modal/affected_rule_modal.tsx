import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { BlockStack, Box, EmptyState, Text } from "@shopify/polaris";
import RuleDescription from "app/components/rule-description";
import { useAffectedRuleModal } from "app/hooks/use_affected_rule_modal";
import RuleProductTable from "./rule_product_table";

const AffectedRuleModal = () => {
  const productData = useAffectedRuleModal((state) => state.productData);

  const closeModal = useAffectedRuleModal((state) => state.closeModal);

  const haveRules = productData && productData?.rules.length > 0;

  return (
    <Modal variant="large" open={!!productData} id="affected-rule-modal">
      {haveRules ? (
        <Box padding={"400"}>
          <BlockStack gap={"400"}>
            <RuleDescription pricingRule={productData?.rules[0]} />
            <RuleProductTable
              pricingType={productData?.rules[0]!.customPriceType}
              pricingValue={productData?.rules[0]!.customPriceValue.toString()}
              product={productData.product}
            />
          </BlockStack>
        </Box>
      ) : (
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading="No affected rules"
        >
          <Text as={"p"} variant="bodyMd" fontWeight="regular">
            This product does not have any affected rules. Please check the
            product details to see if there are any other issues.
          </Text>
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

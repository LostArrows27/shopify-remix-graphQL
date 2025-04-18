import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Box,
  DescriptionList,
  Text,
} from "@shopify/polaris";
import { RuleConversionUtils } from "app/utils/rule_conversion";
import { format } from "date-fns";
import AppliedProductTable from "./applied_product_table";
import { useViewRuleModalStore } from "app/hooks/use_view_rule_modal";

const ViewRuleModal = () => {
  const pricingRule = useViewRuleModalStore((state) => state.pricingRule);

  const closeModal = useViewRuleModalStore((state) => state.closeModal);

  return (
    <Modal open={pricingRule != undefined} id="view-rule-modal" variant="large">
      <Box padding={"400"}>
        <BlockStack gap={"400"}>
          <DescriptionList
            items={[
              {
                term: "Name",
                description: pricingRule?.name,
              },
              {
                term: "Status",
                description: (
                  <Badge tone={pricingRule?.status ? "success" : undefined}>
                    {pricingRule?.status ? "Enabled" : "Disabled"}
                  </Badge>
                ),
              },
              {
                term: "Created at",
                description: format(
                  pricingRule?.createdAt || Date.now(),
                  "PPpp",
                ),
              },
              {
                term: "Discount description",
                description: (
                  <Text as="span" fontWeight="medium" tone="magic">
                    {RuleConversionUtils.displayDiscountDescription(
                      pricingRule?.customPriceType || "decrease_percentage",
                      pricingRule?.customPriceValue.toString() || "0",
                    )}
                  </Text>
                ),
              },
            ]}
          />
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

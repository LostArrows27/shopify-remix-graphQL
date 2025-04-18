import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { Badge, BlockStack, Box, DescriptionList } from "@shopify/polaris";
import type { PricingRule } from "app/types/app";
import { RuleConversionUtils } from "app/utils/rule_conversion";
import { format } from "date-fns";
import AppliedProductTable from "./applied_product_table";

interface IViewRuleModalProps {
  pricingRule: PricingRule | undefined;
}
const ViewRuleModal = ({ pricingRule }: IViewRuleModalProps) => {
  if (!pricingRule) {
    return null;
  }

  const { name, status, createdAt, customPriceType, customPriceValue } =
    pricingRule;

  return (
    <Modal id="view-rule-modal" variant="large">
      <Box padding={"400"}>
        <BlockStack gap={"400"}>
          <DescriptionList
            items={[
              {
                term: "Name",
                description: name,
              },
              {
                term: "Status",
                description: (
                  <Badge tone={status ? "success" : undefined}>
                    {status ? "Enabled" : "Disabled"}
                  </Badge>
                ),
              },
              {
                term: "Created at",
                description: format(createdAt, "PPpp"),
              },
              {
                term: "Discount description",
                description: RuleConversionUtils.displayDiscountDescription(
                  customPriceType,
                  customPriceValue.toString(),
                ),
              },
            ]}
          />
          <AppliedProductTable pricingRule={pricingRule} />
        </BlockStack>
      </Box>
      <TitleBar title="Pricing rule information">
        <button
          variant="primary"
          onClick={() => shopify.modal.hide("view-rule-modal")}
        >
          Done
        </button>
      </TitleBar>
    </Modal>
  );
};

export default ViewRuleModal;

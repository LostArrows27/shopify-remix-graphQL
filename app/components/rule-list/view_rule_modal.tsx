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
import { useEffect, useState } from "react";
import { CollectionService } from "app/service/collection_service";

const ViewRuleModal = () => {
  const pricingRule = useViewRuleModalStore((state) => state.pricingRule);

  const closeModal = useViewRuleModalStore((state) => state.closeModal);

  const [collectionName, setCollectionName] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    setCollectionName(undefined);

    const getCollectionName = async (id: string) => {
      const name = await CollectionService.getCollectionName(id);

      setCollectionName(name);
    };

    if (pricingRule && pricingRule.applicationType === "collections") {
      getCollectionName(pricingRule.ruleApplications[0].entityId);
    }
  }, [pricingRule]);

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
                term: "Priority",
                description: pricingRule?.priority.toString(),
              },
              {
                term: "Applied to",
                description:
                  pricingRule && pricingRule.applicationType != "collections"
                    ? RuleConversionUtils.getAppliedProductTypeDescription(
                        pricingRule,
                      )
                    : collectionName
                      ? collectionName
                      : "Loading collection name...",
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

import { Badge, DescriptionList, Text } from "@shopify/polaris";
import { RuleConversionUtils } from "app/utils/rule_conversion";
import { format } from "date-fns";
import { memo, useEffect, useState } from "react";
import { CollectionService } from "app/service/collection_service";
import type { PricingRule } from "app/types/app";

interface IRuleDescription {
  pricingRule: PricingRule | undefined;
}

const RuleDescription = ({ pricingRule }: IRuleDescription) => {
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
          description: format(pricingRule?.createdAt || Date.now(), "PPpp"),
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
  );
};

export default memo(RuleDescription);

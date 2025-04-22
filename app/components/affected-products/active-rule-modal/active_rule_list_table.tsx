import { Badge, IndexTable, Text } from "@shopify/polaris";
import type { PricingRule } from "app/types/app";
import { formatRelativeDate } from "app/utils/format_relative_date";
import { RuleConversionUtils } from "app/utils/rule_conversion";

interface IActiveRuleListTable {
  rules: PricingRule[];
}

const ActiveRuleListTable = ({ rules }: IActiveRuleListTable) => {
  return (
    <IndexTable
      resourceName={{
        singular: "active rule",
        plural: "active rules",
      }}
      selectable={false}
      itemCount={rules.length}
      headings={[
        { title: "Name" },
        { title: "Status" },
        { title: "Priority" },
        { title: "Created at" },
        { title: "Apply to" },
        { title: "Discount type" },
        { title: "Discount value", alignment: "end" },
      ]}
    >
      {rules.map((rule, index) => (
        <IndexTable.Row
          tone={index === 0 ? "success" : undefined}
          disabled={index !== 0}
          id={rule.id}
          key={rule.id}
          position={index}
        >
          <IndexTable.Cell>
            <div
              style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Text variant="bodyMd" fontWeight="bold" as="span">
                {rule.name}
              </Text>
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Badge
              tone={
                rule.status ? (index === 0 ? "magic" : "enabled") : undefined
              }
            >
              {rule.status ? (index === 0 ? "Active" : "Inactive") : "Inactive"}
            </Badge>
          </IndexTable.Cell>
          <IndexTable.Cell>{rule.priority}</IndexTable.Cell>

          <IndexTable.Cell>
            {formatRelativeDate(rule.createdAt)}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {RuleConversionUtils.convertDisplayApplyRule(rule.applicationType)}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {RuleConversionUtils.convertDisplayCustomPriceType(
              rule.customPriceType,
            )}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div
              style={{
                float: "right",
              }}
            >
              {RuleConversionUtils.convertDisplayDiscountValue(
                rule.customPriceType,
                rule.customPriceValue.toString(),
              )}
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      ))}
    </IndexTable>
  );
};

export default ActiveRuleListTable;

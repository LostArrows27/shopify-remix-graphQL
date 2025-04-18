import { Page } from "@shopify/polaris";
import RuleListTable from "app/components/rule-list/rule_list_table";
import { ExportIcon } from "@shopify/polaris-icons";
import { useNavigate } from "@remix-run/react";

const PricingRuleLists = () => {
  const navigate = useNavigate();

  return (
    <Page
      title="Pricing Rules"
      fullWidth
      primaryAction={{
        content: "Create pricing rule",
        onAction: () => {
          navigate("/app/pricing/create");
        },
      }}
      secondaryActions={[
        {
          content: "Export",
          icon: ExportIcon,
        },
      ]}
    >
      <RuleListTable />
    </Page>
  );
};

export default PricingRuleLists;

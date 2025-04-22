import { Page } from "@shopify/polaris";
import AffectedProductTable from "app/components/affected-products/afftected-product-table/affected_product_table";
import AffectedRuleModal from "app/components/affected-products/affected-rule-modal/affected_rule_modal";
import ActiveRuleModal from "app/components/affected-products/active-rule-modal/active_rule_modal";

const AffectedProducts = () => {
  return (
    <Page
      title="Affected products"
      fullWidth
      subtitle="View all products that affected by your pricing rules"
      backAction={{
        content: "Back",
        url: "/app/pricing/list",
      }}
    >
      <AffectedProductTable />
      <AffectedRuleModal />
      <ActiveRuleModal />
    </Page>
  );
};

export default AffectedProducts;

import { Page } from "@shopify/polaris";
import AffectedProductTable from "app/components/affected-products/affected_product_table";

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
    </Page>
  );
};

export default AffectedProducts;

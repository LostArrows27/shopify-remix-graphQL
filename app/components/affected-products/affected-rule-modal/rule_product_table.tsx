import { Badge, Box, IndexTable, Text, Thumbnail } from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { useFormatCurrency } from "app/hooks/use_format_currency";
import type { CustomPriceType } from "app/types/enum";
import type { AffectedProduct } from "app/types/server";
import { RuleConversionUtils } from "app/utils/rule_conversion";

interface IRuleProductTable {
  pricingValue: string;
  pricingType: CustomPriceType;
  product: AffectedProduct;
}

const RuleProductTable = ({
  pricingType,
  pricingValue,
  product,
}: IRuleProductTable) => {
  const { formatCurrency } = useFormatCurrency();

  return (
    <IndexTable
      resourceName={{ singular: "product", plural: "products" }}
      selectable={false}
      itemCount={product.variants.nodes.length}
      headings={[
        { title: "Product", id: "column-header--product" },
        { title: "Base price", id: "column-header--original" },
        { title: "Discount", id: "column-header--savings", alignment: "end" },
        {
          title: (
            <Text as="span" fontWeight="semibold">
              Final price
            </Text>
          ),

          id: "column-header--discounted",
          alignment: "end",
        },
      ]}
    >
      {/* Parent row (Product) */}
      <IndexTable.Row rowType="data" id={product.id} position={0}>
        <IndexTable.Cell scope="row">
          <Box padding="100">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Thumbnail
                source={
                  product.media.nodes.length > 0
                    ? product.media.nodes[0].preview.image.url
                    : ImageIcon
                }
                alt={product.title}
                size="small"
              />
              <Text as="span" fontWeight="semibold">
                {product.title}
              </Text>
              <Badge>{`${product.variants.nodes.length} variants`}</Badge>
            </div>
          </Box>
        </IndexTable.Cell>
        <IndexTable.Cell />
        <IndexTable.Cell />
        <IndexTable.Cell />
      </IndexTable.Row>
      {/* Children row (Variants) */}
      {/* Child rows (Variants) */}
      {product.variants.nodes.map((variant, variantIndex) => {
        const variantId = `${product.id}-variant-${variantIndex}`;
        const discountedPrice = RuleConversionUtils.changePriceAfterDiscount(
          variant.price,
          pricingType,
          pricingValue,
        );

        const savings = parseInt(variant.price) - discountedPrice;

        return (
          <IndexTable.Row
            rowType="child"
            key={variantId}
            id={variantId}
            position={0 + variantIndex + 1}
          >
            <IndexTable.Cell>
              <div
                style={{
                  marginLeft: "40px",
                  padding: "4px 0px",
                }}
              >
                <Text variant="bodyMd" as="span">
                  {variant.title}
                </Text>
              </div>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text
                variant="bodyMd"
                as="span"
                textDecorationLine="line-through"
                tone="subdued"
              >
                {formatCurrency(variant.price)}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text as="span" alignment="end" numeric>
                {savings > 0 ? "-" : "+"}
                {formatCurrency(savings < 0 ? -savings : savings)}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text
                tone="success"
                fontWeight="semibold"
                as="span"
                alignment="end"
                numeric
              >
                {formatCurrency(discountedPrice, "explicit")}
              </Text>
            </IndexTable.Cell>
          </IndexTable.Row>
        );
      })}
    </IndexTable>
  );
};

export default RuleProductTable;

import {
  LegacyCard,
  Text,
  IndexTable,
  Thumbnail,
  Badge,
  Box,
  Spinner,
  EmptyState,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { useFormatCurrency } from "app/hooks/use_format_currency";
import { ProductService } from "app/service/product_service";
import type { PricingRule } from "app/types/app";
import type { ProductPageData } from "app/types/server";
import { RuleConversionUtils } from "app/utils/rule_conversion";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

interface IAppliedProductTableProps {
  pricingRule: PricingRule | undefined;
}

export default function AppliedProductTable({
  pricingRule,
}: IAppliedProductTableProps) {
  const [loading, setLoading] = useState(false);

  // pagination state
  const [currentPageData, setCurrentPageData] = useState<ProductPageData>({
    products: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "cursor",
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCache, setPageCache] = useState<Record<number, ProductPageData>>(
    {},
  );

  useEffect(() => {
    setCurrentPage(1);
    setPageCache({});
    setCurrentPageData({
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "cursor",
      },
    });

    getProducts("cursor");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricingRule]);

  const productsWithPosition = useMemo(
    () =>
      currentPageData.products.map((product, index) => ({
        ...product,
        id: `product-${index}`,
        position: index,
      })),
    [currentPageData],
  );

  const { formatCurrency } = useFormatCurrency();

  const getProducts = useCallback(
    async (cursor?: string) => {
      if (!pricingRule) return;

      setLoading(true);

      const startCursor =
        cursor !== undefined ? cursor : currentPageData.pageInfo?.startCursor;

      const result = await ProductService.getAppliedProducts(
        pricingRule,
        startCursor,
      );

      const productPageData = {
        products: result.products,
        pageInfo: result?.pageInfo || {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "cursor",
        },
      };

      setCurrentPageData(productPageData);

      setPageCache((prev) => ({
        ...prev,
        [currentPage]: productPageData,
      }));

      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [pricingRule, currentPage, currentPageData.pageInfo?.startCursor],
  );

  useEffect(() => {
    if (
      !pricingRule ||
      (currentPage === 1 && Object.keys(pageCache).length === 0)
    ) {
      return;
    }

    if (pageCache[currentPage]) {
      setCurrentPageData(pageCache[currentPage]);
    } else {
      getProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricingRule, currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPageData.pageInfo?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPageData.pageInfo?.hasNextPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPageData.pageInfo?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPageData.pageInfo?.hasPreviousPage]);

  const rowMarkup = productsWithPosition.map((product) => {
    const productId = product.id;
    const position = product.position;

    return (
      <Fragment key={productId}>
        {/* Parent row (Product) */}
        <IndexTable.Row rowType="data" id={productId} position={position}>
          <IndexTable.Cell scope="row">
            <Box padding="100">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Thumbnail
                  source={product.imageUrl || ImageIcon}
                  alt={product.title}
                  size="small"
                />
                <Text as="span" fontWeight="semibold">
                  {product.title}
                </Text>
                <Badge>{`${product.variants.length} variants`}</Badge>
              </div>
            </Box>
          </IndexTable.Cell>
          <IndexTable.Cell />
          <IndexTable.Cell />
          <IndexTable.Cell />
        </IndexTable.Row>

        {/* Child rows (Variants) */}
        {product.variants.map((variant, variantIndex) => {
          const variantId = `${productId}-variant-${variantIndex}`;
          const discountedPrice = RuleConversionUtils.changePriceAfterDiscount(
            variant.price,
            pricingRule?.customPriceType,
            pricingRule?.customPriceValue.toString(),
          );

          const savings = variant.price - discountedPrice;

          return (
            <IndexTable.Row
              rowType="child"
              key={variantId}
              id={variantId}
              position={position + variantIndex + 1}
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
                  -{formatCurrency(savings)}
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
      </Fragment>
    );
  });

  if (!pricingRule) {
    return (
      <LegacyCard>
        <EmptyState
          heading="No pricing rule selected"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Select a pricing rule to view applied products.</p>
        </EmptyState>
      </LegacyCard>
    );
  }

  if (loading) {
    return (
      <LegacyCard>
        <Box padding="400">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              width: "100%",
            }}
          >
            <Spinner accessibilityLabel="Loading products" size="large" />
          </div>
        </Box>
      </LegacyCard>
    );
  }

  if (currentPageData.products.length === 0) {
    return (
      <LegacyCard>
        <EmptyState
          heading="No products found"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>This rule doesn't have any products applied.</p>
        </EmptyState>
      </LegacyCard>
    );
  }

  return (
    <LegacyCard>
      <IndexTable
        loading={loading}
        selectable={false}
        resourceName={{
          singular: "product",
          plural: "products",
        }}
        itemCount={productsWithPosition.reduce(
          (count, product) => count + 1 + product.variants.length,
          0,
        )}
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
        pagination={{
          hasNext: loading
            ? false
            : currentPageData.pageInfo?.hasNextPage || false,
          hasPrevious: loading
            ? false
            : currentPageData.pageInfo?.hasPreviousPage || false,
          onNext: loading ? undefined : handleNextPage,
          onPrevious: loading ? undefined : handlePrevPage,
        }}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}

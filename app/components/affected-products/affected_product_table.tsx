import {
  Badge,
  Box,
  EmptySearchResult,
  IndexTable,
  LegacyCard,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import ProductActionPopover from "./product-action-popover";

import style from "./style.module.css";
import type { AffectedProductServerResponse } from "app/types/server";
import { useCallback, useEffect, useState } from "react";
import { ProductService } from "app/service/product_service";
import { RuleConversionUtils } from "app/utils/rule_conversion";
import ProductLinkButton from "./product-link-button";

const AffectedProductTable = () => {
  const [loading, setLoading] = useState(false);

  // pagination state
  const [currentPageData, setCurrentPageData] = useState<
    AffectedProductServerResponse["data"]
  >({
    products: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "cursor",
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCache, setPageCache] = useState<
    Record<number, AffectedProductServerResponse["data"]>
  >({});

  useEffect(() => {
    if (loading) return;
    if (pageCache[currentPage]) {
      setCurrentPageData(pageCache[currentPage]);
    } else {
      getAffectedProductWithRule(currentPageData.pageInfo?.startCursor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const getAffectedProductWithRule = useCallback(
    async (cursor?: string) => {
      setLoading(true);

      const data = await ProductService.getAffectedProductsWithRule(cursor);

      setCurrentPageData(data);

      setPageCache((prev) => ({
        ...prev,
        [currentPage]: data,
      }));

      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage],
  );

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

  return (
    <Box paddingBlockEnd="400">
      <LegacyCard>
        <IndexTable
          resourceName={{
            singular: "affected product",
            plural: "affected products",
          }}
          loading={loading}
          emptyState={
            <Box
              paddingBlockStart={loading ? "1600" : "1000"}
              paddingBlockEnd={loading ? "1200" : "1000"}
            >
              <EmptySearchResult
                title={
                  loading
                    ? "Getting affected products"
                    : "No product affected by your pricing rules"
                }
                description={
                  loading
                    ? "Please wait while we fetch your data..."
                    : "Try creating a new pricing rule or change your filters."
                }
                withIllustration
              />
            </Box>
          }
          itemCount={currentPageData.products.length}
          selectable={false}
          headings={[
            {
              title: "Name",
            },
            {
              title: "Status",
            },
            {
              title: "Effected rule",
            },
            {
              title: "Rule type",
            },
            {
              title: "Action",
              alignment: "center",
            },
          ]}
          pagination={{
            hasNext: loading
              ? false
              : currentPageData.pageInfo.hasNextPage || false,
            hasPrevious: loading
              ? false
              : currentPageData.pageInfo.hasPreviousPage || false,
            onNext: loading ? undefined : handleNextPage,
            onPrevious: loading ? undefined : handlePrevPage,
          }}
        >
          {currentPageData.products.map((product, index) => (
            <IndexTable.Row
              rowType="data"
              id={product.product.id}
              key={index}
              position={index}
            >
              <IndexTable.Cell scope="row">
                <Box padding="150">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                    className={style["product-name"]}
                  >
                    <Thumbnail
                      source={
                        product.product.media.nodes.length > 0
                          ? product.product.media.nodes[0].preview.image.url
                          : ImageIcon
                      }
                      alt={"Product image"}
                      size="small"
                    />
                    <Text as="span" fontWeight="semibold">
                      {product.product.title}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <Badge>{`${product.product.variants.nodes.length} variants`}</Badge>
                      <ProductLinkButton id={product.product.id} />
                    </div>
                  </div>
                </Box>
              </IndexTable.Cell>
              <IndexTable.Cell>
                {product.rules.length === 0 ? (
                  <Badge tone="new">{"Uneffected"}</Badge>
                ) : (
                  <Badge tone="attention">{"Affected"}</Badge>
                )}
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                  {product.rules.length > 0
                    ? product.rules[0].name
                    : "No rule affected"}
                </Text>
              </IndexTable.Cell>
              <IndexTable.Cell className="">
                <Text variant="bodyMd" as="span">
                  {product.rules.length > 0
                    ? RuleConversionUtils.convertDisplayApplyRule(
                        product.rules[0].applicationType,
                      )
                    : "Not applicable"}
                </Text>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <ProductActionPopover product={product} />
              </IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </LegacyCard>
    </Box>
  );
};

export default AffectedProductTable;

import { useFetcher } from "@remix-run/react";
import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Box,
  Badge,
  EmptySearchResult,
} from "@shopify/polaris";
import { DeleteIcon, EditIcon, ViewIcon } from "@shopify/polaris-icons";
import type { PricingRule } from "app/types/app";
import type { PageInfo, PricingRuleResponse } from "app/types/server";
import { formatRelativeDate } from "app/utils/format_relative_date";
import { RuleConversionUtils } from "app/utils/rule_conversion";
import { useCallback, useEffect, useState } from "react";
import ViewRuleModal from "./view_rule_modal";

type PageData = {
  pricingRules: PricingRule[];
  pageInfo: PageInfo;
};

export function RuleListTable() {
  const [currentPageData, setCurrentPageData] = useState<PageData>({
    pricingRules: [],
    pageInfo: { hasNext: false, hasPrevious: false, total: 0, page: 1 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCache, setPageCache] = useState<Record<number, PageData>>({});

  const [choosenPricingRule, setChoosenPricingRule] = useState<
    PricingRule | undefined
  >(undefined);

  const fetcher = useFetcher();

  const loading = fetcher.state !== "idle";

  const data = fetcher.data as PricingRuleResponse | undefined;

  useEffect(() => {
    if (
      data?.data &&
      data.status === "success" &&
      pageCache[data.data.pageInfo.page] === undefined
    ) {
      setCurrentPageData(data.data);
      setPageCache((prev) => ({
        ...prev,
        [data.data!.pageInfo.page]: data.data!,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentPage]);

  useEffect(() => {
    if (pageCache[currentPage]) {
      setCurrentPageData(pageCache[currentPage]);
    } else {
      fetcher.load(`/api/pricings?page=${currentPage}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPageData.pageInfo.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPageData.pageInfo.hasNext]);

  const handlePreviousPage = useCallback(() => {
    if (currentPageData.pageInfo.hasPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPageData.pageInfo.hasPrevious]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(currentPageData.pricingRules);

  const bulkActions = [
    {
      content: "Mark as enabled",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Mark as disabled",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: "Delete rules",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

  return (
    <Box paddingBlockEnd="400">
      <LegacyCard>
        <IndexTable
          loading={loading}
          resourceName={{
            singular: "pricing rule",
            plural: "pricing rules",
          }}
          itemCount={currentPageData.pricingRules.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          emptyState={
            <Box
              paddingBlockStart={loading ? "2000" : "1200"}
              paddingBlockEnd={"1200"}
            >
              <EmptySearchResult
                title={loading ? "Loading..." : "No pricing rules created yet"}
                description={
                  loading
                    ? "Please wait while we load your pricing rules."
                    : "Try creating a new pricing rule or change your filters."
                }
                withIllustration
              />
            </Box>
          }
          bulkActions={bulkActions}
          promotedBulkActions={
            selectedResources.length === 1
              ? [
                  {
                    content: "Edit rule",
                    icon: EditIcon,
                    onAction: () => {},
                  },
                  {
                    content: "View rule",
                    icon: ViewIcon,
                    onAction: () => {
                      // find the selected rule
                      const selectedRule = currentPageData.pricingRules.find(
                        (rule) => rule.id === selectedResources[0],
                      );

                      if (!selectedRule) return;

                      setChoosenPricingRule(selectedRule);

                      shopify.modal.show("view-rule-modal");
                    },
                  },
                  {
                    title: "Export",
                    actions: [
                      {
                        content: "Export as PDF",
                        onAction: () =>
                          console.log("Todo: implement PDF exporting"),
                      },
                      {
                        content: "Export as CSV",
                        onAction: () =>
                          console.log("Todo: implement CSV exporting"),
                      },
                    ],
                  },
                ]
              : [
                  {
                    title: "Export",
                    actions: [
                      {
                        content: "Export as PDF",
                        onAction: () =>
                          console.log("Todo: implement PDF exporting"),
                      },
                      {
                        content: "Export as CSV",
                        onAction: () =>
                          console.log("Todo: implement CSV exporting"),
                      },
                    ],
                  },
                ]
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Name" },
            { title: "Status" },
            { title: "Priority" },
            { title: "Created at" },
            { title: "Apply to" },
            { title: "Discount type" },
            { title: "Discount value", alignment: "end" },
          ]}
          pagination={{
            hasNext: loading
              ? false
              : currentPageData.pageInfo.hasNext || false,
            hasPrevious: loading
              ? false
              : currentPageData.pageInfo.hasPrevious || false,
            onNext: loading ? undefined : handleNextPage,
            onPrevious: loading ? undefined : handlePreviousPage,
          }}
        >
          {currentPageData.pricingRules.map(
            (
              {
                id,
                name,
                priority,
                status,
                createdAt,
                applicationType,
                customPriceType,
                customPriceValue,
              },
              index,
            ) => (
              <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
              >
                <IndexTable.Cell>
                  <div
                    style={{
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                      {name}
                    </Text>
                  </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Badge tone={status ? "success" : undefined}>
                    {status ? "Enabled" : "Disabled"}
                  </Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>{priority}</IndexTable.Cell>

                <IndexTable.Cell>
                  {formatRelativeDate(createdAt)}
                </IndexTable.Cell>
                <IndexTable.Cell>
                  {RuleConversionUtils.convertDisplayApplyRule(applicationType)}
                </IndexTable.Cell>
                <IndexTable.Cell>
                  {RuleConversionUtils.convertDisplayCustomPriceType(
                    customPriceType,
                  )}
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <div
                    style={{
                      float: "right",
                    }}
                  >
                    {RuleConversionUtils.convertDisplayDiscountValue(
                      customPriceType,
                      customPriceValue.toString(),
                    )}
                  </div>
                </IndexTable.Cell>
              </IndexTable.Row>
            ),
          )}
        </IndexTable>
      </LegacyCard>
      <ViewRuleModal pricingRule={choosenPricingRule} />
    </Box>
  );
}

export default RuleListTable;

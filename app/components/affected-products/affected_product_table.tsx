import {
  Badge,
  Box,
  EmptySearchResult,
  Icon,
  IndexTable,
  LegacyCard,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { ViewIcon } from "@shopify/polaris-icons";
import ProductActionPopover from "./product-action-popover";

import style from "./style.module.css";

// TODO: add hover on product name -> eye icon with blue (same as products page)

const AffectedProductTable = () => {
  return (
    <Box paddingBlockEnd="400">
      <LegacyCard>
        <IndexTable
          resourceName={{
            singular: "affected product",
            plural: "affected products",
          }}
          itemCount={1}
          emptyState={
            <Box paddingBlockStart={"1000"} paddingBlockEnd={"1000"}>
              <EmptySearchResult
                title={"No product affected by your pricing rules"}
                description={
                  "Try creating a new pricing rule or change your filters."
                }
                withIllustration
              />
            </Box>
          }
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
        >
          <IndexTable.Row rowType="data" id="1" key="1" position={1}>
            <IndexTable.Cell scope="row">
              <Box padding="100">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                  className={style["product-name"]}
                >
                  <Thumbnail
                    source={
                      "https://cdn.shopify.com/s/files/1/0704/5857/2965/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_40x40@3x.jpg?v=1743526901"
                    }
                    alt={"Snowboard with red and white design"}
                    size="small"
                  />
                  <Text as="span" fontWeight="semibold">
                    Red White Snowboard
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <Badge>{`${5} variants`}</Badge>
                    <div className={style["product-button"]}>
                      <Icon source={ViewIcon} />
                    </div>
                  </div>
                </div>
              </Box>
            </IndexTable.Cell>
            <IndexTable.Cell>
              {/* <Badge tone="new">{"Uneffected"}</Badge> */}
              <Badge tone="attention">{"Affected"}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">
                {"Winter sale 2023"}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell className="">
              <Text variant="bodyMd" as="span">
                {"All products sale"}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <ProductActionPopover />
            </IndexTable.Cell>
          </IndexTable.Row>
        </IndexTable>
      </LegacyCard>
    </Box>
  );
};

export default AffectedProductTable;

import {
  Bleed,
  BlockStack,
  Box,
  Button,
  Icon,
  ResourceItem,
  ResourceList,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import {
  SearchIcon,
  ImageIcon,
  XIcon,
  ProductAddIcon,
} from "@shopify/polaris-icons";
import { usePickedEntityStore } from "app/hooks/use_picked_entity_store";
import type { ProductType, SelectedType } from "app/types/app";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface ISearchProduct {
  loading: boolean;
}

const SearchProduct = ({ loading }: ISearchProduct) => {
  const [selectedProductIds, setSelectedProductIds] = useState<SelectedType[]>(
    [],
  );
  const [query, setQuery] = useState<string>("");

  const [debouncedQuery] = useDebounce(query, 500);

  const { selected, setSelected, error, setError } = usePickedEntityStore();

  useLayoutEffect(() => {
    if (selected.specific_products.length > 0) {
      setSelectedProductIds(selected.specific_products);
    }
  }, [selected.specific_products]);

  useEffect(() => {
    if (!debouncedQuery) return;

    pickProduct(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const pickProduct = useCallback(
    async (query?: string) => {
      const response = await shopify.resourcePicker({
        type: "product",
        action: "select",
        multiple: true,
        query: query,
        selectionIds: selectedProductIds,
        filter: {
          variants: false,
        },
      });

      if (!response) return;

      const products = (response as ProductType[]).map((product) => ({
        id: product.id,
        title: product.title,
        imageUrl:
          product.images.length > 0
            ? product.images[0]?.originalSrc
            : undefined,
      }));

      setSelectedProductIds(products);

      setSelected("specific_products", products);

      setError(null);
    },
    [selectedProductIds, setError, setSelected],
  );

  return (
    <BlockStack gap={"200"}>
      <Box paddingBlockStart="200">
        <TextField
          label=""
          disabled={loading}
          error={
            error && error?.type === "specific_products"
              ? error.message
              : undefined
          }
          value={query}
          onChange={(value) => setQuery(value)}
          prefix={<Icon source={SearchIcon} tone="base" />}
          placeholder="Search products"
          autoComplete="off"
          size="medium"
          connectedRight={
            <Button
              onClick={async () => {
                await pickProduct();
              }}
              disabled={loading}
            >
              Browse
            </Button>
          }
        />
      </Box>
      <Box paddingBlockEnd="200">
        {selectedProductIds.length === 0 ? (
          <Bleed>
            <BlockStack inlineAlign="center">
              <ProductAddIcon
                fill="#8a8a8a"
                style={{
                  width: "60px",
                  margin: "16px 0",
                }}
              />
            </BlockStack>
            <BlockStack align="center" inlineAlign="center" gap="050">
              <Text variant="bodyMd" as="p">
                There are no products selected.
              </Text>
              <Text variant="bodyMd" as="p">
                Search or browse to add products.
              </Text>
            </BlockStack>
          </Bleed>
        ) : (
          <ResourceList
            resourceName={{ singular: "product", plural: "products" }}
            items={selectedProductIds}
            renderItem={(item) => {
              return (
                <ResourceItem
                  id={item.id}
                  disabled={loading}
                  url={""}
                  media={
                    <Thumbnail
                      size="small"
                      source={item.imageUrl ?? ImageIcon}
                      alt={item.title}
                    />
                  }
                  accessibilityLabel={`View details for ${item.title}`}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      height: "100%",
                      marginTop: "8px",
                    }}
                  >
                    <Text variant="bodyMd" as="h3">
                      {item.title}
                    </Text>
                    <Button
                      variant="tertiary"
                      icon={XIcon}
                      disabled={loading}
                      accessibilityLabel="Add theme"
                      onClick={() => {
                        setSelectedProductIds((prev) =>
                          prev.filter((product) => product.id !== item.id),
                        );

                        setSelected(
                          "specific_products",
                          selectedProductIds.filter(
                            (product) => product.id !== item.id,
                          ),
                        );
                      }}
                    />
                  </div>
                </ResourceItem>
              );
            }}
          />
        )}
      </Box>
    </BlockStack>
  );
};

export default SearchProduct;

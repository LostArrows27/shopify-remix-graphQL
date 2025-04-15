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
  CollectionIcon,
} from "@shopify/polaris-icons";
import type { CollectionType, SelectedType } from "app/types/app";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const SearchCollection = () => {
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<
    SelectedType[]
  >([]);
  const [query, setQuery] = useState<string>("");

  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) return;

    pickCollections(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const pickCollections = useCallback(
    async (query?: string) => {
      const response = await shopify.resourcePicker({
        type: "collection",
        action: "select",
        multiple: true,
        query: query,
        selectionIds: selectedCollectionIds,
        filter: {
          variants: false,
        },
      });

      if (!response) return;

      setSelectedCollectionIds(
        (response as CollectionType[]).map((collection) => ({
          id: collection.id,
          title: collection.title,
          imageUrl: collection.image ? collection.image.originalSrc : undefined,
        })),
      );
    },
    [selectedCollectionIds],
  );

  return (
    <BlockStack gap={"200"}>
      <Box paddingBlockStart="200">
        <TextField
          label=""
          value={query}
          onChange={(value) => setQuery(value)}
          prefix={<Icon source={SearchIcon} tone="base" />}
          placeholder="Search collections"
          autoComplete="off"
          size="medium"
          connectedRight={
            <Button
              onClick={async () => {
                await pickCollections();
              }}
            >
              Browse
            </Button>
          }
        />
      </Box>
      <Box paddingBlockEnd="200">
        {selectedCollectionIds.length === 0 ? (
          <Bleed>
            <BlockStack inlineAlign="center">
              <CollectionIcon
                fill="#8a8a8a"
                style={{
                  width: "60px",
                  margin: "16px 0",
                }}
              />
            </BlockStack>
            <BlockStack align="center" inlineAlign="center" gap="050">
              <Text variant="bodyMd" as="p">
                There are no collections selected.
              </Text>
              <Text variant="bodyMd" as="p">
                Search or browse to add collections.
              </Text>
            </BlockStack>
          </Bleed>
        ) : (
          <ResourceList
            resourceName={{ singular: "collection", plural: "collections" }}
            items={selectedCollectionIds}
            renderItem={(item) => {
              return (
                <ResourceItem
                  id={item.id}
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
                      accessibilityLabel="Add theme"
                      onClick={() => {
                        setSelectedCollectionIds((prev) =>
                          prev.filter(
                            (collection) => collection.id !== item.id,
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

export default SearchCollection;

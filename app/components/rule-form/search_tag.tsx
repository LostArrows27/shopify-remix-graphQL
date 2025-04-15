import {
  Autocomplete,
  Tag,
  BlockStack,
  InlineStack,
  Box,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { PlusCircleIcon } from "@shopify/polaris-icons";
import { titleCase } from "app/utils/title_case";
import { TagsService } from "app/service/tags_service";

type Option = {
  value: string;
  label: string;
};

function SearchTag() {
  const [deselectedOptions, setDeselectedOptions] = useState<Option[]>([]);

  const [startCursor, setStartCursor] = useState("cursor");

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [willLoadMoreResults, setWillLoadMoreResults] = useState(true);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);

    const data = await TagsService.fetchPaginated(startCursor);

    if (data.status == "error") {
      setIsLoading(false);
      return;
    }

    const newOptions = data.data.productTags.map((tag) => ({
      value: tag,
      label: tag,
    }));

    if (startCursor === "cursor") {
      setDeselectedOptions(newOptions);
      setOptions(newOptions);
    } else {
      setDeselectedOptions((prev) => [...prev, ...newOptions]);
      setOptions((prev) => [...prev, ...newOptions]);
    }

    setStartCursor(data.data.pageInfo.startCursor);

    setWillLoadMoreResults(data.data.pageInfo.hasNextPage);

    setIsLoading(false);
  }, [startCursor]);

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMoreResults = useCallback(async () => {
    if (willLoadMoreResults && !isLoading) {
      await fetchTags();
    }
  }, [willLoadMoreResults, isLoading, fetchTags]);

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions],
  );

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );

      setOptions(resultOptions);
    },
    [deselectedOptions],
  );

  const createTag = useCallback(async () => {
    if (
      inputValue === "" ||
      deselectedOptions.map((option) => option.label).includes(inputValue)
    ) {
      return;
    }

    setIsLoading(true);
    await TagsService.createTag(inputValue);
    setIsLoading(false);

    setDeselectedOptions((prev) => [
      ...prev,
      {
        value: inputValue,
        label: inputValue,
      },
    ]);

    setOptions((prev) => [
      ...prev,
      {
        value: inputValue,
        label: inputValue,
      },
    ]);
    setSelectedOptions((prev) => [...prev, inputValue]);
  }, [deselectedOptions, inputValue]);

  return (
    <Box paddingBlockStart={"100"}>
      <BlockStack gap={"300"}>
        <Autocomplete
          actionBefore={{
            accessibilityLabel: "Action label",
            content: `Add ${inputValue}`,
            ellipsis: true,
            helpText: "Create a new tag",
            icon: PlusCircleIcon,
            onAction: createTag,
          }}
          allowMultiple
          options={options}
          selected={selectedOptions}
          textField={
            <Autocomplete.TextField
              onChange={updateText}
              label=""
              value={inputValue}
              placeholder="Search tags"
              autoComplete="on"
            />
          }
          onSelect={setSelectedOptions}
          listTitle="Suggested Tags"
          loading={isLoading}
          onLoadMoreResults={handleLoadMoreResults}
          willLoadMoreResults={willLoadMoreResults}
        />
        {selectedOptions.length > 0 ? (
          <InlineStack gap={"200"}>
            {selectedOptions.map((option) => {
              let tagLabel = "";
              tagLabel = option.replace("_", " ");
              tagLabel = titleCase(tagLabel);
              return (
                <Tag key={`option${option}`} onRemove={removeTag(option)}>
                  {tagLabel}
                </Tag>
              );
            })}
          </InlineStack>
        ) : null}
      </BlockStack>
    </Box>
  );
}

export default SearchTag;

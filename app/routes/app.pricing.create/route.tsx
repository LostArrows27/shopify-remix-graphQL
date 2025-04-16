import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useBlocker, useFetcher } from "@remix-run/react";
import {
  BlockStack,
  Card,
  Page,
  Select,
  TextField,
  Text,
  Box,
  RadioButton,
  ChoiceList,
  Modal,
  Badge,
} from "@shopify/polaris";
import SearchCollection from "app/components/rule-form/search_collection";
import SearchProduct from "app/components/rule-form/search_product";
import { appliedProductTypeList, priceTypeList } from "app/constants/constants";
import { pricingRuleSchema } from "app/schema/pricing_rule_schema";
import type { PricingRuleFormData } from "app/types/app";
import type { AppliedProductType, CustomPriceType } from "app/types/enum";
import { getAmountPrefix } from "app/utils/get_amount_prefix";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import tagImage from "../../assets/images/tag.svg";
import SearchTag from "app/components/rule-form/search_tag";
import { usePickedEntityStore } from "app/hooks/use_picked_entity_store";
import { PricingRuleService } from "app/service/pricing_rule_service.server";
import { authenticate } from "app/shopify.server";
import { ShopifyService } from "app/service/shopify_service.server";
import { showToast } from "app/utils/show_toast";

export function links() {
  return [
    {
      rel: "preload",
      href: tagImage,
      as: "image",
    },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    if (request.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const formData = await request.formData();

    const data = Object.fromEntries(formData.entries());

    const selectedIds = JSON.parse(data.selectedIds as string) as string[];
    const ruleInformation = JSON.parse(
      data.ruleInformation as string,
    ) as PricingRuleFormData;

    const { admin } = await authenticate.admin(request);

    const shopName = await ShopifyService.getShopifyShopName(admin);

    const res = await PricingRuleService.createPricingRule(
      selectedIds,
      ruleInformation,
      shopName,
    );

    return res;
  } catch (error) {
    console.error("Error creating pricing rule:", error);
    return {
      message: "Error creating pricing rule",
      status: "error",
    };
  }
}

export const Create = () => {
  const { selected, setError, reset: resetEntity } = usePickedEntityStore();

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname,
  );

  const fetcher = useFetcher();
  const loading = fetcher.state !== "idle";
  const formResponse = fetcher.data as
    | Awaited<ReturnType<typeof action>>
    | undefined;

  // NOTE: leave page modal
  const [active, setActive] = useState(false);

  const toggleModal = useCallback(() => setActive((active) => !active), []);

  // NOTE: form validation

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    clearErrors,
    trigger,
    reset,
  } = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      name: "",
      priority: 0,
      status: "enable",
      priceType: "fixed",
      appliedProductType: "all",
      amount: 0,
    },
  });

  const currentPriceType = watch("priceType");

  const onSubmit = handleSubmit(
    (data: PricingRuleFormData) => {
      let selectedIds: string[] = [];

      if (data.appliedProductType !== "all") {
        const selectedData =
          selected[data.appliedProductType as keyof typeof selected];

        if (selectedData.length === 0) {
          setError({
            message: `Please select at least one item.`,
            type: data.appliedProductType as AppliedProductType,
          });
          return;
        }

        selectedIds = selectedData.map((item) => item.id);
      }

      fetcher.submit(
        {
          ruleInformation: JSON.stringify(data),
          selectedIds: JSON.stringify(selectedIds),
        },
        {
          method: "post",
          action: "/app/pricing/create",
        },
      );
    },
    (errors) => {
      for (const path of Object.keys(errors)) {
        console.log(`error at ${path}`, errors[path as keyof typeof errors]);
      }
    },
  );

  const renderChildren = useCallback(
    (type: AppliedProductType): ReactNode => {
      switch (type) {
        case "specific_products":
          return <SearchProduct loading={loading} />;
        case "collections":
          return <SearchCollection loading={loading} />;
        case "tags":
          return <SearchTag loading={loading} />;
        default:
          return (
            <div
              style={{
                height: "10px",
              }}
            ></div>
          );
      }
    },
    [loading],
  );

  useEffect(() => {
    if (!!blocker.state && blocker.state === "blocked" && isDirty) {
      toggleModal();
      return;
    }

    if (blocker.state === "blocked" && !isDirty) {
      blocker.proceed();
    }
  }, [blocker, isDirty, toggleModal]);

  // NOTE: clear errors when price type not %
  useEffect(() => {
    if (
      errors.amount?.type === z.ZodIssueCode.custom &&
      currentPriceType !== "decrease_percentage"
    ) {
      clearErrors("amount");
    }
  }, [currentPriceType, errors.amount, clearErrors, trigger]);

  useEffect(() => {
    if (formResponse?.status === "success" && !loading) {
      reset();
      resetEntity();
      showToast("Pricing rule created successfully! 🎉");
      return;
    }

    if (formResponse?.status === "error" && formResponse?.message && !loading) {
      showToast(formResponse?.message, {
        isError: true,
      });
    }
  }, [formResponse, loading, reset, resetEntity]);

  return (
    <Page
      backAction={{ content: "Home", url: "/app" }}
      title="New Pricing Rule"
      titleMetadata={<Badge tone="success">New</Badge>}
      primaryAction={{
        disabled: loading,
        content: "Save",
        onAction: () => {
          onSubmit();
        },
      }}
    >
      {/* pricing rule form */}
      <Box paddingBlockStart={"400"} paddingBlockEnd={"600"}>
        <fetcher.Form method="post" action="/app/pricing/create">
          <BlockStack gap={"400"}>
            {/* general information */}
            <Card padding={"500"} roundedAbove="sm">
              <BlockStack gap={"400"}>
                <Text variant="headingMd" as="h3">
                  General Information
                </Text>
                <Box>
                  <BlockStack gap="400">
                    <Controller
                      render={({ field }) => (
                        <TextField
                          disabled={loading}
                          label="Name"
                          error={errors.name?.message}
                          autoComplete="on"
                          {...field}
                        />
                      )}
                      name="name"
                      control={control}
                    />
                    <Controller
                      render={({ field }) => (
                        <TextField
                          disabled={loading}
                          label="Priority"
                          type="number"
                          autoComplete="on"
                          value={field.value + "" || ""}
                          onChange={field.onChange}
                          error={errors.priority?.message}
                        />
                      )}
                      name="priority"
                      control={control}
                    />
                    <Controller
                      disabled={loading}
                      render={({ field }) => (
                        <Select
                          label="Status"
                          options={[
                            {
                              label: "Enable",
                              value: "enable",
                            },
                            {
                              label: "Disable",
                              value: "disable",
                            },
                          ]}
                          {...field}
                        />
                      )}
                      name="status"
                      control={control}
                    />
                  </BlockStack>
                </Box>
              </BlockStack>
            </Card>
            {/* apply to product */}
            <Card padding={"500"} roundedAbove="sm">
              <BlockStack gap={"400"}>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h3">
                    Apply to Products
                  </Text>
                  <Box>
                    <Controller
                      render={({ field }) => (
                        <ChoiceList
                          disabled={loading}
                          title=""
                          choices={appliedProductTypeList.map((item) => ({
                            ...item,
                            renderChildren: (isSelected) => {
                              return isSelected ? (
                                renderChildren(item.value)
                              ) : (
                                <div
                                  style={{
                                    height: "10px",
                                  }}
                                ></div>
                              );
                            },
                          }))}
                          selected={[field.value]}
                          onChange={(selected) => {
                            field.onChange(selected[0]);
                            setError(null);
                          }}
                          error={errors.appliedProductType?.message}
                          allowMultiple={false}
                        />
                      )}
                      name="appliedProductType"
                      control={control}
                    />
                  </Box>
                </BlockStack>
              </BlockStack>
            </Card>
            {/* custom prices */}
            <Card padding={"500"} roundedAbove="sm">
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Custom prices
                </Text>
                <Box>
                  <Controller
                    render={({ field }) => (
                      <BlockStack gap={"200"}>
                        {priceTypeList.map((item, index) => (
                          <RadioButton
                            disabled={loading}
                            key={index}
                            id={item.id}
                            label={item.name}
                            checked={item.id === field.value}
                            onChange={(
                              _: boolean,
                              newValue: CustomPriceType,
                            ) => {
                              field.onChange(newValue);
                            }}
                          />
                        ))}
                      </BlockStack>
                    )}
                    name="priceType"
                    control={control}
                  />
                  <Box paddingBlockStart={"400"}>
                    <Controller
                      render={({ field }) => (
                        <TextField
                          label="Amount"
                          disabled={loading}
                          type="number"
                          prefix={getAmountPrefix(currentPriceType)}
                          value={field.value + "" || ""}
                          onChange={field.onChange}
                          autoComplete="on"
                          error={errors.amount?.message}
                        />
                      )}
                      name="amount"
                      control={control}
                    />
                  </Box>
                </Box>
              </BlockStack>
            </Card>
          </BlockStack>
        </fetcher.Form>
      </Box>
      {/* leave page confirm modal */}
      <Modal
        activator={undefined}
        open={active}
        onClose={toggleModal}
        title="Discard all unsaved changes"
        primaryAction={{
          destructive: true,
          content: "Leave page",
          onAction: () => {
            if (blocker.state === "blocked") {
              blocker.proceed();
            }
          },
        }}
        secondaryActions={[
          {
            content: "Continue editing",
            onAction: toggleModal,
          },
        ]}
      >
        <Modal.Section>
          <Text variant="bodyMd" as="p">
            Are you sure you want to leave this page? All unsaved changes will
            be lost.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
};

export default Create;

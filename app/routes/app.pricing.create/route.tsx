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
  const formData = await request.formData();

  const data = Object.fromEntries(formData.entries());

  console.log(data);

  return null;
}

export const Create = () => {
  // NOTE: leave page modal
  const [active, setActive] = useState(false);

  const toggleModal = useCallback(() => setActive((active) => !active), []);

  // NOTE: form validation

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    trigger,
  } = useForm<PricingRuleFormData>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      name: "",
      priority: 0,
      status: "enable",
      priceType: "fixed",
      appliedProductType: "all",
    },
  });

  const currentPriceType = watch("priceType");

  const fetcher = useFetcher();

  const onSubmit = handleSubmit(
    (data: PricingRuleFormData) => {
      console.log(data);
      fetcher.submit(data, {
        method: "post",
        action: "/app/pricing/create",
      });
    },
    (errors) => {
      for (const path of Object.keys(errors)) {
        console.log(`error at ${path}`, errors[path as keyof typeof errors]);
      }
    },
  );

  const renderChildren = useCallback((type: AppliedProductType): ReactNode => {
    switch (type) {
      case "specific_products":
        return <SearchProduct />;
      case "collections":
        return <SearchCollection />;
      case "tags":
        return <SearchTag />;
      default:
        return null;
    }
  }, []);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!!blocker.state && blocker.state === "blocked") {
      toggleModal();
    }
  }, [blocker, toggleModal]);

  // NOTE: clear errors when price type not %
  useEffect(() => {
    if (
      errors.amount?.type === z.ZodIssueCode.custom &&
      currentPriceType !== "decrease_percentage"
    ) {
      clearErrors("amount");
    }
  }, [currentPriceType, errors.amount, clearErrors, trigger]);

  return (
    <Page
      backAction={{ content: "Home", url: "/app" }}
      title="New Pricing Rule"
      primaryAction={{
        content: "Save",
        onAction: () => {
          onSubmit();
        },
      }}
    >
      {/* pricing rule form */}
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
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3">
                Apply to Products
              </Text>
              <Box>
                <Controller
                  render={({ field }) => (
                    <ChoiceList
                      title="Discount minimum requirements"
                      choices={appliedProductTypeList.map((item) => ({
                        ...item,
                        renderChildren: (isSelected) => {
                          return isSelected ? renderChildren(item.value) : null;
                        },
                      }))}
                      selected={[field.value]}
                      onChange={(selected) => {
                        field.onChange(selected[0]);
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
                          key={index}
                          id={item.id}
                          label={item.name}
                          checked={item.id === field.value}
                          onChange={(_: boolean, newValue: CustomPriceType) => {
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

import { type CurrencyFormatOptions, useI18n } from "@shopify/react-i18n";

export const useFormatCurrency = () => {
  const [i18n] = useI18n();

  const formatCurrency = (
    value: number | string,
    form: CurrencyFormatOptions["form"] = "short",
  ) => {
    if (typeof value === "string") {
      value = parseFloat(value);
    }

    return i18n.formatCurrency(value, {
      currency: "USD",
      form: form,
      as: "currency",
    });
  };

  return {
    formatCurrency,
  };
};

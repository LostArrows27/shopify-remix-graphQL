import { useI18n } from "@shopify/react-i18n";

export const useFormatCurrency = () => {
  const [i18n] = useI18n();

  const formatCurrency = (value: number | string) => {
    if (typeof value === "string") {
      value = parseFloat(value);
    }

    return i18n.formatCurrency(value, {
      currency: "USD",
      form: "short",
      as: "currency",
    });
  };

  return {
    formatCurrency,
  };
};

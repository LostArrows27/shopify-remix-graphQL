export const getAmountPrefix = (priceType: string) => {
  switch (priceType) {
    case "fixed":
    case "decrease_amount":
      return "$";
    case "decrease_percentage":
      return "%";
    default:
      return "";
  }
};

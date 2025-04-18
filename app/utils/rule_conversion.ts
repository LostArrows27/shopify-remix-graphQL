import type { AppliedProductType, CustomPriceType } from "app/types/enum";

export class RuleConversionUtils {
  static convertDisplayApplyRule(applied: AppliedProductType) {
    switch (applied) {
      case "all":
        return "All products";
      case "specific_products":
        return "Specific products";
      case "collections":
        return "Collections";
      case "tags":
        return "Product tags";
      default:
        return "Other";
    }
  }

  static convertDisplayCustomPriceType(customPriceType: CustomPriceType) {
    switch (customPriceType) {
      case "fixed":
        return "fixed product price";
      case "decrease_amount":
        return "decrease fixed amount";
      case "decrease_percentage":
        return "decrease by percentage";
      default:
        return "Other";
    }
  }

  static convertDisplayDiscountValue(
    customPriceType: CustomPriceType,
    value: string,
  ) {
    switch (customPriceType) {
      case "fixed":
        return `$${value}`;
      case "decrease_amount":
        return `-$${value}`;
      case "decrease_percentage":
        return `${value}%`;
      default:
        return value;
    }
  }

  static displayDiscountDescription(
    customPriceType: CustomPriceType,
    value: string,
  ) {
    switch (customPriceType) {
      case "fixed":
        return `Apply fixed price of $${value}.`;
      case "decrease_amount":
        return `Decrease price by $${value}.`;
      case "decrease_percentage":
        return `Decrease price by ${value}%.`;
      default:
        return value;
    }
  }

  static changePriceAfterDiscount(
    originalPrice: string | number,
    customPriceType?: CustomPriceType,
    customPriceValue?: string,
  ) {
    if (typeof originalPrice === "string") {
      originalPrice = parseFloat(originalPrice);
    }

    if (!customPriceType || !customPriceValue) {
      return originalPrice;
    }

    let value = originalPrice;

    switch (customPriceType) {
      case "fixed":
        value = parseFloat(customPriceValue);
        break;
      case "decrease_amount":
        value = originalPrice - parseFloat(customPriceValue);
        break;
      case "decrease_percentage":
        value =
          originalPrice - (originalPrice * parseFloat(customPriceValue)) / 100;
        break;
      default:
        value = originalPrice;
    }

    return value < 0 ? 0 : value;
  }
}

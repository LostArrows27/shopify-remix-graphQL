import type { AppliedProductTypeList } from "app/types/app";

export const priceTypeList = [
  {
    id: "fixed",
    name: "Apply a price to selected products",
  },
  {
    id: "decrease_amount",
    name: "Decrease a fixed amount of the original prices of selected products",
  },
  {
    id: "decrease_percentage",
    name: "Decrease the original prices of selected products by a percentage (%)",
  },
];

export const appliedProductTypeList: AppliedProductTypeList = [
  {
    label: "All products",
    value: "all",
  },
  {
    label: "Specific products",
    value: "specific_products",
  },
  {
    label: "Product collections",
    value: "collections",
  },
  {
    label: "Product tags",
    value: "tags",
  },
];

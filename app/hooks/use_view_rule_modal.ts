import type { PricingRule } from "app/types/app";
import { create } from "zustand";

type ViewRuleModalStore = {
  pricingRule: PricingRule | undefined;
  setPricingRule: (pricingRule: PricingRule | undefined) => void;
  closeModal: () => void;
  openModal: (pricingRule: PricingRule) => void;
};

export const useViewRuleModalStore = create<ViewRuleModalStore>((set) => ({
  pricingRule: undefined,
  setPricingRule: (pricingRule) => set({ pricingRule }),
  closeModal: () => {
    set({ pricingRule: undefined });
    shopify.modal.hide("view-rule-modal");
  },
  openModal: (pricingRule) => {
    set({ pricingRule });
    shopify.modal.show("view-rule-modal");
  },
}));

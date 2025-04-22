import type { PricingRule } from "app/types/app";
import { create } from "zustand";

type ActiveRuleModalProps = {
  pricingRules: PricingRule[] | undefined;
  setPricingRule: (pricingRules: PricingRule[]) => void;
  closeModal: () => void;
  openModal: (pricingRules: PricingRule[]) => void;
};

export const useActiveRuleModal = create<ActiveRuleModalProps>((set) => ({
  pricingRules: undefined,
  setPricingRule: (pricingRules) => set({ pricingRules }),
  closeModal: () => {
    set({ pricingRules: undefined });
    shopify.modal.hide("active-rule-modal");
  },
  openModal: (pricingRules) => {
    set({ pricingRules });
    shopify.modal.show("active-rule-modal");
  },
}));

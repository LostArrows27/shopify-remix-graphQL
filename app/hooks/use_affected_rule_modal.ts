import type { AffectedProductWithRuleData } from "app/types/server";
import { create } from "zustand";

type ProductData = AffectedProductWithRuleData[number];

type AffectedRuleModalProps = {
  productData: ProductData | undefined;
  setPricingRule: (productData: ProductData | undefined) => void;
  closeModal: () => void;
  openModal: (productData: ProductData) => void;
};

export const useAffectedRuleModal = create<AffectedRuleModalProps>((set) => ({
  productData: undefined,
  setPricingRule: (productData) => set({ productData }),
  closeModal: () => {
    set({ productData: undefined });
    shopify.modal.hide("affected-rule-modal");
  },
  openModal: (productData) => {
    set({ productData });
    shopify.modal.show("affected-rule-modal");
  },
}));

import type { SelectedType } from "app/types/app";
import type { AppliedProductType } from "app/types/enum";
import { create } from "zustand";

type ErrorType = {
  type: AppliedProductType;
  message: string;
} | null;

type PickedEntityStore = {
  selected: {
    specific_products: SelectedType[];
    collections: SelectedType[];
    tags: SelectedType[];
  };
  setSelected: (type: AppliedProductType, ids: SelectedType[]) => void;
  error: ErrorType;
  setError: (error: ErrorType) => void;
  reset: () => void;
};

export const usePickedEntityStore = create<PickedEntityStore>((set) => ({
  selected: {
    specific_products: [],
    collections: [],
    tags: [],
  },
  setSelected: (type, ids) =>
    set((state) => {
      const newState = { ...state.selected };
      newState[type as keyof typeof newState] = ids;
      return { selected: newState };
    }),
  error: null,
  setError: (error) => set({ error }),
  reset: () =>
    set({
      selected: {
        specific_products: [],
        collections: [],
        tags: [],
      },
      error: null,
    }),
}));

import { create } from "zustand";
import type { Merchant, Payment } from "../types/types";

export type CommonData = Record<string, any> | null;

type State = {
  merchants: Merchant[] | null;
  payments: Payment[] | null;
  common: CommonData;
  setMerchants: (v: Merchant[] | null) => void;
  setPayments: (v: Payment[] | null) => void;
  setCommon: (v: CommonData) => void;
  clearAll: () => void;
};

export const useStore = create<State>(
  (
    set: (partial: Partial<State> | ((state: State) => Partial<State>)) => void
  ) => ({
    merchants: null,
    payments: null,
    common: null,
    setMerchants: (v: Merchant[] | null) => set({ merchants: v }),
    setPayments: (v: Payment[] | null) => set({ payments: v }),
    setCommon: (v: CommonData) => set({ common: v }),
    clearAll: () => set({ merchants: null, payments: null, common: null }),
  })
);

export default useStore;

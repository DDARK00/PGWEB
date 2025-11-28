import { create } from "zustand";
import type { Merchant, Payment } from "../types/types";

// `common`은 서버에서 구조화되지 않은 임의의 키/값 페이로드를 받을 수 있습니다.
// 가능한 경우 더 구체적인 타입으로 대체하세요. 현재는 `unknown` 기반의 레코드로 정의합니다.
export type CommonData = Record<string, unknown> | null;

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

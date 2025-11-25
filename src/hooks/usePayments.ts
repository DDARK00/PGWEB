import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { payments as paymentsApi } from "../apis";
import { useStore } from "../store/useStore";
import type { Payment } from "../types/types";

export function usePaymentsQuery(enabled = true) {
  const setPayments = useStore((s) => s.setPayments);

  const query = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await paymentsApi.getPayments("list");
      if (!res) throw new Error("Failed to fetch payments");
      return res ?? null;
    },
    enabled,
    retry: 1,
  });

  // zustand의 store와 sync 하기 위해 useEffect 사용
  useEffect(() => {
    if (query.data !== undefined) {
      setPayments((query.data as unknown as Payment[]) ?? null);
    }
  }, [query.data, setPayments]);

  return query;
}

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { merchants as merchantsApi } from "../apis";
import { useStore } from "../store/useStore";
import type { Merchant } from "../types/types";

export function useMerchantsQuery(enabled = true) {
  const setMerchants = useStore((s) => s.setMerchants);

  const query = useQuery({
    queryKey: ["merchants"],
    queryFn: async () => {
      const res = await merchantsApi.getMerchant("list");
      if (!res) throw new Error("Failed to fetch merchants");
      return res ?? null;
    },
    enabled,
    retry: 1,
  });

  // zusand의 store와 sync 하기 위해 useEffect 사용
  useEffect(() => {
    if (query.data !== undefined && query.data !== null) {
      console.log("Merchants fetched:", query.data);
      setMerchants((query.data as unknown as Merchant[]) ?? null);
    }
  }, [query.data, setMerchants]);

  return query;
}

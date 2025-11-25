import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { common as commonApi } from "../apis";
import { useStore } from "../store/useStore";

export function useCommonQuery(enabled = true) {
  const setCommon = useStore((s) => s.setCommon);

  const query = useQuery({
    queryKey: ["common"],
    queryFn: async () => {
      const res = await commonApi.getConfig();
      if (!res.success) throw new Error(res.error.message);
      return res.data ?? null;
    },
    enabled,
    retry: 0,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setCommon(query.data as Record<string, any>);
    }
  }, [query.data, setCommon]);

  return query;
}

import { useMemo, useState, useCallback } from "react";
import type { Payment } from "../types/types";

export type SortKey = "paymentCode" | "mchtCode" | "amount" | "paymentAt";
export type SortDirection = "asc" | "desc" | "default";

export default function useFilterSortPayments(initialItems: Payment[] = []) {
  const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");
  const [payTypeFilters, setPayTypeFilters] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("default");

  const togglePayType = useCallback((p: string) => {
    setPayTypeFilters((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setStatusFilter("ALL");
    setPayTypeFilters([]);
    setSortKey(null);
    setSortDirection("default");
  }, []);

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey !== key) {
        setSortDirection("desc");
        return key;
      }
      setSortDirection((prev) =>
        prev === "default" ? "asc" : prev === "asc" ? "desc" : "default"
      );
      return key;
    });
  }, []);

  const filtered = useMemo(() => {
    return initialItems.filter((p) => {
      // status filter
      if (statusFilter && statusFilter !== "ALL") {
        if (!p.status) return false;
        if (
          String(p.status).toUpperCase() !== String(statusFilter).toUpperCase()
        )
          return false;
      }

      // payType filters (multi-select)
      if (payTypeFilters && payTypeFilters.length > 0) {
        if (!p.payType) return false;
        if (
          !payTypeFilters
            .map((x) => x.toUpperCase())
            .includes(p.payType.toUpperCase())
        )
          return false;
      }

      return true;
    });
  }, [initialItems, statusFilter, payTypeFilters]);

  const availablePayTypes = useMemo(() => {
    const set = new Set<string>();
    for (const p of initialItems) if (p.payType) set.add(String(p.payType));
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [initialItems]);

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    for (const p of initialItems) if (p.status) set.add(String(p.status));
    return Array.from(set).map((v) => ({
      value: v,
      label: String(v).toUpperCase(),
    }));
  }, [initialItems]);

  const sorted = useMemo(() => {
    if (!sortKey || sortDirection === "default") return filtered;

    const multiplier = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];

      if (av === undefined || av === null) return 1 * multiplier;
      if (bv === undefined || bv === null) return -1 * multiplier;

      // amount might be numeric in string form
      if (sortKey === "amount") {
        const na = parseFloat(String(av).replace(/[^0-9.-]+/g, "")) || 0;
        const nb = parseFloat(String(bv).replace(/[^0-9.-]+/g, "")) || 0;
        return (na - nb) * multiplier;
      }

      if (sortKey === "paymentAt") {
        const da = Date.parse(String(av)) || 0;
        const db = Date.parse(String(bv)) || 0;
        return (da - db) * multiplier;
      }

      return String(av).localeCompare(String(bv)) * multiplier;
    });
  }, [filtered, sortKey, sortDirection]);

  return {
    items: sorted,
    statusFilter,
    setStatusFilter,
    payTypeFilters,
    togglePayType,
    resetFilters,
    sortKey,
    sortDirection,
    toggleSort,
    availablePayTypes,
    availableStatuses,
  } as const;
}

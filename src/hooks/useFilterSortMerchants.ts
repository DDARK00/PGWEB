import { useMemo, useState, useCallback } from "react";
import type { Merchant } from "../types/types";

export type SortKey = "mchtCode" | "bizType" | "mchtName";
export type SortDirection = "asc" | "desc" | "default";

// Status 맵핑
const STATUS_MAP: Record<string, number> = {
  READY: 0,
  ACTIVE: 1,
  CLOSED: 2,
};

export type StatusOption = { value: string; label: string };

export default function useFilterSortMerchants(
  initialItems: Merchant[] = [],
  externalStatuses?: { value: string; label: string }[]
) {
  const [statusFilter, setStatusFilter] = useState<string | "ALL">("ALL");
  const [bizTypeFilters, setBizTypeFilters] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("default");

  const toggleBizType = useCallback((b: string) => {
    setBizTypeFilters((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setStatusFilter("ALL");
    setBizTypeFilters([]);
    setSortKey(null);
    setSortDirection("default");
  }, []);

  // column 클릭 시의 정렬 설정: default -> asc -> desc -> default
  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey !== key) {
        // new key: set asc
        setSortDirection("desc");
        return key;
      }

      // same key: rotate direction
      setSortDirection((prev) =>
        prev === "default" ? "asc" : prev === "asc" ? "desc" : "default"
      );
      // default일 때 clear
      return key;
    });
  }, []);

  const filtered = useMemo(() => {
    return initialItems.filter((m) => {
      // status filter
      if (statusFilter && statusFilter !== "ALL") {
        const s = (m as any).status;
        if (String(s) !== String(statusFilter)) return false;
      }

      // bizType 필터 (multi-select). 선택 없음-> all
      if (bizTypeFilters && bizTypeFilters.length > 0) {
        if (!m.bizType) return false;

        const b = m.bizType.toUpperCase();
        if (!bizTypeFilters.map((x) => x.toUpperCase()).includes(b))
          return false;
      }

      return true;
    });
  }, [initialItems, statusFilter, bizTypeFilters]);

  // compute available biz types and statuses based on data so the UI reflects server data
  const availableBizTypes = useMemo(() => {
    const set = new Set<string>();
    for (const m of initialItems) if (m.bizType) set.add(String(m.bizType));
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [initialItems]);

  const availableStatuses: StatusOption[] = useMemo(() => {
    if (externalStatuses && externalStatuses.length > 0)
      return externalStatuses;

    const map = new Map<string, string>();
    for (const m of initialItems) {
      const raw = (m as any).status;
      const value = String(raw);
      // prefer mapping to friendly label if in STATUS_MAP
      const numeric = typeof raw === "number" ? raw : Number(raw);
      const mappedKey = Object.keys(STATUS_MAP).find(
        (k) => STATUS_MAP[k] === numeric
      );
      const label = mappedKey ? mappedKey : value.toUpperCase?.() ?? value;
      map.set(value, label);
    }
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [initialItems, externalStatuses]);

  // 필터 내의 정렬 로직
  const sorted = useMemo(() => {
    if (!sortKey || sortDirection === "default") return filtered;

    const multiplier = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];

      if (av === undefined || av === null) return 1 * multiplier;
      if (bv === undefined || bv === null) return -1 * multiplier;

      // numeric vs string
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * multiplier;
      return String(av).localeCompare(String(bv)) * multiplier;
    });
  }, [filtered, sortKey, sortDirection]);

  return {
    items: sorted,
    statusFilter,
    setStatusFilter,
    bizTypeFilters,
    toggleBizType,
    resetFilters,
    sortKey,
    sortDirection,
    toggleSort,
    // computed options
    availableBizTypes,
    availableStatuses,
  } as const;
}

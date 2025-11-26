import { useMemo, useState } from "react";
import { useMerchantsQuery } from "../hooks/useMerchants";
import useStore from "../store/useStore";
import useFilterSortMerchants from "../hooks/useFilterSortMerchants";
import { MerchantFilterBar, MerchantTable } from "../components/merchants";

function MerchantListPage() {
  const query = useMerchantsQuery();
  const merchants = useStore((s) => s.merchants);

  const list = useMemo(
    () => merchants ?? query.data ?? [],
    [merchants, query.data]
  );

  const [search, setSearch] = useState("");

  // Apply search first (name / code) then hand off to the hook which performs status/bizType filters and sorting
  const searched = useMemo(() => {
    if (!search) return list ?? [];
    const q = search.trim().toLowerCase();
    return (list ?? []).filter(
      (m) =>
        (m.mchtName ?? "").toLowerCase().includes(q) ||
        m.mchtCode.toLowerCase().includes(q)
    );
  }, [list, search]);

  const {
    items,
    bizTypeFilters,
    statusFilter,
    setStatusFilter,
    toggleBizType,
    resetFilters,
    sortKey,
    sortDirection,
    toggleSort,
    availableBizTypes,
    availableStatuses,
  } = useFilterSortMerchants(searched);

  if (query.isLoading) return <div>Loading merchants...</div>;
  if (query.isError) return <div>Error loading merchants</div>;

  return (
    <div
      style={{ paddingLeft: "10%", paddingRight: "10%" }}
      className="flex-1 min-h-full py-6 flex flex-col"
    >
      <h1 className="text-2xl font-bold mb-4">가맹점 조회</h1>

      <div className="space-y-3 flex flex-col h-full grow">
        <MerchantFilterBar
          status={statusFilter}
          onStatusChange={(s) => setStatusFilter(s)}
          bizTypes={bizTypeFilters}
          availableBizTypes={availableBizTypes}
          availableStatuses={availableStatuses}
          onToggleBizType={(b) => toggleBizType(b)}
          onReset={resetFilters}
          onSearch={(q) => setSearch(q)}
        />

        <MerchantTable
          items={items}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
        />
      </div>
    </div>
  );
}

export default MerchantListPage;

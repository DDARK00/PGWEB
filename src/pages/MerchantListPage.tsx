import { useMemo, useState } from "react";
import type { Merchant, MerchantDetail } from "../types/types";
import { useMerchantsQuery } from "../hooks/useMerchants";
import useStore from "../store/useStore";
import useFilterSortMerchants from "../hooks/useFilterSortMerchants";
import { common as commonApi } from "../apis";
import { useQuery } from "@tanstack/react-query";
import { MerchantFilterBar, MerchantTable } from "../components/merchants";
import MerchantDetailPanel from "../components/merchants/MerchantDetailPanel";
import { getDetailMerchant } from "../apis/merchants";

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

  const mchtStatusQuery = useQuery({
    queryKey: ["common", "mchtStatus"],
    queryFn: () => commonApi.getMchtStatus(),
    enabled: true,
  });

  const apiStatuses = useMemo(
    () =>
      mchtStatusQuery.data?.data?.data?.map((s: any) => ({
        value: String(s.code),
        label: String(s.description ?? s.code),
      })) ?? undefined,
    [mchtStatusQuery.data]
  );

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
  } = useFilterSortMerchants(searched, apiStatuses);

  // selected merchant detail state
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [detail, setDetail] = useState<MerchantDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const onRowClick = async (m: Merchant) => {
    const code = m.mchtCode;
    setSelectedCode(code);
    setDetail(null);
    setDetailError(null);
    setLoadingDetail(true);
    try {
      const res = await getDetailMerchant(code);
      setDetail(res);
    } catch (e: unknown) {
      // 에러는 외부 API(axios 등)에서 전달된 다양한 구조를 가질 수 있으므로
      // catch 파라미터는 `unknown`으로 받습니다. 상세 메시지 접근을 위해
      // 로컬에서 제한적으로 `any`로 캐스트합니다.
      const anyE = e as any;
      setDetailError(anyE?.message ?? "상세 조회 오류");
    } finally {
      setLoadingDetail(false);
    }
  };

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

        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <MerchantTable
              items={items}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
              onRowClick={onRowClick}
            />
          </div>

          <div className="hidden sm:block">
            {selectedCode !== null && (
              <MerchantDetailPanel
                detail={detail}
                loading={loadingDetail}
                error={detailError}
                onClose={() => {
                  setSelectedCode(null);
                  setDetail(null);
                  setDetailError(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantListPage;

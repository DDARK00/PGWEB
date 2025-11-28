import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePaymentsQuery } from "../hooks/usePayments";
import { useStore } from "../store/useStore";
import useFilterSortPayments from "../hooks/useFilterSortPayments";
import { PaymentFilterBar, PaymentTable } from "../components/payments";
import PaymentsVisualizationPanel from "../components/payments/PaymentsVisualizationPanel";
import { common as commonApi } from "../apis";

function PaymentsPage() {
  const query = usePaymentsQuery();
  const payments = useStore((s) => s.payments);

  const all = useMemo(
    () => payments ?? query.data ?? [],
    [payments, query.data]
  );

  const searched = all ?? [];

  const paymentTypesQuery = useQuery({
    queryKey: ["common", "paymentTypes"],
    queryFn: () => commonApi.getPaymentType(),
    enabled: true,
  });

  const paymentStatusesQuery = useQuery({
    queryKey: ["common", "paymentStatuses"],
    queryFn: () => commonApi.getPaymentStatus(),
    enabled: true,
  });

  const apiPayTypes = useMemo(
    // 외부에서 가져오는 공통 코드(결제유형/상태)는 서버 응답 스키마가 명확하지 않아
    // 현재는 런타임에 `any`로 접근하고 있습니다. 가능한 경우 API 응답 타입을
    // 정의해 `(p: PaymentType)`처럼 명시적으로 바꾸는 것을 권장합니다.
    () =>
      paymentTypesQuery.data?.data?.data?.map((p: any) => String(p.type)) ??
      undefined,
    [paymentTypesQuery.data]
  );

  const apiStatuses = useMemo(
    () =>
      paymentStatusesQuery.data?.data?.data?.map((s: any) => ({
        value: String(s.code),
        label: String(s.code),
      })) ?? undefined,
    [paymentStatusesQuery.data]
  );

  const {
    items,
    payTypeFilters,
    statusFilter,
    setStatusFilter,
    togglePayType,
    resetFilters,
    sortKey,
    sortDirection,
    toggleSort,
    availablePayTypes,
    availableStatuses,
  } = useFilterSortPayments(searched, apiPayTypes, apiStatuses);

  if (query.isLoading) return <div>Loading payments...</div>;
  if (query.isError) return <div>Error loading payments</div>;

  return (
    <div
      style={{ paddingLeft: "10%", paddingRight: "10%" }}
      className="flex-1 min-h-full py-6 flex flex-col"
    >
      <h1 className="text-2xl font-bold mb-4">거래 내역</h1>

      <div className="space-y-3 flex flex-col h-full grow">
        <PaymentFilterBar
          status={statusFilter}
          onStatusChange={(s) => setStatusFilter(s)}
          payTypes={payTypeFilters}
          availablePayTypes={availablePayTypes}
          availableStatuses={availableStatuses}
          onTogglePayType={(p) => togglePayType(p)}
          onReset={resetFilters}
        />

        <PaymentsVisualizationPanel items={items} />

        <PaymentTable
          items={items}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
        />
      </div>
    </div>
  );
}

export default PaymentsPage;

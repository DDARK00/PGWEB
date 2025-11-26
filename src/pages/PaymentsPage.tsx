import { useMemo, useState } from "react";
import { usePaymentsQuery } from "../hooks/usePayments";
import { useStore } from "../store/useStore";
import useFilterSortPayments from "../hooks/useFilterSortPayments";
import { PaymentFilterBar, PaymentTable } from "../components/payments";

function PaymentsPage() {
  const query = usePaymentsQuery();
  const payments = useStore((s) => s.payments);

  const all = useMemo(
    () => payments ?? query.data ?? [],
    [payments, query.data]
  );

  const [search, setSearch] = useState("");

  const searched = useMemo(() => {
    if (!search) return all ?? [];
    const q = search.trim().toLowerCase();
    return (all ?? []).filter(
      (p) =>
        (p.paymentCode ?? "").toLowerCase().includes(q) ||
        (p.mchtCode ?? "").toLowerCase().includes(q)
    );
  }, [all, search]);

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
  } = useFilterSortPayments(searched);

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
          onSearch={(q) => setSearch(q)}
        />

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

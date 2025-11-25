import { useMemo } from "react";
import { usePaymentsQuery } from "../hooks/usePayments";
import { useStore } from "../store/useStore";

function PaymentsPage() {
  const query = usePaymentsQuery();
  const payments = useStore((s) => s.payments);
  const list = useMemo(() => query.data ?? [], [query.data, payments]);

  if (query.isLoading) return <div>Loading payments...</div>;
  if (query.isError) return <div>Error loading payments</div>;

  return (
    <>
      <div>
        <h1>거래 내역 페이지</h1>
        <ul>
          {list?.map((p) => (
            <li key={p.paymentCode}>
              {p.paymentCode} - {p.currency} - {p.status}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default PaymentsPage;

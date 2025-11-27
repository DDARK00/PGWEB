import { useMemo } from "react";
import type { Payment } from "../../types/types";
import type { SortKey, SortDirection } from "../../hooks/useFilterSortPayments";
import PaymentRow from "./PaymentRow";

type Props = {
  items: Payment[];
  sortKey?: SortKey | null;
  sortDirection?: SortDirection;
  onToggleSort: (k: SortKey) => void;
  onRowClick?: (p: Payment) => void;
};

const HeaderCell: React.FC<{
  label: string;
  sortKey: SortKey;
  activeKey?: SortKey | null;
  direction?: SortDirection;
  onToggle: (k: SortKey) => void;
}> = ({ label, sortKey, activeKey, direction, onToggle }) => {
  const isActive = activeKey === sortKey && direction !== "default";
  return (
    <div
      className="cursor-pointer select-none flex items-center gap-2"
      onClick={() => onToggle(sortKey)}
    >
      <span
        className={`text-sm font-medium ${
          isActive ? "text-slate-900" : "text-slate-600"
        }`}
      >
        {label}
      </span>
      <span className="text-xs text-slate-400">
        {isActive ? (direction === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </div>
  );
};

export default function PaymentTable({
  items,
  sortKey,
  sortDirection,
  onToggleSort,
  onRowClick,
}: Props) {
  const totalsByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of items) {
      const cur = (it.currency ?? "").toUpperCase();
      // sanitize amount (may be string like "1,000" or "1000.00")
      const num = parseFloat(String(it.amount).replace(/[^0-9.-]+/g, "")) || 0;
      map[cur] = (map[cur] ?? 0) + num;
    }
    return map;
  }, [items]);

  const formatAmount = (n: number, currency?: string) => {
    try {
      if (currency) {
        // Use Intl.NumberFormat for currency formatting when a valid currency is present
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency,
          maximumFractionDigits: 2,
        }).format(n);
      }
    } catch (e) {
      // fallback to plain number format
    }
    return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }).format(
      n
    );
  };
  return (
    <div className="bg-white max-h-[520px] border rounded shadow overflow-hidden flex flex-col">
      <div className="hidden md:flex items-center gap-3 px-3 py-2 border-b bg-slate-50 sticky top-0 z-10">
        <div className="w-1/5">
          <HeaderCell
            label="결제 코드"
            sortKey="paymentCode"
            activeKey={sortKey}
            direction={sortDirection}
            onToggle={onToggleSort}
          />
        </div>
        <div className="w-1/5">
          <HeaderCell
            label="가맹점 코드"
            sortKey="mchtCode"
            activeKey={sortKey}
            direction={sortDirection}
            onToggle={onToggleSort}
          />
        </div>
        <div className="flex-1">
          <HeaderCell
            label="금액"
            sortKey="amount"
            activeKey={sortKey}
            direction={sortDirection}
            onToggle={onToggleSort}
          />
        </div>
        <div className="w-36 text-right text-sm text-slate-600">결제유형</div>
        <div className="w-40 text-right text-sm text-slate-600">상태</div>
      </div>

      <div className="min-h-56 md:min-h-80 overflow-y-auto flex-1">
        <div className="flex flex-col min-h-full">
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              조회된 거래 내역이 없습니다.
            </div>
          ) : (
            items.map((p) => (
              <PaymentRow key={p.paymentCode} p={p} onClick={onRowClick} />
            ))
          )}
        </div>
      </div>

      {/* Footer: show total count of filtered payments */}
      <div className="px-3 py-2 border-t text-sm text-slate-600 text-right bg-white">
        <div className="flex items-center justify-end gap-6">
          {Object.keys(totalsByCurrency).length > 0 ? (
            <div>
              합계:{" "}
              {Object.entries(totalsByCurrency)
                .map(([cur, sum]) =>
                  `${formatAmount(sum, cur || undefined)} ${cur || ""}`.trim()
                )
                .join(" · ")}
            </div>
          ) : null}
          <div>총 {items.length}건</div>
        </div>
      </div>
    </div>
  );
}

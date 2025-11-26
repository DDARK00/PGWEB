import type { Payment } from "../../types/types";

type Props = { p: Payment; onClick?: (p: Payment) => void };

function statusClass(status: string | undefined) {
  const s = (status ?? "").toUpperCase();
  if (s === "SUCCESS" || s === "COMPLETED" || s === "PAID")
    return "bg-emerald-100 text-emerald-800";
  if (s === "PENDING" || s === "PROCESSING")
    return "bg-yellow-100 text-yellow-800";
  if (s === "FAILED" || s === "CANCELLED") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-700";
}

export default function PaymentRow({ p, onClick }: Props) {
  return (
    <div
      className="p-3 border-b last:border-b-0 hover:bg-slate-50 cursor-pointer"
      onClick={() => onClick?.(p)}
      role="button"
    >
      <div className="hidden md:flex items-center gap-3">
        <div className="w-1/5 text-sm text-slate-600">{p.paymentCode}</div>
        <div className="w-1/5 text-sm text-slate-600">{p.mchtCode}</div>
        <div className="flex-1 text-sm font-medium">
          {p.amount} {p.currency}
        </div>
        <div className="w-36 text-right text-sm text-slate-600">
          {p.payType}
        </div>
        <div className="w-40 text-right">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${statusClass(
              p.status
            )}`}
          >
            {p.status}
          </span>
        </div>
      </div>

      <div className="md:hidden flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium truncate">{p.paymentCode}</div>
          <div>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${statusClass(
                p.status
              )}`}
            >
              {p.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="truncate">{p.mchtCode}</div>
          <div className="truncate">
            {p.amount} {p.currency}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Merchant } from "../../types/types";

type Props = {
  m: Merchant;
  onClick?: (m: Merchant) => void;
};

export default function MerchantRow({ m, onClick }: Props) {
  const statusLabel = (() => {
    // `status`는 서버에서 숫자 또는 문자열로 올 수 있으므로 런타임에 동적 접근합니다.
    const s = (m as unknown as Record<string, unknown>).status;
    if (typeof s === "number")
      return s === 1 ? "ACTIVE" : s === 2 ? "CLOSED" : "READY";
    if (typeof s === "string") return s.toUpperCase();
    return "UNKNOWN";
  })();

  return (
    <div
      className="p-3 border-b last:border-b-0 hover:bg-slate-50 cursor-pointer"
      onClick={() => onClick?.(m)}
      role="button"
    >
      {/* Desktop row */}
      <div className="hidden md:flex items-center gap-3">
        <div className="w-1/6 text-sm text-slate-600">{m.mchtCode}</div>
        <div className="w-1/6 text-sm text-slate-600">{m.bizType}</div>
        <div className="flex-1 text-sm font-medium">{m.mchtName ?? "-"}</div>
        <div className="w-28 text-right">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              statusLabel === "ACTIVE"
                ? "bg-emerald-100 text-emerald-800"
                : statusLabel === "READY"
                ? "bg-yellow-100 text-yellow-800"
                : statusLabel === "CLOSED"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Mobile card */}
      <div className="md:hidden flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium truncate">
            {m.mchtName ?? "-"}
          </div>
          <div>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                statusLabel === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-800"
                  : statusLabel === "READY"
                  ? "bg-yellow-100 text-yellow-800"
                  : statusLabel === "CLOSED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="truncate">{m.mchtCode}</div>
          <div className="truncate">{m.bizType}</div>
        </div>
      </div>
    </div>
  );
}

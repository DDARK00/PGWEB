type StatusOption = { value: string; label: string };

type Props = {
  status: string;
  onStatusChange: (s: string) => void;
  payTypes: string[];
  onTogglePayType: (p: string) => void;
  onReset: () => void;
  availablePayTypes?: string[];
  availableStatuses?: StatusOption[];
};

export default function PaymentFilterBar({
  status,
  onStatusChange,
  payTypes,
  onTogglePayType,
  onReset,
  availablePayTypes,
  availableStatuses,
}: Props) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div className="flex flex-col gap-3 w-full lg:flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-slate-600 min-w-16">
              상태
            </div>
            <div className="flex gap-2 flex-wrap">
              {(() => {
                const list: { value: string; label: string }[] = [];
                list.push({ value: "ALL", label: "ALL" });

                if (availableStatuses && availableStatuses.length > 0) {
                  for (const s of availableStatuses) {
                    const value = String(s.value);
                    if (value.toUpperCase() === "ALL") continue;
                    list.push({ value, label: s.label ?? value });
                  }
                }

                return list.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onStatusChange(s.value)}
                    aria-pressed={status === s.value}
                    tabIndex={0}
                    className={`px-3 py-1 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      status === s.value
                        ? "bg-blue-600 text-white border-transparent"
                        : "bg-transparent text-slate-700 border-slate-200"
                    } cursor-pointer whitespace-nowrap`}
                  >
                    {s.label}
                  </button>
                ));
              })()}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-slate-600 min-w-16">
              결제유형
            </div>
            <div className="flex gap-2 flex-wrap max-w-[72ch]">
              <button
                key="ALL"
                onClick={() => onTogglePayType("ALL")}
                aria-pressed={payTypes.length === 0}
                tabIndex={0}
                className={`px-3 py-1 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                  payTypes.length === 0
                    ? "bg-emerald-600 text-white border-transparent"
                    : "bg-transparent text-slate-700 border-slate-200"
                } cursor-pointer whitespace-nowrap`}
              >
                ALL
              </button>
              {(availablePayTypes && availablePayTypes.length > 0
                ? availablePayTypes
                : ["CARD", "BANK", "VIRTUAL"]
              ).map((p: string) => (
                <button
                  key={p}
                  onClick={() => onTogglePayType(p)}
                  aria-pressed={payTypes.includes(p)}
                  tabIndex={0}
                  className={`px-3 py-1 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                    payTypes.includes(p)
                      ? "bg-emerald-600 text-white border-transparent"
                      : "bg-transparent text-slate-700 border-slate-200"
                  } cursor-pointer whitespace-nowrap`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-start w-full">
            <button
              onClick={onReset}
              className="px-3 py-2 mr-4 rounded text-sm border bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

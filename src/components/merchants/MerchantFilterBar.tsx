import type { StatusOption } from "../../hooks/useFilterSortMerchants";

type Props = {
  status: string; // 'ALL' or status value
  onStatusChange: (s: string) => void;
  bizTypes: string[];
  onToggleBizType: (b: string) => void;
  onReset: () => void;
  onSearch?: (q: string) => void;
  availableBizTypes?: string[];
  availableStatuses?: StatusOption[];
};

// default placeholders hooks에서 컴포넌트가 옵션을 받지 못할 때만 사용
const statusOptionsFallback = [
  { value: "ALL", label: "ALL" },
  // { value: "ACTIVE", label: "ACTIVE" },
  // { value: "READY", label: "READY" },
  // { value: "CLOSED", label: "CLOSED" },
];

export default function MerchantFilterBar({
  status,
  onStatusChange,
  bizTypes,
  onToggleBizType,
  onReset,
  onSearch,
  availableBizTypes,
  availableStatuses,
}: Props) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div className="flex flex-col gap-3 w-full lg:flex-1">
          {/* 상태 필터 row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-slate-600 min-w-16">
              상태
            </div>
            <div className="flex gap-2 flex-wrap">
              {(() => {
                const list: { value: string; label: string }[] = [];
                const seen = new Set<string>();
                // ALL 을 최상단에
                list.push({ value: "ALL", label: "ALL" });

                if (availableStatuses && availableStatuses.length > 0) {
                  for (const s of availableStatuses) {
                    const value = String(s.value);
                    const upper = value.toUpperCase();
                    if (upper === "ALL") continue; // skip duplicate
                    if (seen.has(value)) continue;
                    seen.add(value);
                    list.push({ value, label: s.label ?? value });
                  }
                } else {
                  for (const s of statusOptionsFallback) {
                    // fallback entries -> {value,label}
                    const val = (s as any).value ?? String(s);
                    if (String(val).toUpperCase() === "ALL") continue;
                    list.push({
                      value: String(val),
                      label: (s as any).label ?? String(val),
                    });
                  }
                }

                return list.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onStatusChange(s.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onStatusChange(s.value);
                    }}
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

          {/* 사업 유형 row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-slate-600 min-w-16">
              사업유형
            </div>
            <div className="flex gap-2 flex-wrap max-w-[72ch]">
              {/* ALL 버튼: 클릭하면 현재 선택된 모든 bizTypes를 해제하도록 동작 */}
              <button
                key="ALL"
                onClick={() => {
                  // if any selection exists, clear them by toggling each selected value
                  if (bizTypes && bizTypes.length > 0) {
                    bizTypes.forEach((b) => onToggleBizType(b));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (bizTypes && bizTypes.length > 0) {
                      bizTypes.forEach((b) => onToggleBizType(b));
                    }
                  }
                }}
                aria-pressed={!(bizTypes && bizTypes.length > 0)}
                tabIndex={0}
                className={`px-3 py-1 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                  !(bizTypes && bizTypes.length > 0)
                    ? "bg-emerald-600 text-white border-transparent"
                    : "bg-transparent text-slate-700 border-slate-200"
                } cursor-pointer whitespace-nowrap`}
              >
                ALL
              </button>

              {(availableBizTypes && availableBizTypes.length > 0
                ? availableBizTypes
                : ["APP", "SHOP", "ETC"]
              ).map((b: string) => (
                <button
                  key={b}
                  onClick={() => onToggleBizType(b)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onToggleBizType(b);
                  }}
                  aria-pressed={bizTypes.includes(b)}
                  tabIndex={0}
                  className={`px-3 py-1 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                    bizTypes.includes(b)
                      ? "bg-emerald-600 text-white border-transparent"
                      : "bg-transparent text-slate-700 border-slate-200"
                  } cursor-pointer whitespace-nowrap`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 justify-between w-full">
            <button
              onClick={onReset}
              className="px-3 py-2 mr-4 rounded text-sm border bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
            >
              RESET
            </button>
            {onSearch ? (
              <div className="relative flex items-center gap-2 w-full">
                <input
                  placeholder="가맹점명 또는 코드로 검색"
                  onChange={(e) => onSearch(e.target.value)}
                  className="px-3 py-2 border rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

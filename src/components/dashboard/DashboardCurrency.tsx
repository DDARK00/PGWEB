import type { Payment } from "../../types/types";

type Props = { payments: Payment[] };

export default function DashboardCurrency({ payments }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">통화별 합계</div>
        <div className="text-xs text-slate-500">
          통화별로 합계를 막대형으로 표시합니다
        </div>
      </div>
      {(() => {
        const map = new Map<string, number>();
        for (const p of payments ?? []) {
          const cur = String(p.currency ?? "UNKNOWN").toUpperCase();
          const amt =
            parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0;
          map.set(cur, (map.get(cur) ?? 0) + amt);
        }
        const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
        const max = entries.reduce((m, e) => Math.max(m, e[1]), 0) || 1;
        return (
          <div className="mt-3 space-y-2">
            {entries.length === 0 && (
              <div className="text-sm p-2">데이터 없음</div>
            )}
            {entries.map(([cur, amt]) => (
              <div key={cur} className="flex items-center gap-3">
                <div className="w-20 text-sm">{cur}</div>
                <div className="flex-1 bg-slate-100 rounded h-3 overflow-hidden">
                  <div
                    className="h-3 bg-blue-400"
                    style={{ width: `${Math.round((amt / max) * 100)}%` }}
                  />
                </div>
                <div className="w-32 text-right font-semibold">
                  {(() => {
                    try {
                      return amt.toLocaleString(undefined, {
                        style: "currency",
                        currency: cur,
                      });
                    } catch (e) {
                      return `${cur} ${amt.toLocaleString()}`;
                    }
                  })()}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

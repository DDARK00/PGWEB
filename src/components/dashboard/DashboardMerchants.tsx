import type { Merchant, Payment } from "../../types/types";
import { PieChart } from "../common/visualizations";

type Props = { merchants: Merchant[]; payments: Payment[] };

export default function DashboardMerchants({ merchants, payments }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-xs text-slate-500 mb-2">사업유형 분포</div>
        {(() => {
          const map = new Map<string, number>();
          for (const m of merchants ?? []) {
            const k = String(
              (m as unknown as Record<string, unknown>).bizType ?? "UNKNOWN"
            );
            map.set(k, (map.get(k) ?? 0) + 1);
          }
          const labels = Array.from(map.keys());
          const values = labels.map((l) => map.get(l) ?? 0);
          return <PieChart labels={labels} values={values} />;
        })()}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-xs text-slate-500 mb-2">상태별 분포</div>
        {(() => {
          const map = new Map<string, number>();
          for (const m of merchants ?? []) {
            const k = String(
              (m as unknown as Record<string, unknown>).status ?? "UNKNOWN"
            );
            map.set(k, (map.get(k) ?? 0) + 1);
          }
          const labels = Array.from(map.keys());
          const values = labels.map((l) => map.get(l) ?? 0);
          return <PieChart labels={labels} values={values} />;
        })()}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm font-medium mb-2">실패 원인 분석 (FAILED)</div>
        {(() => {
          const failed = (payments ?? []).filter(
            (p: Payment) => String(p.status ?? "").toUpperCase() === "FAILED"
          );
          const byType = new Map<string, number>();
          const byError = new Map<string, number>();
          for (const f of failed) {
            const t = String(f.payType ?? "UNKNOWN");
            const e = String(f.status ?? "UNKNOWN");
            byType.set(t, (byType.get(t) ?? 0) + 1);
            byError.set(e, (byError.get(e) ?? 0) + 1);
          }
          const typeLabels = Array.from(byType.keys());
          const typeValues = typeLabels.map((l) => byType.get(l) ?? 0);
          return (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  결제유형별 실패
                </div>
                {typeValues.length === 0 ? (
                  <div className="text-sm p-2">데이터 없음</div>
                ) : (
                  <PieChart labels={typeLabels} values={typeValues} />
                )}
              </div>

              <div className="text-sm text-slate-600">
                {(() => {
                  const items = Array.from(byError.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6);
                  if (items.length === 0)
                    return <div className="p-2">데이터 없음</div>;
                  return (
                    <div className="space-y-1">
                      {items.map(([code, cnt]) => (
                        <div
                          key={code}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="text-slate-700">{code}</div>
                          <div className="text-slate-500">{cnt}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// React import not required with automatic JSX runtime
import type { Payment } from "../../types/types";
import { PieChart } from "../common/visualizations";

type Props = { payments: Payment[] };

export default function DashboardPies({ payments }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm font-medium mb-2">결제 상태 분포</div>
        {(() => {
          const map = new Map<string, number>();
          for (const p of payments ?? []) {
            const k = String(p.status ?? "UNKNOWN");
            map.set(k, (map.get(k) ?? 0) + 1);
          }
          const labels = Array.from(map.keys());
          const values = labels.map((l) => map.get(l) ?? 0);
          return <PieChart labels={labels} values={values} />;
        })()}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm font-medium mb-2">결제유형 분포</div>
        {(() => {
          const map = new Map<string, number>();
          for (const p of payments ?? []) {
            const k = String(p.payType ?? "UNKNOWN");
            map.set(k, (map.get(k) ?? 0) + 1);
          }
          const labels = Array.from(map.keys());
          const values = labels.map((l) => map.get(l) ?? 0);
          return <PieChart labels={labels} values={values} />;
        })()}
      </div>
    </div>
  );
}

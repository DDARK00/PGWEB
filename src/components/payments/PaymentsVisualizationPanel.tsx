import { useMemo, useState } from "react";
import type { Payment } from "../../types/types";
import { PieChart, TimeSeriesChart } from "../common/visualizations";

type Props = {
  items: Payment[];
};

function groupBy<T, K extends string | number>(arr: T[], keyFn: (x: T) => K) {
  const map = new Map<K, T[]>();
  for (const it of arr) {
    const k = keyFn(it);
    const list = map.get(k) ?? [];
    list.push(it);
    map.set(k, list);
  }
  return map;
}

export default function PaymentsVisualizationPanel({ items }: Props) {
  const [unit, setUnit] = useState<"hour" | "day" | "week" | "month">("hour");
  const [showStatus, setShowStatus] = useState(true);
  const [showType, setShowType] = useState(true);
  const [showSeries, setShowSeries] = useState(true);
  const statusBreakdown = useMemo(() => {
    const map = groupBy(items, (p) => String(p.status ?? "UNKNOWN"));
    const labels = Array.from(map.keys());
    const values = labels.map((l) => map.get(l)!.length);
    return { labels, values };
  }, [items]);

  const payTypeBreakdown = useMemo(() => {
    const map = groupBy(items, (p) => String(p.payType ?? "UNKNOWN"));
    const labels = Array.from(map.keys());
    const values = labels.map((l) => map.get(l)!.length);
    return { labels, values };
  }, [items]);

  function getISOWeek(date: Date) {
    const tmp = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    // Thursday in current week decides the year.
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo =
      Math.floor(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7) +
      1;
    return { year: tmp.getUTCFullYear(), week: weekNo };
  }

  function formatKey(d: Date, unit: string) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    if (unit === "hour") return `${y}-${m}-${dd} ${hh}:00`;
    if (unit === "day") return `${y}-${m}-${dd}`;
    if (unit === "week") {
      const w = getISOWeek(d);
      return `${w.year}-W${String(w.week).padStart(2, "0")}`;
    }
    // month
    return `${y}-${m}`;
  }

  const amountByPeriod = useMemo(() => {
    const map = new Map<string, { ts: number; sum: number }>();
    for (const p of items) {
      if (!p.paymentAt) continue;
      const d = new Date(String(p.paymentAt));
      if (Number.isNaN(d.getTime())) continue;
      const key = formatKey(d, unit);
      // for sorting, compute representative timestamp per key
      let repTs = d.getTime();
      if (unit === "month") {
        repTs = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      } else if (unit === "week") {
        // compute Monday of the ISO week
        const day = d.getDay() || 7; // Sunday=0->7
        const monday = new Date(d);
        monday.setDate(d.getDate() - (day - 1));
        monday.setHours(0, 0, 0, 0);
        repTs = monday.getTime();
      } else if (unit === "day") {
        repTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      } else if (unit === "hour") {
        repTs = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          d.getHours()
        ).getTime();
      }

      const amt = parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0;
      const cur = map.get(key);
      if (!cur) map.set(key, { ts: repTs, sum: amt });
      else cur.sum += amt;
    }

    const sorted = Array.from(map.entries()).sort((a, b) => a[1].ts - b[1].ts);
    const labels = sorted.map((s) => s[0]);
    const values = sorted.map((s) => s[1].sum);
    return { labels, values };
  }, [items, unit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-0">
      <div className="col-span-1 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">상태별 분포</h3>
          <button
            className="text-xs px-2 py-1 bg-slate-100 rounded"
            onClick={() => setShowStatus((s) => !s)}
          >
            {showStatus ? "숨기기" : "보이기"}
          </button>
        </div>
        {showStatus && (
          <PieChart
            labels={statusBreakdown.labels}
            values={statusBreakdown.values}
          />
        )}
      </div>

      <div className="col-span-1 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">결제유형 분포</h3>
          <button
            className="text-xs px-2 py-1 bg-slate-100 rounded"
            onClick={() => setShowType((s) => !s)}
          >
            {showType ? "숨기기" : "보이기"}
          </button>
        </div>
        {showType && (
          <PieChart
            labels={payTypeBreakdown.labels}
            values={payTypeBreakdown.values}
          />
        )}
      </div>

      <div className="col-span-1 lg:col-span-3 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">기간별 합계</h3>
          <div className="flex items-center gap-2">
            {(["hour", "day", "week", "month"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-2 py-1 text-xs rounded border ${
                  unit === u
                    ? "bg-slate-800 text-white"
                    : "bg-transparent text-slate-700"
                }`}
              >
                {u}
              </button>
            ))}
            <button
              className="ml-2 text-xs px-2 py-1 bg-slate-100 rounded"
              onClick={() => setShowSeries((s) => !s)}
            >
              {showSeries ? "숨기기" : "보이기"}
            </button>
          </div>
        </div>
        {showSeries ? (
          <TimeSeriesChart
            labels={amountByPeriod.labels}
            values={amountByPeriod.values}
            title={`합계 (${unit})`}
          />
        ) : (
          <div className="p-2 text-sm text-slate-500">
            그래프가 숨겨져 있습니다.
          </div>
        )}
      </div>
    </div>
  );
}

import TimeSeriesChart from "../common/visualizations/TimeSeriesChart";
import CombinedChart from "../common/visualizations/CombinedChart";
import type { Payment } from "../../types/types";

type Props = {
  payments: Payment[];
  timeGranularity: "hour" | "day" | "week" | "month";
  currencyFilter: string;
  setTimeGranularity: (g: "hour" | "day" | "week" | "month") => void;
  setCurrencyFilter: (c: string) => void;
};

export default function DashboardTimeseries({
  payments,
  timeGranularity,
  currencyFilter,
  setTimeGranularity,
  setCurrencyFilter,
}: Props) {
  function getWeekKey(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }

  const perCurrency = new Map<string, Map<string, number>>();
  for (const p of payments ?? []) {
    if (!p.paymentAt) continue;
    const d = new Date(String(p.paymentAt));
    if (Number.isNaN(d.getTime())) continue;
    let key = "";
    if (timeGranularity === "hour") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")} ${String(
        d.getHours()
      ).padStart(2, "0")}:00`;
    } else if (timeGranularity === "day")
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    else if (timeGranularity === "week") key = getWeekKey(d);
    else
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const cur = String(p.currency ?? "UNKNOWN").toUpperCase();
    const amt = parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0;
    const m = perCurrency.get(cur) ?? new Map<string, number>();
    m.set(key, (m.get(key) ?? 0) + amt);
    perCurrency.set(cur, m);
  }

  const entries = Array.from(perCurrency.entries());
  if (entries.length === 0)
    return <div className="p-2 text-sm text-slate-500">데이터 없음</div>;

  const hasKRW = perCurrency.has("KRW");
  const hasUSD = perCurrency.has("USD");

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium">기간별 합계</div>
          <div className="text-xs text-slate-500">
            시간/일/주/월 단위로 조회
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs">단위:</div>
          {(["hour", "day", "week", "month"] as const).map((g) => (
            <button
              key={g}
              className={`text-xs px-2 py-1 rounded ${
                timeGranularity === g
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
              onClick={() => setTimeGranularity(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="text-xs text-slate-500">통화:</div>
        {(() => {
          const set = new Set<string>();
          for (const p of payments ?? [])
            set.add(String(p.currency ?? "UNKNOWN").toUpperCase());
          const currencies = ["ALL", ...Array.from(set)];
          return currencies.map((c) => (
            <button
              key={c}
              className={`text-xs px-2 py-1 rounded ${
                currencyFilter === c
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
              onClick={() => setCurrencyFilter(c)}
            >
              {c}
            </button>
          ));
        })()}
      </div>

      {currencyFilter === "ALL" ? (
        hasKRW && hasUSD ? (
          (() => {
            const krwMap = perCurrency.get("KRW") ?? new Map<string, number>();
            const usdMap = perCurrency.get("USD") ?? new Map<string, number>();
            const allKeys = Array.from(
              new Set([...krwMap.keys(), ...usdMap.keys()])
            );
            allKeys.sort();
            const krwValues = allKeys.map((k) => krwMap.get(k) ?? 0);
            const usdValues = allKeys.map((k) => usdMap.get(k) ?? 0);
            const krwTotal = krwValues.reduce((s, v) => s + v, 0);
            const usdTotal = usdValues.reduce((s, v) => s + v, 0);
            return (
              <div>
                <div className="flex gap-4 mb-2">
                  <div className="flex-1 bg-slate-50 p-2 rounded text-sm">
                    <div className="text-xs text-slate-500">KRW 합계</div>
                    <div className="text-lg font-semibold">
                      {krwTotal.toLocaleString()} KRW
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-2 rounded text-sm">
                    <div className="text-xs text-slate-500">USD 합계</div>
                    <div className="text-lg font-semibold">
                      {usdTotal.toLocaleString()} USD
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <CombinedChart
                    labels={allKeys}
                    datasets={[
                      {
                        label: "KRW",
                        values: krwValues,
                        type: "line",
                        borderColor: "#10B981",
                        backgroundColor: "rgba(16,185,129,0.2)",
                        yAxisID: "y",
                      },
                      {
                        label: "USD",
                        values: usdValues,
                        type: "bar",
                        backgroundColor: "#3B82F6",
                        yAxisID: "y1",
                      },
                    ]}
                    title={`KRW(선) / USD(막대) 비교`}
                  />
                </div>
              </div>
            );
          })()
        ) : (
          <div className="space-y-4">
            {entries.map(([cur, map]) => {
              const sorted = Array.from(map.entries()).sort((a, b) =>
                a[0].localeCompare(b[0])
              );
              const labels = sorted.map((s) => s[0]);
              const values = sorted.map((s) => s[1]);
              return (
                <div key={cur} className="">
                  <div className="text-xs text-slate-600 mb-1">{cur}</div>
                  <TimeSeriesChart
                    labels={labels}
                    values={values}
                    title={`합계 (${cur})`}
                  />
                </div>
              );
            })}
          </div>
        )
      ) : (
        (() => {
          const m = perCurrency.get(currencyFilter) ?? new Map();
          const sorted = Array.from(m.entries()).sort((a, b) =>
            a[0].localeCompare(b[0])
          );
          const labels = sorted.map((s) => s[0]);
          const values = sorted.map((s) => s[1]);
          return (
            <TimeSeriesChart
              labels={labels}
              values={values}
              title={`합계 (${currencyFilter})`}
            />
          );
        })()
      )}
    </div>
  );
}

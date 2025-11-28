import type { Merchant, Payment } from "../../types/types";

type Props = {
  payments: Payment[];
  merchants: Merchant[];
};

export default function DashboardKpis({ payments, merchants }: Props) {
  const list = payments ?? [];
  const totalCount = list.length;
  const successCount = list.filter(
    (p: any) => String(p.status ?? "").toUpperCase() === "SUCCESS"
  ).length;
  const approvalRate = totalCount
    ? Math.round((successCount / totalCount) * 1000) / 10
    : 0;
  const amounts = list.map(
    (p: any) => parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0
  );
  const totalAmount = amounts.reduce((s: number, v: number) => s + v, 0);
  const avgAmount = totalCount
    ? Math.round((totalAmount / totalCount) * 100) / 100
    : 0;

  const toDate = (d: Date) =>
    d.toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  const todayStr = toDate(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDate(yesterday);
  let todaySum = 0;
  let yesterdaySum = 0;
  let todaySuccess = 0;
  let yesterdaySuccess = 0;
  for (const p of list) {
    if (!p.paymentAt) continue;
    const dstr = new Date(String(p.paymentAt)).toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const amt = parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0;
    if (dstr === todayStr) {
      todaySum += amt;
      if (String(p.status ?? "").toUpperCase() === "SUCCESS") todaySuccess++;
    } else if (dstr === yesterdayStr) {
      yesterdaySum += amt;
      if (String(p.status ?? "").toUpperCase() === "SUCCESS")
        yesterdaySuccess++;
    }
  }

  function pctChange(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  const dayChange = pctChange(todaySum, yesterdaySum);
  const todayApproval =
    todaySum === 0
      ? 0
      : Math.round(
          (todaySuccess /
            (list.filter(
              (p: Payment) =>
                new Date(String(p.paymentAt)).toLocaleDateString("ko-KR", {
                  timeZone: "Asia/Seoul",
                }) === todayStr
            ).length || 1)) *
            1000
        ) / 10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">거래 건수</div>
        <div className="text-2xl font-semibold">{totalCount}</div>
        <div className="text-xs text-slate-500 mt-1">
          오늘:{" "}
          {
            list.filter(
              (p: Payment) =>
                new Date(String(p.paymentAt)).toLocaleDateString("ko-KR", {
                  timeZone: "Asia/Seoul",
                }) === todayStr
            ).length
          }{" "}
          건
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">가맹점 수</div>
        <div className="text-2xl font-semibold">{merchants?.length ?? 0}</div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">매출 (오늘)</div>
        <div className="text-2xl font-semibold">
          {todaySum === 0 ? "0" : todaySum.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`text-xs px-2 py-1 rounded ${
              dayChange >= 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {dayChange >= 0
              ? `▲ ${Math.abs(dayChange)}%`
              : `▼ ${Math.abs(dayChange)}%`}{" "}
            vs yesterday
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">승인율 / 평균 결제액</div>
        <div className="flex items-baseline gap-4">
          <div>
            <div className="text-2xl font-semibold">{approvalRate}%</div>
            <div className="text-xs text-slate-500">전체 승인율</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">
              {avgAmount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">평균 결제액</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          오늘 승인율: {todayApproval}%
        </div>
      </div>
    </div>
  );
}

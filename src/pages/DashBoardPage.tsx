import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { usePaymentsQuery } from "../hooks/usePayments";
import { useMerchantsQuery } from "../hooks/useMerchants";
import { common as commonApi } from "../apis";
import { PieChart, TimeSeriesChart } from "../components/common/visualizations";

function DashBoardPage() {
  const navigate = useNavigate();

  const paymentsQuery = usePaymentsQuery();
  const merchantsQuery = useMerchantsQuery();

  //   const paymentTypesQuery = useQuery({
  //     queryKey: ["common", "paymentTypes"],
  //     queryFn: () => commonApi.getPaymentType(),
  //     enabled: true,
  //   });

  //   const paymentStatusesQuery = useQuery({
  //     queryKey: ["common", "paymentStatuses"],
  //     queryFn: () => commonApi.getPaymentStatus(),
  //     enabled: true,
  //   });

  const healthQuery = useQuery({
    queryKey: ["common", "health"],
    queryFn: () => commonApi.ping(),
    enabled: true,
  });

  const payments = useMemo(
    () => paymentsQuery.data ?? [],
    [paymentsQuery.data]
  );
  const merchants = useMemo(
    () => merchantsQuery.data ?? [],
    [merchantsQuery.data]
  );

  return (
    <div
      style={{ paddingLeft: "10%", paddingRight: "10%" }}
      className="flex-1 min-h-full py-6"
    >
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-white p-4 rounded shadow cursor-pointer"
          onClick={() => navigate("/payments")}
        >
          <div className="text-sm text-slate-500">거래 건수</div>
          <div className="text-2xl font-semibold">
            {(payments as any).length ?? 0}
          </div>
        </div>

        <div
          className="bg-white p-4 rounded shadow cursor-pointer"
          onClick={() => navigate("/merchants")}
        >
          <div className="text-sm text-slate-500">가맹점 수</div>
          <div className="text-2xl font-semibold">
            {(merchants as any).length ?? 0}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">헬스체크</div>
          <div className="text-sm text-slate-700 mt-2">
            상태:{" "}
            {healthQuery.data?.data?.data
              ? "OK"
              : healthQuery.isLoading
              ? "체크 중..."
              : "오류"}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            응답: {JSON.stringify(healthQuery.data?.data?.data ?? null)}
          </div>
        </div>
      </div>

      {/* Visualization area: grouped charts */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm font-medium mb-2">결제 상태 분포</div>
            {(() => {
              const map = new Map<string, number>();
              for (const p of (payments as any) ?? []) {
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
              for (const p of (payments as any) ?? []) {
                const k = String(p.payType ?? "UNKNOWN");
                map.set(k, (map.get(k) ?? 0) + 1);
              }
              const labels = Array.from(map.keys());
              const values = labels.map((l) => map.get(l) ?? 0);
              return <PieChart labels={labels} values={values} />;
            })()}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm font-medium mb-2">통화별 합계</div>
            {(() => {
              const map = new Map<string, number>();
              for (const p of (payments as any) ?? []) {
                const cur = String(p.currency ?? "UNKNOWN").toUpperCase();
                const amt =
                  parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0;
                map.set(cur, (map.get(cur) ?? 0) + amt);
              }
              const labels = Array.from(map.keys());
              const values = labels.map((l) => map.get(l) ?? 0);
              return <PieChart labels={labels} values={values} />;
            })()}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm font-medium mb-2">기간별 합계 (월)</div>
          {(() => {
            const map = new Map<string, number>();
            for (const p of (payments as any) ?? []) {
              if (!p.paymentAt) continue;
              const d = new Date(String(p.paymentAt));
              if (Number.isNaN(d.getTime())) continue;
              const key = `${d.getFullYear()}-${String(
                d.getMonth() + 1
              ).padStart(2, "0")}`;
              const amt =
                parseFloat(String(p.amount).replace(/[^0-9.-]+/g, "")) || 0;
              map.set(key, (map.get(key) ?? 0) + amt);
            }
            const sorted = Array.from(map.entries()).sort((a, b) =>
              a[0].localeCompare(b[0])
            );
            const labels = sorted.map((s) => s[0]);
            const values = sorted.map((s) => s[1]);
            return (
              <TimeSeriesChart
                labels={labels}
                values={values}
                title={"기간별 합계"}
              />
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium mb-2">최근 결제 (상위 5)</h3>
          <div className="text-sm text-slate-700">
            {(payments as any)
              ?.slice()
              .sort(
                (a: any, b: any) =>
                  (Date.parse(String(b.paymentAt)) || 0) -
                  (Date.parse(String(a.paymentAt)) || 0)
              )
              .slice(0, 5)
              .map((p: any) => (
                <div
                  key={p.paymentCode}
                  role="button"
                  onClick={() =>
                    navigate(
                      `/payments?paymentCode=${encodeURIComponent(
                        p.paymentCode
                      )}`
                    )
                  }
                  className="flex justify-between py-2 border-b last:border-b-0 cursor-pointer hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <div className="font-medium">{p.paymentCode}</div>
                    <div className="text-xs text-slate-500">{p.paymentAt}</div>
                  </div>
                  <div className="w-28 text-right">
                    <div className="text-sm">{p.payType ?? "-"}</div>
                    <div
                      className={`text-xs ${
                        String(p.status).toUpperCase() === "SUCCESS"
                          ? "text-emerald-600"
                          : p.status &&
                            String(p.status).toUpperCase() === "FAILED"
                          ? "text-red-600"
                          : "text-slate-500"
                      }`}
                    >
                      {p.status}
                    </div>
                  </div>
                  <div className="w-32 text-right font-semibold">
                    {p.amount}
                  </div>
                </div>
              )) ?? <div className="p-2">데이터 없음</div>}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium mb-2">가맹점 통계</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-2">사업유형 분포</div>
              {(() => {
                const map = new Map<string, number>();
                for (const m of (merchants as any) ?? []) {
                  const k = String(m.bizType ?? "UNKNOWN");
                  map.set(k, (map.get(k) ?? 0) + 1);
                }
                const labels = Array.from(map.keys());
                const values = labels.map((l) => map.get(l) ?? 0);
                return <PieChart labels={labels} values={values} />;
              })()}
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2">상태별 분포</div>
              {(() => {
                const map = new Map<string, number>();
                for (const m of (merchants as any) ?? []) {
                  const k = String((m as any).status ?? "UNKNOWN");
                  map.set(k, (map.get(k) ?? 0) + 1);
                }
                const labels = Array.from(map.keys());
                const values = labels.map((l) => map.get(l) ?? 0);
                return <PieChart labels={labels} values={values} />;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;

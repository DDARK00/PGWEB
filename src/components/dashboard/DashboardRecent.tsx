import { useNavigate } from "react-router-dom";
import type { Merchant, Payment } from "../../types/types";

type Props = { payments: Payment[]; merchants: Merchant[] };

export default function DashboardRecent({ payments, merchants }: Props) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-medium mb-2">최근 결제 (상위 5)</h3>
        <div className="text-sm text-slate-700">
          {payments
            ?.slice()
            .sort(
              (a: Payment, b: Payment) =>
                (Date.parse(String(b.paymentAt)) || 0) -
                (Date.parse(String(a.paymentAt)) || 0)
            )
            .slice(0, 5)
            .map((p: Payment) => {
              const d = p.paymentAt ? new Date(String(p.paymentAt)) : null;
              const formatted = d
                ? d.toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
              return (
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
                    <div className="text-xs text-slate-500">{formatted}</div>
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
              );
            }) ?? <div className="p-2">데이터 없음</div>}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-medium mb-2">가맹점 추가 통계</h3>
        <div className="text-xs text-slate-500 mb-2">
          (위의 가맹점 통계와 같은 사이즈로 표시됩니다)
        </div>
        <div className="text-sm">총 가맹점 수: {merchants?.length ?? 0}</div>
      </div>
    </div>
  );
}

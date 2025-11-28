import { useMemo, useState } from "react";
import { usePaymentsQuery } from "../hooks/usePayments";
import { useMerchantsQuery } from "../hooks/useMerchants";
import DashboardKpis from "../components/dashboard/DashboardKpis";
import DashboardPies from "../components/dashboard/DashboardPies";
import DashboardMerchants from "../components/dashboard/DashboardMerchants";
import DashboardCurrency from "../components/dashboard/DashboardCurrency";
import DashboardTimeseries from "../components/dashboard/DashboardTimeseries";
import DashboardRecent from "../components/dashboard/DashboardRecent";

export default function DashBoardPage() {
  const paymentsQuery = usePaymentsQuery();
  const merchantsQuery = useMerchantsQuery();

  const payments = useMemo(
    () => paymentsQuery.data ?? [],
    [paymentsQuery.data]
  );
  const merchants = useMemo(
    () => merchantsQuery.data ?? [],
    [merchantsQuery.data]
  );

  const [timeGranularity, setTimeGranularity] = useState<
    "hour" | "day" | "week" | "month"
  >("hour");
  const [currencyFilter, setCurrencyFilter] = useState<string>("ALL");

  return (
    <div
      style={{ paddingLeft: "10%", paddingRight: "10%" }}
      className="flex-1 min-h-full py-6 flex flex-col"
    >
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>

      <div className="mx-auto px-4 space-y-3 flex-col h-full grow grid grid-cols-1 gap-4 ">
        <div className="space-y-3 flex flex-col h-full grow">
          <DashboardKpis payments={payments} merchants={merchants} />
        </div>

        <DashboardPies payments={payments} />

        <DashboardMerchants merchants={merchants} payments={payments} />

        <DashboardCurrency payments={payments} />

        <DashboardTimeseries
          payments={payments}
          timeGranularity={timeGranularity}
          currencyFilter={currencyFilter}
          setTimeGranularity={setTimeGranularity}
          setCurrencyFilter={setCurrencyFilter}
        />

        <DashboardRecent payments={payments} merchants={merchants} />
      </div>
    </div>
  );
}

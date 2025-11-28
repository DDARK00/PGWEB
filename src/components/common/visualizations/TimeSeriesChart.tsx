import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  labels: string[];
  values: number[];
  title?: string;
};

export default function TimeSeriesChart({ labels, values, title }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: title ?? "",
        data: values,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: true, position: "bottom" as const },
      title: { display: !!title, text: title },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Chart.js tick 콜백은 라이브러리에서 전달하는 값의 타입이 명확하지
          // 않으므로 `any`를 사용합니다.
          callback: function (value: any) {
            try {
              const v = Number(value);
              if (!isFinite(v)) return String(value);
              return v.toLocaleString();
            } catch (e) {
              return String(value);
            }
          },
        },
      },
    },
  };

  return (
    <div className="w-full min-w-0 h-64">
      <Line data={data} options={options} style={{ width: "100%" }} />
    </div>
  );
}

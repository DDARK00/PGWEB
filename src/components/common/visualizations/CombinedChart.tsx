import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

type Dataset = {
  label: string;
  values: number[];
  type?: "line" | "bar";
  borderColor?: string;
  backgroundColor?: string;
  yAxisID?: string; // optional axis id (e.g., 'y' or 'y1')
};

type Props = {
  labels: string[];
  datasets: Dataset[];
  title?: string;
};

export default function CombinedChart({ labels, datasets, title }: Props) {
  const data = {
    labels,
    datasets: datasets.map((d) => ({
      label: d.label,
      data: d.values,
      type: d.type ?? "line",
      borderColor: d.borderColor,
      backgroundColor: d.backgroundColor,
      yAxisID: d.yAxisID ?? "y",
    })),
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: !!title, text: title },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        ticks: {
          // Chart.js tick 콜백은 라이브러리에서 전달하는 값의 타입이 명확하지
          // 않으므로 `any`를 사용합니다. 필요하면 타입 가드를 추가하세요.
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
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: {
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
      <Chart
        type="bar"
        data={data}
        options={options}
        style={{ width: "100%" }}
      />
    </div>
  );
}

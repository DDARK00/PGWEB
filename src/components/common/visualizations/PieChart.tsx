import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type Props = {
  labels: string[];
  values: number[];
  title?: string;
};

export default function PieChart({ labels, values, title }: Props) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#60A5FA",
          "#34D399",
          "#FBBF24",
          "#F87171",
          "#A78BFA",
          "#60A5FA",
        ],
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: !!title, text: title },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw ?? 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// plugin to draw labels inside arcs (percentage + value)
const arcLabelPlugin = {
  id: "arcLabelPlugin",
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      // Chart.js의 내부 타입은 매우 동적이며, 플러그인/메타데이터 접근은
      // 라이브러리 버전마다 달라질 수 있습니다. 따라서 관련 콜백에서는
      // 대개 `any`/`unknown`를 사용하여 런타임 접근을 허용합니다.
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((arc: any, i: number) => {
        const data = dataset.data[i] ?? 0;
        const total =
          dataset.data.reduce(
            (s: number, v: number) => s + (Number(v) || 0),
            0
          ) || 1;
        const percent = ((Number(data) / total) * 100).toFixed(1) + "%";
        const startAngle = arc.startAngle;
        const endAngle = arc.endAngle;
        const angle = (startAngle + endAngle) / 2;
        const r = (arc.innerRadius + arc.outerRadius) / 2;
        const x = arc.x + r * Math.cos(angle);
        const y = arc.y + r * Math.sin(angle);
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // value on first line, percent below
        const lines = [`${data}`, `${percent}`];
        ctx.fillText(lines[0], x, y - 6);
        ctx.fillText(lines[1], x, y + 6);
        ctx.restore();
      });
    });
  },
};

// register plugin (duplicate registration is ignored)
try {
  // arcLabelPlugin은 로컬에서 플러그인 객체를 만들었고, ChartJS의 정확한
  // Plugin 타입과 완전히 일치하지 않을 수 있습니다. 타입 안정성을 맞추려면
  // 플러그인 인터페이스를 선언하거나 chart.js의 타입을 보완하세요.
  ChartJS.register(arcLabelPlugin as any);
} catch (e) {
  // ignore
}
type Props = {
  labels: string[];
  values: number[];
  title?: string;
};

export default function PieChart({ labels, values, title }: Props) {
  const total = values.reduce((s, v) => s + (Number(v) || 0), 0);

  const baseColors = [
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#F87171",
    "#A78BFA",
    "#FB7185",
    "#F472B6",
  ];

  function generateColors(n: number) {
    if (n <= baseColors.length) return baseColors.slice(0, n);
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      const hue = Math.round((i * 360) / n);
      out.push(`hsl(${hue} 70% 50%)`);
    }
    return out;
  }

  const palette = generateColors(labels.length);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: palette,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
        cutout: "40%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          generateLabels: function (chart: any) {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label: any, i: number) => {
              const value = dataset.data[i] ?? 0;
              const percent = total
                ? Math.round((value / total) * 100 * 10) / 10
                : 0;
              return {
                text: `${label}: ${value} (${percent}%)`,
                fillStyle: dataset.backgroundColor[i],
                hidden: false,
                index: i,
              };
            });
          },
        },
      },
      title: { display: !!title, text: title },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw ?? 0;
            const percent = total
              ? ((Number(value) / total) * 100).toFixed(1)
              : "0.0";
            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full min-w-0 h-60">
      <Doughnut data={data} options={options} />
    </div>
  );
}

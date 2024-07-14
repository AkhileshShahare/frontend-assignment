import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Legend
);

interface LineChartProps {
  labels: number[]; // Array of time labels
  dataPoints: number[];
  label: string;
  color: string;
  xLabel: string;
  yLabel: string;
}

const LineChart: React.FC<LineChartProps> = ({
  labels,
  dataPoints,
  label,
  color,
  xLabel,
  yLabel
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: dataPoints,
        borderColor: color,
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: "time" as const, // Using 'as const' to ensure the type is inferred exactly as 'time'
        time: {
          unit: "minute" as const, // Specify the time unit as a const
        },
        title: {
          display: true,
          text: xLabel
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yLabel
        }
      }
    },
    elements: {
      line: {
        tension: 0.5 // Smoothes the line
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  if (
    data.datasets.length === 0 ||
    data.datasets.some((ds) => ds.data.length === 0)
  ) {
    return <>No data available to display.</>;
  } else {
    return <Line data={data} options={options} />;
  }
};

export default LineChart;

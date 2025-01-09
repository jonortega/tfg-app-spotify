"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
} from "chart.js";
import { ArrowLeft } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type TimeData = {
  [key: string]: number;
};

const timeScales = ["year", "month", "day"];

export default function LaBitacora() {
  const [data, setData] = useState<TimeData>({});
  const [currentScale, setCurrentScale] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (year?: string, month?: string) => {
    let url = "/api/stats/la-bitacora";
    if (year) {
      url += `?year=${year}`;
      if (month) url += `&month=${month}`;
    }

    const response = await fetch(url);
    const newData: TimeData = await response.json();
    setData(newData);
  };

  const handleBarClick = (event: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedPeriod = Object.keys(data)[index];

      if (currentScale < timeScales.length - 1) {
        setHistory([...history, selectedPeriod]);
        setCurrentScale(currentScale + 1);
        fetchData(...history, selectedPeriod);
      }
    }
  };

  const handleBack = () => {
    if (currentScale > 0) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentScale(currentScale - 1);
      fetchData(...newHistory);
    }
  };

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Tracks Saved",
        data: Object.values(data),
        backgroundColor: "rgba(30, 215, 96, 0.6)",
        borderColor: "rgba(30, 215, 96, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Tracks Saved by ${timeScales[currentScale].charAt(0).toUpperCase() + timeScales[currentScale].slice(1)}`,
      },
    },
    onClick: handleBarClick,
  };

  return (
    <div className='w-full h-full flex flex-col'>
      {currentScale > 0 && (
        <button onClick={handleBack} className='flex items-center text-spotify-green mb-4 hover:underline'>
          <ArrowLeft className='mr-2' size={20} />
          Back to {timeScales[currentScale - 1]}s
        </button>
      )}
      <div className='flex-grow'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

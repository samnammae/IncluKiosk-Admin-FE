import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import ListButton from "@/components/ui/button/ListButton";
import { useShopStore } from "@/lib/store/shopStore";
import { SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/lib/api/dashboard";
interface HourlyResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    labels: string[];
    datasets: {
      day: number[];
      week: number[];
      month: number[];
      all: number[];
    };
  };
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HourlyChart = () => {
  const [viewPeriod, setViewPeriod] = useState("오늘");
  const { choosedShop } = useShopStore();

  const { data, isLoading, isError } = useQuery<HourlyResponse>({
    queryKey: ["dashboard_category", choosedShop?.storeId],
    queryFn: () => dashboardAPI.getHourly(choosedShop!.storeId),
    enabled: !!choosedShop,
  });

  if (isLoading) {
    return <div className="h-100 bg-gray-100 animate-pulse rounded-xl" />;
  }
  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-80">
        <span className="text-red-500 font-semibold">
          시간대별 매출 조회에서 오류가 발생했습니다!
        </span>
      </div>
    );
  }
  const handlePeriodChange = (event: SelectChangeEvent) => {
    setViewPeriod(event.target.value);
  };

  const periodMap: Record<string, keyof typeof data.data.datasets> = {
    오늘: "day",
    이번주: "week",
    이번달: "month",
    전체: "all",
  };

  const labels = data.data.labels;
  const values = data.data.datasets[periodMap[viewPeriod]];
  const chartData = {
    labels,
    datasets: [
      {
        label: `시간대별 매출 (${viewPeriod})`,
        data: values,
        backgroundColor: "#10B981", // 초록색
        borderColor: "#10B981", // 초록 테두리
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },

      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="flex items-center justify-end px-3 ">
        <ListButton
          val={viewPeriod}
          options={["오늘", "이번주", "이번달", "전체"]}
          handleChange={handlePeriodChange}
        />
      </div>

      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HourlyChart;

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
  const { choosedShop } = useShopStore();
  const [viewPeriod, setViewPeriod] = useState("이번주");

  //핸들러
  const handlePeriodChange = (event: SelectChangeEvent) => {
    setViewPeriod(event.target.value);
  };

  //데이터 fetch
  const { data, isLoading, isError } = useQuery<HourlyResponse>({
    queryKey: ["dashboard_category", choosedShop?.storeId],
    queryFn: () => dashboardAPI.getHourly(choosedShop!.storeId),
    enabled: !!choosedShop,
  });

  //데이터 로딩 및 에러처리
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
  //데이터가 없는 경우
  const allZeros = data?.data.datasets.all.every((element) => element === 0);
  if (allZeros) {
    return (
      <div className="flex items-center justify-center h-80">
        <span className="text-gray-500">최근 주문 내역이 없습니다</span>
      </div>
    );
  }

  //필터 매핑
  const periodMap: Record<string, keyof typeof data.data.datasets> = {
    오늘: "day",
    이번주: "week",
    이번달: "month",
    전체: "all",
  };

  //차트 설정
  const labels = data?.data?.labels;
  const values = data?.data?.datasets[periodMap[viewPeriod]];
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
    maintainAspectRatio: false,
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
      <div className="px-3 mt-6 h-80 max-h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HourlyChart;

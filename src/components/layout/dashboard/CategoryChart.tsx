"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState } from "react";
import ListButton from "@/components/ui/button/ListButton";
import { SelectChangeEvent } from "@mui/material";
import ViewModeButtonGroup from "@/components/ui/button/ViewModeButtonGroup";
import { dashboardAPI } from "@/lib/api/dashboard";
import { useShopStore } from "@/lib/store/shopStore";
import { useQuery } from "@tanstack/react-query";

interface CategoryResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    today: { labels: string[]; values: number[] };
    week: { labels: string[]; values: number[] };
    month: { labels: string[]; values: number[] };
    all: { labels: string[]; values: number[] };
  };
}

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const palette = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8DD17E",
  "#E377C2",
  "#17BECF",
  "#BCBD22",
];

const CategoryChart = () => {
  const { choosedShop } = useShopStore();
  const [viewType, setViewType] = useState<"amount" | "items">("amount");
  const [viewPeriod, setViewPeriod] = useState("오늘");
  const { data, isLoading, isError } = useQuery<CategoryResponse>({
    queryKey: ["dashboard_category", choosedShop?.storeId, viewType],
    queryFn: () => dashboardAPI.getCategory(choosedShop!.storeId, viewType),
    enabled: !!choosedShop,
  });

  const periodMap: Record<string, keyof CategoryResponse["data"]> = {
    오늘: "today",
    이번주: "week",
    이번달: "month",
    전체: "all",
  };

  if (isLoading) {
    return <div className="h-100 bg-gray-100 animate-pulse rounded-xl" />;
  }
  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-80">
        <span className="text-red-500 font-semibold">
          카테고리별 매출 조회에서 오류가 발생했습니다!
        </span>
      </div>
    );
  }

  const { labels, values } = data.data[periodMap[viewPeriod]];
  const handlePeriodChange = (event: SelectChangeEvent) => {
    setViewPeriod(event.target.value);
  };
  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewType(event.target.value as "amount" | "items");
  };
  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => palette[i % palette.length]), // 팔레트에서 선택
        borderWidth: 2,
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
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}`;
        },
      },
    },
    cutout: "60%",
  };

  //중앙 텍스트
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart: any) => {
      const { width, height, ctx } = chart;
      ctx.save();

      const total = chartData.datasets[0].data.reduce(
        (a: number, b: number) => a + b,
        0
      );

      // 중앙 좌표
      const centerX = width / 2;
      const centerY = height / 2;
      const titleText = viewType === "amount" ? "총 주문금액" : "총 주문건수";
      const subText =
        viewType === "amount"
          ? `${total.toLocaleString()}원`
          : `${total.toLocaleString()}건`;
      // 첫 줄 (제목)
      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(titleText, centerX, centerY - 24);

      // 두 번째 줄 (합계 값)
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(subText, centerX, centerY);

      ctx.restore();
    },
  };

  return (
    <>
      <div className="flex items-center justify-between px-3 mb-4">
        <ViewModeButtonGroup
          viewType={viewType}
          handleChange={handleViewChange}
        />
        <ListButton
          val={viewPeriod}
          options={["오늘", "이번주", "이번달", "전체"]}
          handleChange={handlePeriodChange}
        />
      </div>

      {/* 차트 */}
      <Doughnut
        key={`${viewType}-${viewPeriod}`}
        data={chartData}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </>
  );
};

export default CategoryChart;

"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState } from "react";
import ListButton from "@/components/ui/button/ListButton";
import { SelectChangeEvent } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const mockData = {
  success: true,
  code: 200,
  message: "카테고리별 통계 조회 성공",
  data: {
    today: {
      labels: ["커피", "디저트", "샌드위치", "음료", "기타"],
      values: [35000, 12000, 8000, 15000, 4000],
    },
    week: {
      labels: ["커피", "디저트", "샌드위치", "음료", "기타"],
      values: [210000, 95000, 45000, 120000, 30000],
    },
    month: {
      labels: ["커피", "디저트", "샌드위치", "음료", "기타"],
      values: [880000, 420000, 220000, 500000, 120000],
    },
    all: {
      labels: ["커피", "디저트", "샌드위치", "음료", "기타"],
      values: [3250000, 1580000, 760000, 1890000, 500000],
    },
  },
};

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
  const periodMap: Record<string, keyof typeof mockData.data> = {
    오늘: "today",
    이번주: "week",
    이번달: "month",
    전체: "all",
  };

  const [viewType, setViewType] = useState("amount");
  const [viewPeriod, setViewPeriod] = useState("오늘");

  const { labels, values } = mockData.data[periodMap[viewPeriod]];
  const handlePeriodChange = (event: SelectChangeEvent) => {
    setViewPeriod(event.target.value);
  };
  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewType((event.target as HTMLInputElement).value);
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const ViewModeButtonGroup = ({
  viewType,
  handleChange,
}: {
  viewType: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <RadioGroup
      row
      value={viewType}
      onChange={handleChange}
      className="flex space-x-0"
    >
      <FormControlLabel
        value="amount"
        control={<Radio size="small" />}
        label="주문 금액"
      />
      <FormControlLabel
        value="count"
        control={<Radio size="small" />}
        label="주문 건수"
      />
    </RadioGroup>
  );
};

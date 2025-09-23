import ListButton from "@/components/ui/button/ListButton";
import { SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import CalendarModal from "../modal/CalendarModal";
import ViewModeButtonGroup from "@/components/ui/button/ViewModeButtonGroup";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/lib/api/dashboard";

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
import { Line } from "react-chartjs-2";
import { useShopStore } from "@/lib/store/shopStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type DateRange = [Date, Date] | Date;

const PeriodChart = () => {
  const { choosedShop } = useShopStore(); //매장 id

  // view mode관련 state
  const [viewPeriod, setViewPeriod] = useState("일 단위");
  const [viewType, setViewType] = useState<"amount" | "counts" | "items">(
    "amount"
  );

  const [isOpen, setIsOpen] = useState(false); //modal 열고 닫기
  const [date, setDate] = useState<DateRange>(new Date()); //날짜 date State

  //이벤트 핸들러
  const onClose = () => {
    setIsOpen(false);
  };
  const handlePeriodChange = (event: SelectChangeEvent) => {
    setViewPeriod(event.target.value);
    setDate(new Date());
  };
  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewType(event.target.value as "amount" | "counts" | "items");
  };

  // 데이터 조회 과정
  // unit 변환
  const unitMap: Record<string, "daily" | "weekly" | "monthly"> = {
    "일 단위": "daily",
    "주 단위": "weekly",
    "월 단위": "monthly",
  };

  // 날짜 포맷 함수
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  // API 요청 옵션 만들기
  const options = React.useMemo(() => {
    if (viewPeriod === "직접 날짜 지정" && Array.isArray(date)) {
      const [start, end] = date;
      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
      };
    } else {
      return {
        unit: unitMap[viewPeriod] || "daily",
        limit: 7,
      };
    }
  }, [viewPeriod, date]);

  //데이터 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "period", choosedShop?.storeId, options], // 캐싱 키
    queryFn: () => dashboardAPI.getPeriod(choosedShop!.storeId, options),
    enabled: !!choosedShop, // storeId 없으면 실행 안 함
  });

  //데이터 로딩 or 에러처리
  if (isLoading) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />;
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center h-80">
        <span className="text-red-500 font-semibold">
          기간별 매출 조회에서 오류가 발생했습니다!
        </span>
      </div>
    );
  }

  //차트 데이터 설정
  const chartData = {
    labels: data?.data?.labels ?? [],
    datasets: [
      {
        label:
          viewType === "amount"
            ? "매출액"
            : viewType === "counts"
            ? "주문건수"
            : "판매 수량",
        data:
          viewType === "amount"
            ? data?.data?.amounts ?? []
            : viewType === "counts"
            ? data?.data?.counts ?? []
            : data?.data?.items ?? [],
        borderColor: "#6f48eb",
        backgroundColor: "rgba(111,72,235,0.1)",
        tension: 0.4,
      },
    ],
  };

  //차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, //높이 따라가기
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <>
      {/* 상단 옵션 컨테이너 */}
      <div className="flex items-center justify-between px-3">
        <ViewModeButtonGroup
          viewType={viewType}
          handleChange={handleViewChange}
          isExtend={true}
        />
        <div className="flex items-center gap-10">
          {viewPeriod === "직접 날짜 지정" && (
            <div className="relative">
              <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md"
              >
                {Array.isArray(date)
                  ? `${formatDate(date[0])} ~ ${formatDate(date[1])}`
                  : "📅 조회 기간 선택"}
              </button>
              {isOpen && (
                <CalendarModal
                  date={date}
                  setDate={setDate}
                  onClose={onClose}
                />
              )}
            </div>
          )}
          <ListButton
            val={viewPeriod}
            options={["일 단위", "주 단위", "월 단위", "직접 날짜 지정"]}
            handleChange={handlePeriodChange}
          />
        </div>
      </div>

      <div className="px-3 mt-6 h-96">
        <Line data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default PeriodChart;

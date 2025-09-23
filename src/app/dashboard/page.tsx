import DashboardContainer from "@/components/layout/dashboard/DashboardContainer";
import TitleHeader from "@/components/ui/title/TitleHeader";

export default function Dashboard() {
  return (
    <div className="max-w-8xl mx-auto p-2">
      {/* 헤더 */}
      <TitleHeader
        title={"대시보드"}
        subText={"주문 통계 및 최근 주문을 확인할 수 있어요"}
      />
      <DashboardContainer />
    </div>
  );
}

import RecentTable from "@/components/layout/table/RecentTable";
import TitleHeader from "@/components/ui/title/TitleHeader";

export default function OrdersPage() {
  return (
    <div className="max-w-8xl mx-auto p-2">
      {/* 헤더 */}
      <TitleHeader
        title={"주문 관리"}
        subText={"최근 주문 내역을 확인할 수 있어요"}
      />
      <RecentTable />
    </div>
  );
}

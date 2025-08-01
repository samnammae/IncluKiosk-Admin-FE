import CategoryManage from "@/components/layout/menu/CategoryManage";
import MenuManage from "@/components/layout/menu/MenuManage";
import TitleHeader from "@/components/ui/title/TitleHeader";

export default function MenuPage() {
  return (
    <div className="max-w-8xl mx-auto p-2">
      <TitleHeader
        title={"매뉴 관리"}
        subText={"카테고리와 메뉴 그리고 옵션을 쉽게 추가하고 편집해보세요"}
      />
      <CategoryManage />
      <MenuManage />
    </div>
  );
}

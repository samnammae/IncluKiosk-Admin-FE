import OptionManage from "@/components/layout/option/OptionManage";
import TitleHeader from "@/components/ui/title/TitleHeader";

export default function OptionPage() {
  return (
    <div className="max-w-8xl mx-auto p-2">
      <TitleHeader
        title={"옵션 관리"}
        subText={"메뉴 옵션 그룹과 개별 옵션을 관리하고 가격을 설정하세요"}
      />
      <OptionManage />
    </div>
  );
}

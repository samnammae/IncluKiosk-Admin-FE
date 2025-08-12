"use client";

import { SectionTitle } from "@/components/ui/title/SectionTitle";
import { useShopStore } from "@/lib/store/shopStore";
import React, { useEffect, useState } from "react";
import NoShopGuide from "../NoShopGuide";
import CategoryAdd from "./CategoryAdd";
import CategoryContainer from "./CategoryContainer";
import { categoryAPI } from "@/lib/api/category";
import { useQuery } from "@tanstack/react-query";

const CategoryManage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  const { choosedShop } = useShopStore();
  // React Query로 데이터 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAllCategory(choosedShop!.storeId),
    enabled: !!choosedShop,
  });

  // 매장이 없는 경우 안내 컴포넌트 표시
  if (!choosedShop) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <NoShopGuide
          subText={
            " 메뉴와 카테고리를 관리하려면 매장을 선택하거나 새로 등록해야 합니다."
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      {/* 카테고리 관리 제목 */}
      <SectionTitle
        title={"카테고리 관리"}
        subText={"클릭하여 수정/삭제를 하고 드래그 드롭으로 순서를 바꿔보세요"}
        buttonText="+ 카테고리 추가"
        buttonClassName="px-3 py-2 text-sm"
        buttonClick={() => {
          setIsOpenAdd(!isOpenAdd);
        }}
      />
      {/* 카테고리 생성 */}
      {isOpenAdd && <CategoryAdd setIsOpenAdd={setIsOpenAdd} />}

      {/* 카테고리 드래그앤 드롭 */}
      <CategoryContainer />
    </div>
  );
};

export default CategoryManage;

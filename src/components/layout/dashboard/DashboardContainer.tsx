"use client";
import { SectionTitle } from "@/components/ui/title/SectionTitle";
import { dashboardAPI } from "@/lib/api/dashboard";
import { useShopStore } from "@/lib/store/shopStore";
import React, { useEffect } from "react";
import CategoryChart from "./CategoryChart";

const DashboardContainer = () => {
  const { choosedShop } = useShopStore();
  useEffect(() => {
    if (choosedShop !== null)
      dashboardAPI.getCategory(choosedShop!.storeId, "count");
  }, []);
  return (
    <div className="max-w-8xl mx-auto p-2 space-y-6">
      <div className="bg-white shadow-sm rounded-xl p-6">
        <SectionTitle title={"🧾 기간별 매출"} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-6 lg:col-span-2">
          <SectionTitle title={"🕐 시간대별 매출"} />
        </div>
        <div className="bg-white shadow-sm rounded-xl p-6 lg:col-span-1">
          <SectionTitle title={"📚 카테고리별 매출"} />
          <CategoryChart />
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-xl p-6">
        <SectionTitle title={"📋 최근 주문 기록"} />
      </div>
    </div>
  );
};

export default DashboardContainer;

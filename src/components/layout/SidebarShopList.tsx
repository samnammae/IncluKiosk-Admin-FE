"use client";

import { useEffect, useState } from "react";
import { shopAPI } from "@/lib/api/shop";
import { ShopType, useShopStore } from "@/lib/store/shopStore";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMenuAndCategory } from "@/hooks/useMenuQueries";

const SidebarShopList = () => {
  const result = useMenuAndCategory();
  console.log("통합 훅 호출 자동화", result);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { shops, choosedShop, setShops, setChooseShop } = useShopStore();

  // 데이터 조회
  const { data, isLoading } = useQuery({
    queryKey: ["shops"],
    queryFn: shopAPI.getAllShop,
  });

  useEffect(() => {
    if (data?.success && data.data) {
      const lastShopId = localStorage.getItem("lastShop");

      if (lastShopId) {
        //마지막 매장 정보를 불러오기
        const savedShop = data.data.find(
          (s: ShopType) => String(s.storeId) === lastShopId
        );
        if (savedShop) setChooseShop(savedShop);
        else setChooseShop(data.data[0]); // 없으면 첫 번째 매장 선택
      } else setChooseShop(data.data[0]); // 저장된 게 없으면 첫 번째 매장 선택

      setShops(data.data, data.data.length);
    }
  }, [data, setShops, setChooseShop]);

  const handleShopSelect = (shop: ShopType) => {
    localStorage.setItem("lastShop", String(shop.storeId));
    setChooseShop(shop);
    setIsOpen(false);
  };

  return (
    <>
      {/* 현재 매장 표시 */}
      <div className="mx-5 mb-5 relative">
        <div
          className="bg-white/10 border border-white/20 rounded-lg p-3 cursor-pointer hover:bg-white/15 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {choosedShop?.name && (
            <div className="text-xs text-white/70 mb-1 uppercase tracking-wider">
              현재 매장
            </div>
          )}
          <div className="text-sm font-semibold flex items-center justify-between w-full">
            <span>
              {isLoading
                ? "로딩 중..."
                : choosedShop?.name || "매장을 선택하세요"}
            </span>
            <span
              className={`text-xs transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </div>
        </div>

        {/* 드로어 */}
        <div
          className={`
            absolute top-full left-0 right-0 bg-white rounded-lg shadow-2xl z-50 overflow-hidden
            transition-all duration-300 ease-in-out
            ${
              isOpen
                ? "opacity-100 translate-y-1 max-h-80 overflow-y-scroll"
                : "opacity-0 translate-y-0 max-h-0"
            }
          `}
        >
          <div className="py-2">
            {/* 매장 목록 */}
            {shops?.map((shop) => (
              <button
                key={shop.storeId}
                onClick={() => handleShopSelect(shop)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                  flex items-center justify-between text-gray-700 text-sm
                  ${
                    choosedShop?.storeId === shop.storeId
                      ? "bg-blue-50 text-brand-main font-medium"
                      : ""
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <div className={"w-2 h-2 rounded-full"} />
                  {shop.name}
                </span>
                {choosedShop?.storeId === shop.storeId && (
                  <span className="text-brand-main">✓</span>
                )}
              </button>
            ))}

            {/* 구분선 */}
            <div className="border-t border-gray-200 my-2" />

            {/* 새 매장 추가 버튼 */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/shop/add");
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-brand-main text-sm font-medium flex items-center gap-3"
            >
              <span className="text-lg">+</span>새 매장 추가
            </button>
          </div>
        </div>
      </div>

      {/* 오버레이 (드로어가 열렸을 때 외부 클릭으로 닫기) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarShopList;

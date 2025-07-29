"use client";
import TitleHeader from "@/components/ui/title/TitleHeader";
import SearchBar from "@/components/ui/card/SearchBar";
import ShopCard from "@/components/ui/card/ShopCard";
import ShopListItem from "@/components/ui/card/ShopListItem";
import ViewMode from "@/components/ui/card/ViewMode";

import { shopAPI } from "@/lib/api/shop";
import { useShopStore } from "@/lib/store/shopStore";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const { shops, setShops } = useShopStore();

  const getAllShops = async () => {
    setIsLoading(true);
    try {
      const response = await shopAPI.getAllShop();
      if (response.success) {
        setShops(response.data, response.data.length);
      }
    } catch (error) {
      console.error("매장 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllShops();
  }, []);

  // 검색 필터링
  const filteredShops =
    shops?.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.phone.includes(searchQuery)
    ) || [];

  console.log("shopsshopsshopsshopsshops", shops);

  return (
    <div className="max-w-8xl mx-auto p-2">
      {/* 헤더 */}
      <TitleHeader
        title={"매장 관리"}
        subText={"키오스크에서 사용할 매장 정보를 관리할 수 있어요"}
      />

      {/* 검색 및 필터 바*/}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start  justify-between">
          <div className="flex-1">
            <SearchBar
              searchQuery={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              count={filteredShops.length}
            />
          </div>
          <ViewMode
            viewMode={viewMode}
            onCardClick={() => setViewMode("card")}
            onListClick={() => setViewMode("list")}
          />
        </div>{" "}
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-10 shadow-sm">
          <div className="animate-pulse">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 매장 목록 */
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {filteredShops.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery
                  ? "검색 결과가 없습니다"
                  : "등록된 매장이 없습니다"}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "다른 검색어를 시도해보세요"
                  : "새로운 매장을 등록해보세요"}
              </p>
            </div>
          ) : viewMode === "card" ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredShops.map((item) => (
                <ShopCard
                  key={item.storeId}
                  storeId={item.storeId}
                  image={item.mainImg}
                  name={item.name}
                  address={item.address}
                  phone={item.phone}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShops.map((item) => (
                <ShopListItem key={item.storeId} shop={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

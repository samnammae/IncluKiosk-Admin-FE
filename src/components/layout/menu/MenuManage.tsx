"use client";
import SearchBar from "@/components/ui/card/SearchBar";
import ViewMode from "@/components/ui/card/ViewMode";
import { SectionTitle } from "@/components/ui/title/SectionTitle";
import MenuCardGrid from "./MenuCardGrid";
import React, { useState, useMemo } from "react";
import MenuListContainer from "./MenuListContainer";
import { useMenuStore } from "@/lib/store/MenuStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuAPI } from "@/lib/api/menu";
import { useShopStore } from "@/lib/store/shopStore";
import MenuFormModal from "../modal/MenuFormModal";
import { useNotification } from "@/hooks/useNotification";

const MenuManage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const [addModalOpen, setAddModalOpen] = useState(false);

  const { categories, menus } = useMenuStore();

  console.log("menus조회", menus);

  // 현재 선택된 카테고리의 메뉴들
  const currentMenus = useMemo(() => {
    if (selectedCategory === "전체") {
      return Object.values(menus).flat(); // 모든 카테고리의 메뉴를 합침
    }
    return menus[selectedCategory] || [];
  }, [menus, selectedCategory]);

  // 검색 필터링된 메뉴들
  const filteredMenus = useMemo(() => {
    if (!searchQuery.trim()) return currentMenus;

    return currentMenus.filter(
      (menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentMenus, searchQuery]);
  const showNotification = useNotification((state) => state.showNotification);
  const queryClient = useQueryClient();
  const { choosedShop } = useShopStore();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return menuAPI.deleteMenu(choosedShop!.storeId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      showNotification("메뉴 삭제에 성공했습니다", { severity: "success" });
    },
    onError: (error) => {
      console.error("❌ 메뉴 삭제 실패:", error);
      showNotification("메뉴 삭제 실패", { severity: "error" });
    },
  });
  //수정 mutation
  const toggleSoldOutMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      console.log("mutation 직전 결과", choosedShop!.storeId, id, formData);
      return menuAPI.updateMenu(choosedShop!.storeId, id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      showNotification("메뉴 품절처리 변경", { severity: "success" });
    },
    onError: (error) => {
      console.error("❌ 메뉴 품절처리 변경 실패:", error);
      showNotification("메뉴 품절처리 변경 실패", { severity: "error" });
    },
  });
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  //메뉴 수정을 위한 카테고리id 찾기 함수
  const findCategoryId = (menuId: string) => {
    const includCategoryName = Object.entries(menus).find(([category, items]) =>
      items.some((item) => item.id === menuId)
    );
    const targetCategoriesId = categories.find(
      (ele) => ele.name === includCategoryName?.[0]
    );
    return targetCategoriesId?.id || null;
  };

  const handleToggleSoldOut = (id: string) => {
    // 현재 메뉴 찾기
    const currentMenu = filteredMenus.find((menu) => menu.id === id);
    if (!currentMenu) return;

    const categoryId = findCategoryId(id);
    const newSoldOutStatus = !currentMenu.isSoldOut;

    console.log("품절처리 핸들 함수 과정", currentMenu);
    console.log("품절처리 핸들 함수 과정- 옵션", currentMenu.optionCategoryIds);
    console.log("품절처리 핸들 함수 과정 카테고리 id", categoryId);

    const formData = new FormData();

    // 기존 정보 + 변경된 soldOut 상태
    const requestData = {
      name: currentMenu.name,
      price: currentMenu.price,
      description: currentMenu.description,
      categoryId: categoryId || "",
      optionCategoryIds: JSON.stringify(currentMenu.optionCategoryIds || []),
      isSoldOut: newSoldOutStatus, // 토글된 상태
    };

    console.log("품절처리", requestData);

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      })
    );

    toggleSoldOutMutation.mutate({
      id: id,
      formData: formData,
    });
  };
  console.log("filteredMenusfilteredMenus", filteredMenus);
  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <SectionTitle
          title={"메뉴 관리"}
          subText={
            "클릭하여 수정/삭제를 하고 드래그 드롭으로 순서를 바꿔보세요"
          }
          buttonText="+ 메뉴 추가"
          buttonClassName="px-3 py-2 text-sm"
          buttonClick={() => {
            setAddModalOpen(true);
          }}
        />

        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
            <div className="flex-1">
              <SearchBar
                searchQuery={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                count={filteredMenus.length}
                placeholder={"메뉴 관련 정보로 검색해 보세요"}
              />
            </div>
            <ViewMode
              viewMode={viewMode}
              onCardClick={() => setViewMode("card")}
              onListClick={() => setViewMode("list")}
            />
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("전체")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "전체"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 메뉴 카드 그리드 */}
        {viewMode === "card" && (
          <MenuCardGrid
            data={filteredMenus}
            onDelete={handleDelete}
            onToggleSoldOut={handleToggleSoldOut}
          />
        )}

        {/* 리스트 뷰는 여기에 추가 */}
        {viewMode === "list" && (
          <MenuListContainer
            data={filteredMenus}
            onDelete={handleDelete}
            onToggleSoldOut={handleToggleSoldOut}
          />
        )}
      </div>
      <MenuFormModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
        }}
        onConfirm={() => {}}
        mode="create"
      />
    </>
  );
};

export default MenuManage;

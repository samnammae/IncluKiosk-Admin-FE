"use client";
import SearchBar from "@/components/ui/card/SearchBar";
import ViewMode from "@/components/ui/card/ViewMode";
import { SectionTitle } from "@/components/ui/title/SectionTitle";
import MenuCardGrid from "./MenuCardGrid";
import React, { useState, useMemo } from "react";
import MenuListContainer from "./MenuListContainer";
import { useMenuStore } from "@/lib/store/MenuStore";
import AddMenuModal from "../modal/AddMenuModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuAPI } from "@/lib/api/menu";
import { useShopStore } from "@/lib/store/shopStore";

const MenuManage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const [addModalOpen, setAddModalOpen] = useState(false);

  const { categories, menus } = useMenuStore();

  console.log("menus조회", menus);
  // 현재 선택된 카테고리의 메뉴들
  // 이 부분은 이미 올바르게 작성되어 있음
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

  const queryClient = useQueryClient();
  const { choosedShop } = useShopStore();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return menuAPI.deleteMenu(choosedShop!.storeId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      alert("메뉴 삭제에 성공했습니다.");
    },
    onError: (error) => {
      console.error("❌ 메뉴 삭제 실패:", error);
      alert("메뉴 삭제에 실패했습니다.");
    },
  });

  const handleEdit = (id: string) => {
    console.log("Edit menu:", id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleSoldOut = (id: string) => {
    console.log("Toggle sold out:", id);
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
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleSoldOut={handleToggleSoldOut}
          />
        )}

        {/* 리스트 뷰는 여기에 추가 */}
        {viewMode === "list" && (
          <MenuListContainer
            data={filteredMenus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleSoldOut={handleToggleSoldOut}
          />
        )}
      </div>
      <AddMenuModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
        }}
        onConfirm={() => {}}
      />
    </>
  );
};

export default MenuManage;

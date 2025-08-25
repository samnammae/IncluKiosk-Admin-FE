"use client";
import SearchBar from "@/components/ui/card/SearchBar";
import { SectionTitle } from "@/components/ui/title/SectionTitle";
import React, { useEffect, useMemo, useState } from "react";
import ViewMode from "./ViewMode";
import { optionAPI } from "@/lib/api/option";
import { useShopStore } from "@/lib/store/shopStore";
import OptionCard from "./OptionCard";
import { useMenuStore } from "@/lib/store/MenuStore";
import OptionFormModal, { OptionGroupFormData } from "../modal/OptionFormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/hooks/useNotification";

const OptionManage = () => {
  const showNotification = useNotification((state) => state.showNotification);
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState(""); //검색어
  const [chooseLabel, setChooseLabel] = useState("전체"); //전체/필수/선택
  const [isCreateModal, setIsCreateModal] = useState(false); //생성 모달

  const { optionCategories } = useMenuStore();
  const { choosedShop } = useShopStore();

  const filteredData = useMemo(() => {
    let filtered = optionCategories;
    // 필수/선택 필터링
    if (chooseLabel === "필수")
      filtered = filtered.filter((option) => option.required);
    else if (chooseLabel === "선택")
      filtered = filtered.filter((option) => !option.required);

    //  검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter((option) => {
        const groupNameMatch = option.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const optionNameMatch = option.options.some((opt) =>
          opt.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return groupNameMatch || optionNameMatch;
      });
    }

    return filtered;
  }, [optionCategories, searchQuery, chooseLabel]);

  const createCategoriesMutation = useMutation({
    mutationFn: ({
      storeId,
      data,
    }: {
      storeId: number;
      data: OptionGroupFormData;
    }) => optionAPI.addOptions(storeId, data),
    onSuccess: () => {
      console.log("옵션 카테고리 생성 성공");
      showNotification("옵션그룹 생성 성공", { severity: "success" });
      queryClient.invalidateQueries({ queryKey: ["option"] });
      setIsCreateModal(false);
    },
    onError: (error) => {
      console.log("옵션 카테고리 생성 오류", error);
      showNotification("옵션그룹 생성 실패", { severity: "error" });
    },
  });
  const handleCreateSubmit = (data: OptionGroupFormData) => {
    createCategoriesMutation.mutate({
      storeId: choosedShop!.storeId,
      data,
    });
  };
  const openCreateModal = () => {
    console.log("클릭");
    setIsCreateModal(true);
  };
  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <SectionTitle
          title={"옵션 그룹"}
          subText={
            "사이즈, 온도, 토핑 등의 옵션 그룹을 만들고 개별 옵션들을 추가하세요"
          }
          buttonText="+ 그룹 추가"
          buttonClassName="px-3 py-2 text-sm"
          buttonClick={openCreateModal}
        />

        {/* 검색바 및 뷰모드 슬라이드 그룹 */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <SearchBar
                searchQuery={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                count={0}
                placeholder={"옵션 관련 정보로 검색해 보세요"}
              />
            </div>
            <ViewMode
              chooseLabel={chooseLabel}
              setChooseLabel={setChooseLabel}
            />
          </div>
        </div>

        <div
          className="grid gap-6 
      grid-cols-1 
      sm:grid-cols-1 
      md:grid-cols-2 
      xl:grid-cols-3 
      2xl:grid-cols-4
      auto-rows-fr"
        >
          {filteredData.map((item) => (
            <OptionCard key={item.id} optionItem={item} />
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              옵션 그룹이 없습니다
            </h3>
            <p className="text-gray-500 mb-4">
              첫 번째 옵션 그룹을 만들어 보세요
            </p>
            <button
              className="px-4 py-2 bg-gradient-to-r from-brand-main to-brand-dark text-white rounded-lg hover:shadow-lg transition-shadow"
              onClick={() => {
                openCreateModal();
              }}
            >
              + 그룹 추가
            </button>
          </div>
        )}
      </div>
      {/* 생성 모달 */}
      <OptionFormModal
        isOpen={isCreateModal}
        onClose={() => setIsCreateModal(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createCategoriesMutation.isPending}
      />
    </>
  );
};

export default OptionManage;

import { optionCategoriesType } from "@/lib/store/MenuStore";
import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { optionAPI } from "@/lib/api/option";
import { useNotification } from "@/hooks/useNotification";
import { useShopStore } from "@/lib/store/shopStore";
import ConfirmModal from "../modal/ConfirmModal";
import OptionFormModal, { OptionGroupFormData } from "../modal/OptionFormModal";

interface OptionCardProps {
  optionItem: optionCategoriesType;
}

const OptionCard: React.FC<OptionCardProps> = ({ optionItem }) => {
  const showNotification = useNotification((state) => state.showNotification);
  const { choosedShop } = useShopStore();
  const queryClient = useQueryClient();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const deleteCategoriesMutation = useMutation({
    mutationFn: ({
      storeId,
      optionCategoryId,
    }: {
      storeId: number;
      optionCategoryId: number;
    }) => optionAPI.deleteOptionCategory(storeId, optionCategoryId),
    onSuccess: () => {
      console.log("옵션 카테고리 삭제 성공");
      showNotification("옵션그룹 삭제 성공", { severity: "success" });
      setIsDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["option"] });
    },
    onError: (error) => {
      console.log("옵션 카테고리 삭제 오류", error);
      showNotification("옵션그룹 삭제 실패", { severity: "error" });
    },
  });
  const updateCategoriesMutation = useMutation({
    mutationFn: ({
      storeId,
      optionCategoryId,
      data,
    }: {
      storeId: number;
      optionCategoryId: number;
      data: OptionGroupFormData;
    }) => optionAPI.editOptios(storeId, optionCategoryId, data),
    onSuccess: () => {
      console.log("옵션 카테고리 수정 성공");
      showNotification("옵션그룹 수정 성공", { severity: "success" });
      queryClient.invalidateQueries({ queryKey: ["option"] });
      setIsEditModal(false);
    },
    onError: (error) => {
      console.log("옵션 카테고리 수정 오류", error);
      showNotification("옵션그룹 수정 실패", { severity: "error" });
    },
  });

  const handleCategoiesDelete = () => {
    deleteCategoriesMutation.mutate({
      storeId: choosedShop!.storeId,
      optionCategoryId: optionItem.id,
    });
  };

  const handleEditSubmit = (data: OptionGroupFormData) => {
    const dataWithoutIds = {
      ...data,
      options: data.options.map(({ id, ...option }) => option),
    };
    updateCategoriesMutation.mutate({
      storeId: choosedShop!.storeId,
      optionCategoryId: optionItem.id,
      data: dataWithoutIds,
    });
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow w-100">
        {/* 카드 헤더 */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {optionItem.name}
            </h3>
            <div className="flex gap-2">
              {/* 필수/선택 태그 */}
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  optionItem.required
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {optionItem.required ? "필수" : "선택"}
              </span>

              {/* 타입 태그 */}
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {optionItem.type === "SINGLE" ? "하나 선택" : "다중 선택"}
              </span>
            </div>
          </div>

          {/* 그룹 액션 버튼 */}
          <div className="flex gap-1">
            <IconButton
              size="medium"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModal(true);
              }}
              sx={{ color: "primary.main" }}
            >
              <EditIcon fontSize="medium" />
            </IconButton>
            <IconButton
              size="medium"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModal(true);
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </div>
        </div>

        {/* 옵션 리스트 */}
        <div className="space-y-2 mb-4">
          {optionItem.options.map((option) => {
            return (
              <div
                key={option.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md border-l-4 border-blue-400"
              >
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {option.name}
                    {option.default && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                        기본
                      </span>
                    )}
                  </div>
                  {option.price > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      +{option.price.toLocaleString()}원
                    </div>
                  )}
                  {option.price === 0 && (
                    <div className="text-sm text-gray-500 mt-1">+0원</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 옵션 추가 버튼 */}
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
          <AddRoundedIcon sx={{ width: 16 }} />
          옵션 추가
        </button>
      </div>
      <ConfirmModal
        isOpen={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        onConfirm={handleCategoiesDelete}
        purpose={"옵션 그룹"}
        targetName={optionItem!.name}
        isLoading={deleteCategoriesMutation.isPending}
      />
      <OptionFormModal
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        onSubmit={handleEditSubmit}
        editData={optionItem}
        isLoading={updateCategoriesMutation.isPending}
      />
    </>
  );
};

export default OptionCard;

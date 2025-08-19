"use client";
import CancelButton from "@/components/ui/button/CancelButton";
import DeleteButton from "@/components/ui/button/DeleteButton";
import ClosedIcon from "@/components/ui/icon/ClosedIcon";
import { useEffect, useState } from "react";
import { CategoryItem } from "./CategoryContainer";
import AcceptButton from "@/components/ui/button/AcceptButton";
import ConfirmModal from "../modal/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryAPI, updateCategoryData } from "@/lib/api/category";
import { useShopStore } from "@/lib/store/shopStore";
import { useNotification } from "@/hooks/useNotification";
interface CategoryUpdateModal {
  isOpen: boolean;
  onClose: () => void;
  choosedCategory: CategoryItem | null;
}
const CategoryUpdateModal: React.FC<CategoryUpdateModal> = ({
  isOpen,
  onClose,
  choosedCategory,
}) => {
  const queryClient = useQueryClient();
  const showNotification = useNotification((state) => state.showNotification);
  const [inputValue, setInputValue] = useState(choosedCategory?.name || "");
  const [showError, _setShowError] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateCategory, setUpdateCategory] = useState<updateCategoryData[]>([
    {
      id: "",
      name: "",
      displayOrder: 0,
    },
  ]);

  useEffect(() => {
    if (choosedCategory) {
      console.log("선택한 카테고리", choosedCategory);
      setInputValue(choosedCategory.name);
      setUpdateCategory([choosedCategory]);
      console.log("update스테이트", updateCategory);
    }
  }, [choosedCategory]);

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setUpdateCategory((prev) => [{ ...prev[0], name: e.target.value }]);
  };

  const { choosedShop } = useShopStore();
  const deleteMutation = useMutation({
    mutationFn: () => {
      return categoryAPI.deleteCategory(
        choosedShop!.storeId,
        choosedCategory!.id
      );
    },
    onSuccess: () => {
      showNotification("카테고리가 삭제되었습니다", { severity: "success" });
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (error) => {
      console.error("❌ 카테고리 삭제 실패:", error);
      showNotification("카테고리 삭제 실패", { severity: "error" });
    },
  });
  const updateMutation = useMutation({
    mutationFn: () => {
      return categoryAPI.updateCategory(choosedShop!.storeId, updateCategory);
    },
    onSuccess: () => {
      showNotification("카테고리가 수정되었습니다", { severity: "success" });
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (error) => {
      console.error("❌ 카테고리 수정 실패:", error);
      showNotification("카테고리 수정 실패", { severity: "error" });
    },
  });
  const handleDelete = () => {
    deleteMutation.mutate();
    onClose();
  };

  const handleUpdate = () => {
    updateMutation.mutate();
    onClose();
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="p-6 relative max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl">
          {/* 닫기 버튼 */}
          <div
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ClosedIcon />
          </div>

          {/* 모달 내용 */}
          <div>
            {/* 제목 */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
              카테고리 수정/삭제
            </h2>

            {/* 확인 입력 */}
            <div className="mb-6">
              <label
                htmlFor="shopNameInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                수정하고 싶은 카테고리명을 입력해주세요:
              </label>
              <input
                id="shopNameInput"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors `}
              />
              {showError && (
                <p className="text-red-600 text-sm mt-1">
                  카테고리 이름을 입력해주세요.
                </p>
              )}
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-3 justify-between">
              <DeleteButton
                onClick={() => {
                  setIsDeleteModalOpen(true);
                }}
                className="text-sm !p-3"
              >
                삭제하기
              </DeleteButton>
              <div className="flex gap-3 justify-end">
                <AcceptButton
                  onClick={() => {
                    handleUpdate();
                  }}
                  className="text-sm !p-3"
                >
                  수정하기
                </AcceptButton>
                <CancelButton onClick={handleClose} className="text-sm !p-3">
                  취소
                </CancelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        purpose={"카테고리"}
        targetName={choosedCategory!.name}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default CategoryUpdateModal;

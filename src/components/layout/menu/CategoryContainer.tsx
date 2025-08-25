import React, { useRef, useState } from "react";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import CategoryUpdateModal from "./CategoryUpdateModal";
import { useMenuStore } from "@/lib/store/MenuStore";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@/hooks/useNotification";
import { categoryAPI, updateCategoryData } from "@/lib/api/category";
import { useShopStore } from "@/lib/store/shopStore";

export interface CategoryItem {
  id: string;
  name: string;
  displayOrder: number;
}

const CategoryContainer = () => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [choosedCategory, setChooseCategory] = useState<CategoryItem | null>(
    null
  );

  const { categories, updateCategories } = useMenuStore();
  const { choosedShop } = useShopStore();
  const showNotification = useNotification((state) => state.showNotification);
  const updateMutation = useMutation({
    mutationFn: ({
      shopId,
      data,
    }: {
      shopId: number;
      data: updateCategoryData[];
    }) => {
      return categoryAPI.updateCategory(shopId, data);
    },
    onSuccess: () => {
      console.log("카테고리 드래그드롭 순서수정 성공");
      showNotification("카테고리 순서 변경", { severity: "success" });
    },
    onError: (error) => {
      console.log("카테고리 드래그드롭 순서수정 실패", error);
      showNotification("카테고리 순서 변경 실패", { severity: "error" });
    },
  });
  // 드래그 시작
  const dragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50", "rotate-2");
  };

  // 드래그 중
  const dragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    e.currentTarget.classList.add("border-blue-400", "bg-blue-50");
  };

  // 드랍
  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // 시각적 효과 제거
    document.querySelectorAll(".opacity-50").forEach((el) => {
      el.classList.remove("opacity-50", "rotate-2");
    });
    document.querySelectorAll(".border-blue-400").forEach((el) => {
      el.classList.remove("border-blue-400", "bg-blue-50");
    });

    if (dragItem.current === null || dragOverItem.current === null) return;

    // 동일한 위치면 API 호출 안함
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const newCategories = [...categories];
    const dragItemValue = newCategories[dragItem.current];
    newCategories.splice(dragItem.current, 1);
    newCategories.splice(dragOverItem.current, 0, dragItemValue);

    // displayOrder 업데이트
    const updatedCategories = newCategories.map((category, index) => ({
      ...category,
      displayOrder: index + 1,
    }));

    updateCategories(updatedCategories);

    if (choosedShop) {
      updateMutation.mutate({
        shopId: choosedShop.storeId,
        data: updatedCategories,
      });
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="group flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-300 transition-all duration-200"
            draggable
            onClick={() => {
              setChooseCategory(category);
              setIsModalOpen(true);
            }}
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
          >
            {/* 드래그 핸들 */}
            <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
              <DragIndicatorRoundedIcon sx={{ fontSize: 20 }} />
            </div>
            {/* 카테고리 이름 */}
            <div className="font-semibold text-gray-800 min-w-0 flex-1">
              {category.name}
            </div>
            {/* 순서 배지 */}
            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
              {category.displayOrder}
            </div>
          </div>
        ))}

        {/* 카테고리가 없을 때 */}
        {categories.length === 0 && (
          <div className="text-gray-500 text-center w-full py-8">
            등록된 카테고리가 없습니다
          </div>
        )}
      </div>

      {/* 수정모달 */}
      <CategoryUpdateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        choosedCategory={choosedCategory}
      />
    </div>
  );
};

export default CategoryContainer;

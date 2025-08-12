import React, { useEffect, useRef, useState } from "react";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import CategoryUpdateModal from "./CategoryUpdateModal";
import { categoryAPI } from "@/lib/api/category";
import { useQuery } from "@tanstack/react-query";
import { useShopStore } from "@/lib/store/shopStore";
import { menuAPI } from "@/lib/api/menu";
export interface CategoryItem {
  id: string;
  name: string;
  displayOrder: number;
}

const CategoryContainer = () => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: "1", name: "커피", displayOrder: 1 },
    { id: "2", name: "디저트", displayOrder: 2 },
    { id: "3", name: "음료", displayOrder: 3 },
    { id: "4", name: "주스", displayOrder: 4 },
    { id: "5", name: "스낵", displayOrder: 5 },
  ]);
  const [choosedCategory, setChooseCategory] = useState<CategoryItem | null>(
    null
  );

  const { choosedShop } = useShopStore();
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: () => categoryAPI.getAllCategory(choosedShop!.storeId),
  //   enabled: !!choosedShop,
  // });
  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useQuery({
    queryKey: ["categories", "first", choosedShop?.storeId],
    queryFn: () => categoryAPI.getAllCategory(choosedShop!.storeId),
    enabled: !!choosedShop,
  });

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery({
    queryKey: ["categories", "second", choosedShop?.storeId],
    queryFn: () => menuAPI.getAllMenu(choosedShop!.storeId),
    enabled: !!choosedShop,
  });
  useEffect(() => {
    console.log("api테스트 카테고리", data1);
    console.log("api테스트 메뉴", data2);
  }, [data1, data2]);
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

    const newCategories = [...categories];
    const dragItemValue = newCategories[dragItem.current];
    newCategories.splice(dragItem.current, 1);
    newCategories.splice(dragOverItem.current, 0, dragItemValue);

    // displayOrder 업데이트
    const updatedCategories = newCategories.map((category, index) => ({
      ...category,
      displayOrder: index + 1,
    }));

    dragItem.current = null;
    dragOverItem.current = null;
    setCategories(updatedCategories);
  };

  // // 카테고리 편집
  // const handleEdit = (id: string, currentName: string) => {
  //   const newName = prompt("카테고리 이름을 수정하세요:", currentName);
  //   if (newName && newName.trim() && newName.trim() !== currentName) {
  //     setCategories(
  //       categories.map((cat) =>
  //         cat.id === id ? { ...cat, name: newName.trim() } : cat
  //       )
  //     );
  //   }
  // };

  // // 카테고리 삭제
  // const handleDelete = (id: string) => {
  //   if (confirm("이 카테고리를 삭제하시겠습니까?")) {
  //     const filtered = categories.filter((cat) => cat.id !== id);
  //     const reordered = filtered.map((cat, index) => ({
  //       ...cat,
  //       displayOrder: index + 1,
  //     }));
  //     setCategories(reordered);
  //   }
  // };

  return (
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

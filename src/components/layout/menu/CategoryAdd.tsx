import React, { useState, ChangeEvent } from "react";
import AcceptButton from "@/components/ui/button/AcceptButton";
import CancelButton from "@/components/ui/button/CancelButton";
import { ErrorMessage } from "@/components/ui/form/ErrorMessage";
import { TextInput } from "@/components/ui/form/TextInput";
import { categoryAPI } from "@/lib/api/category";
import { useShopStore } from "@/lib/store/shopStore";
import { useMenuStore } from "@/lib/store/MenuStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CategoryAddProps {
  setIsOpenAdd: (value: boolean) => void;
}
const CategoryAdd = ({ setIsOpenAdd }: CategoryAddProps) => {
  const { lastDisplayOrder } = useMenuStore();
  const [addCategory, setAddCategory] = useState({
    name: "",
    displayOrder: lastDisplayOrder,
  });
  const [addErrorText, setAddErrorText] = useState(false);
  const { choosedShop } = useShopStore();

  const queryClient = useQueryClient();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (id === "name" && !value) setAddErrorText(true);
    else setAddErrorText(false);

    setAddCategory({
      ...addCategory,
      [id]: id === "displayOrder" ? Number(value) : value,
    });
  };
  // 카테고리 생성 mutation
  const createMutation = useMutation({
    mutationFn: () =>
      categoryAPI.addCategory(choosedShop!.storeId, addCategory),
    onSuccess: () => {
      alert("카테고리 등록이 완료되었습니다.");

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsOpenAdd(false);
      setAddCategory({ name: "", displayOrder: 0 });
      setAddErrorText(false);
    },
    onError: (error) => {
      console.error("카테고리 등록 실패:", error);
      alert("카테고리 등록에 실패했습니다.");
    },
  });
  const handleSubmit = async () => {
    if (!choosedShop) return;
    createMutation.mutate();
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg border mb-5">
      <div className="flex flex-col lg:flex-row lg:gap-10 ">
        <div className="flex items-start gap-4 mb-4 flex-1">
          {/* 카테고리 이름 */}
          <div className="flex-1">
            <label className="block text-md font-bold text-gray-700 mb-3">
              카테고리 생성
            </label>
            <TextInput
              id="name"
              onChange={handleChange}
              placeholder="카테고리 이름 입력..."
              value={addCategory.name}
            />
            <ErrorMessage
              message="카테고리명을 입력해주세요."
              show={addErrorText}
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 lg:my-5 pt-3">
          <AcceptButton
            onClick={handleSubmit}
            className="px-4 py-2 text-sm !bg-green-600 !bg-none hover:!bg-green-700"
          >
            추가
          </AcceptButton>
          <CancelButton
            onClick={() => {
              setIsOpenAdd(false);
              setAddCategory({ name: "", displayOrder: 0 });
              setAddErrorText(false);
            }}
            className="px-4 py-2 text-sm"
          >
            취소
          </CancelButton>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd;

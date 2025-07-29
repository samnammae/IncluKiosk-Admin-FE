import React, { useState, ChangeEvent } from "react";
import AcceptButton from "@/components/ui/button/AcceptButton";
import CancelButton from "@/components/ui/button/CancelButton";
import { ErrorMessage } from "@/components/ui/form/ErrorMessage";
import { TextInput } from "@/components/ui/form/TextInput";
import { categoryAPI } from "@/lib/api/category";
import { useShopStore } from "@/lib/store/shopStore";

interface CategoryAddProps {
  setIsOpenAdd: (value: boolean) => void;
}
const CategoryAdd = ({ setIsOpenAdd }: CategoryAddProps) => {
  const [addCategory, setAddCategory] = useState({ name: "", displayOrder: 0 });
  const [addErrorText, setAddErrorText] = useState(false);
  const { choosedShop } = useShopStore();

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

  const handleSubmit = async () => {
    if (!choosedShop) return;

    try {
      const response = await categoryAPI.addCategory(
        choosedShop.storeId,
        addCategory
      );
      console.log("카테고리 추가 성공", response);

      // 성공 시 폼 초기화
      setIsOpenAdd(false);
      setAddCategory({ name: "", displayOrder: 0 });
      setAddErrorText(false);
    } catch (error) {
      console.log("카테고리 추가 실패", error);
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg border mb-5">
      <div className="flex flex-col lg:flex-row lg:gap-10 ">
        <div className="flex items-start gap-4 mb-4 flex-1">
          {/* 카테고리 이름 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 이름
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

          {/* 표시 순서 */}
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              순서
            </label>
            <TextInput
              id="displayOrder"
              type="number"
              onChange={handleChange}
              value={addCategory.displayOrder}
              className="text-center"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 lg:my-5">
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

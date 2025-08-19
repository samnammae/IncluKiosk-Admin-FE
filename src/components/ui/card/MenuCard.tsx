"use client";
import ConfirmModal from "@/components/layout/modal/ConfirmModal";
import MenuFormModal from "@/components/layout/modal/MenuFormModal";
import { MenuItem } from "@/lib/store/MenuStore";

import React, { useState } from "react";

interface MenuCardProps {
  item: MenuItem;
  onDelete: (id: string) => void;
  onToggleSoldOut?: (id: string) => void;
}
const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onDelete,
  onToggleSoldOut,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const handleDelete = () => {
    onDelete(item.id);
    setDeleteModalOpen(false);
  };
  return (
    <>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1">
        {/* 메뉴 이미지 */}
        <div className="relative mb-4">
          <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>

          {/* 품절 배지 */}
          {item.isSoldOut && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              품절
            </div>
          )}
        </div>

        {/* 메뉴 정보 */}
        <div className="mb-4 h-20">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {item.name}
            </h3>
            <span className="text-lg font-bold text-blue-600 ml-2">
              ₩{formatPrice(item.price)}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* 옵션 카테고리 */}
          {item?.optionCategories?.length > 0 ? (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {item.optionCategories.map((option, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <span className="inline-block px-2 py-1 rounded-md text-xs"></span>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => {
              setUpdateModalOpen(true);
            }}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            수정
          </button>
          <button
            onClick={() => onToggleSoldOut?.(item.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              item.isSoldOut
                ? "text-green-700 bg-green-50 hover:bg-green-100"
                : "text-orange-700 bg-orange-50 hover:bg-orange-100"
            }`}
          >
            {item.isSoldOut ? "판매시작" : "품절처리"}
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={DeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        purpose={"메뉴"}
        targetName={item!.name}
        isLoading={false}
      />
      <MenuFormModal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
        }}
        onConfirm={() => {}}
        mode="update"
        editMenu={item}
      />
    </>
  );
};

export default MenuCard;

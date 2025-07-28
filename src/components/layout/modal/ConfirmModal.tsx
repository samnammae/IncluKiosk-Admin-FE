"use client";
import CancelButton from "@/components/ui/button/CancelButton";
import DeleteButton from "@/components/ui/button/DeleteButton";
import ClosedIcon from "@/components/ui/icon/ClosedIcon";
import React, { useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetName: string;
  purpose: string; //매장 or 메뉴 카테고리 등
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  targetName,
  purpose,
  isLoading = false,
}: ConfirmModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim() === targetName.trim()) {
      onConfirm();
      setInputValue("");
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleClose = () => {
    setInputValue("");
    setShowError(false);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (showError) {
      setShowError(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="p-6 relative max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          disabled={isLoading}
        >
          <ClosedIcon />
        </button>

        {/* 모달 내용 */}
        <div className="pt-2">
          {/* 경고 아이콘 */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            {purpose} 삭제 확인
          </h2>

          {/* 설명 */}
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            정말로{" "}
            <span className="font-semibold text-gray-900">"{targetName}"</span>{" "}
            {purpose}을 삭제하시겠습니까?
            <br />
            <span className="text-sm text-red-600 mt-1 block">
              이 작업은 되돌릴 수 없습니다.
            </span>
          </p>

          {/* 확인 입력 */}
          <div className="mb-6">
            <label
              htmlFor="shopNameInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              삭제를 확인하려면 {purpose}명을 정확히 입력해주세요:
            </label>
            <input
              id="shopNameInput"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={targetName}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                showError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              disabled={isLoading}
            />
            {showError && (
              <p className="text-red-600 text-sm mt-1">
                {purpose}명이 일치하지 않습니다. 정확히 입력해주세요.
              </p>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-3 justify-end">
            <DeleteButton
              onClick={handleConfirm}
              disabled={inputValue.trim() !== targetName.trim()}
            >
              {isLoading ? "삭제 중..." : "삭제하기"}
            </DeleteButton>
            <CancelButton onClick={handleClose} disabled={isLoading}>
              취소
            </CancelButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

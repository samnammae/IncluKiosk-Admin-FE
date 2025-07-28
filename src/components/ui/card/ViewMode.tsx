import React from "react";
import ViewCardIcon from "@/components/ui/icon/ViewCardIcon";
import ViewListIcon from "@/components/ui/icon/ViewListIcon";
interface ViewModeProps {
  viewMode: string;
  onCardClick: () => void;
  onListClick: () => void;
}
const ViewMode: React.FC<ViewModeProps> = ({
  viewMode,
  onCardClick,
  onListClick,
}) => {
  return (
    <>
      {/* 뷰 모드 토글 */}
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={onCardClick}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "card"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-1">
              <ViewCardIcon />
              카드
            </div>
          </button>
          <button
            onClick={onListClick}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-1">
              <ViewListIcon />
              리스트
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewMode;

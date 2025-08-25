"use client";
import React from "react";
interface ViewModeProps {
  chooseLabel: string;
  setChooseLabel: (label: string) => void;
}
const ViewMode: React.FC<ViewModeProps> = ({ chooseLabel, setChooseLabel }) => {
  const viewmode = [
    { order: 1, name: "전체" },
    { order: 2, name: "필수" },
    { order: 3, name: "선택" },
  ];
  const handleChooseLabel = (order: number, name: string) => {
    console.log(order, name);
    setChooseLabel(name);
  };
  // 현재 선택된 아이템의 인덱스 찾기
  const selectedIndex = viewmode.findIndex((item) => item.name === chooseLabel);

  // 각 탭의 너비와 간격을 고려한 위치 계산
  const getSliderPosition = () => {
    const tabWidth = 56;
    const gap = 12;
    const padding = 8;

    return padding + selectedIndex * (tabWidth + gap);
  };
  return (
    <div className="relative">
      <div className="flex rounded-md shadow-sm p-2 gap-3">
        {/* 슬라이더 배경 - 텍스트 뒤쪽에 배치 */}
        <div
          className="absolute top-2 w-14 h-9 bg-gradient-to-r from-brand-main to-brand-dark rounded-md shadow-sm transition-all duration-500 ease-in-out z-0"
          style={{
            left: `${getSliderPosition()}px`,
          }}
        />

        {viewmode.map((item, index) => (
          <div
            key={item.order}
            className={`relative z-10 px-3 py-1.5 text-md rounded-md transition-colors w-14 text-center ${
              chooseLabel === item.name
                ? "text-white font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleChooseLabel(index, item.name)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMode;

"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";

interface MoveKioskMockUpProps {
  images: StaticImageData[]; // [0] = Top, [1] = Bottom
}

const MoveKioskMockUp = ({ images }: MoveKioskMockUpProps) => {
  if (images.length < 2) {
    return <div>이미지가 2개 필요합니다. (Top, Bottom)</div>;
  }

  return (
    <div className="relative w-full max-w-md h-[800px] mx-auto flex items-end justify-center">
      {/* 하단 고정된 받침대 */}
      <Image
        src={images[1]} // Bottom
        alt="kiosk-bottom"
        width={150}
        height={300}
        className="absolute bottom-32 z-10 object-contain "
      />

      {/* 상단 자동으로 움직이는 스크린 */}
      <Image
        src={images[0]} // Top
        alt="kiosk-top"
        width={100}
        height={200}
        className="absolute object-contain z-0 animate-kioskMove bottom-64 ml-[2px]"
      />
    </div>
  );
};

export default MoveKioskMockUp;

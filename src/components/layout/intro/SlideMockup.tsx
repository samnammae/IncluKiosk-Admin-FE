"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";

interface SlideMockupProps {
  isKiosk: boolean;
  images: StaticImageData[];
  infoIndex: number;
  prev: () => void;
  next: () => void;
}

const SlideMockup = ({
  isKiosk,
  images,
  infoIndex,
  prev,
  next,
}: SlideMockupProps) => {
  return (
    <div className="relative w-full max-w-md">
      {/* 이미지 */}
      <Image
        src={images[infoIndex]}
        alt={`mockup-${infoIndex}`}
        width={isKiosk ? 800 : 600}
        height={isKiosk ? 600 : 300}
        className=" object-contain mx-auto"
      />

      {/* 좌우 버튼 */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow"
          >
            ▶
          </button>
        </>
      )}

      {/* 페이지 표시 */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm bg-black/50 text-white px-3 py-1 rounded-full">
          {infoIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default SlideMockup;

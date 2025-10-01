import React, { useState } from "react";
import { SectionType } from "./sections";
import SlideMockup from "./SlideMockup";

interface InfoSectionProps {
  sec: SectionType;
  activeSection: number;
  index: number;
}

const InfoSection = ({ activeSection, sec, index }: InfoSectionProps) => {
  const [infoIndex, setInfoIndex] = useState(0);

  const prev = () =>
    setInfoIndex((i) => (i > 0 ? i - 1 : sec.images.length - 1));
  const next = () =>
    setInfoIndex((i) => (i < sec.images.length - 1 ? i + 1 : 0));
  return (
    <section
      key={sec.id}
      className="h-screen w-full flex items-center justify-center fixed top-0 left-0 transition-opacity duration-700 z-0 px-12"
      style={{
        opacity: activeSection === index ? 1 : 0,
        pointerEvents: activeSection === index ? "auto" : "none",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-6xl">
        {/* 왼쪽 텍스트 */}
        <div>
          <h2 className="text-4xl font-bold mb-8">{sec.title}</h2>
          <div>
            {sec.description[infoIndex].map((item) => (
              <p className="text-lg text-gray-500"> {item} </p>
            ))}
          </div>
        </div>

        {/* 오른쪽 이미지 슬라이드 */}
        <div className="flex justify-center">
          <SlideMockup
            isKiosk={sec.isKiosk}
            images={sec.images}
            infoIndex={infoIndex}
            prev={prev}
            next={next}
          />
        </div>
      </div>
    </section>
  );
};

export default InfoSection;

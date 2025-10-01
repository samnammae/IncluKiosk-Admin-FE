"use client";

import React, { useEffect, useState } from "react";
import InfoSection from "./InfoSection";
import { sections } from "./sections";

const FadeScrollPage = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight; // Hero 높이
      const scrollY = window.scrollY - heroHeight; // Hero 지나고 나서부터 계산
      if (scrollY < 0) return;

      const vh = window.innerHeight;
      const newSection = Math.min(
        sections.length - 1,
        Math.floor(scrollY / vh)
      );
      setActiveSection(newSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-[400vh] mt-[100vh]">
      {sections.map((sec, index) => (
        <InfoSection
          key={index}
          activeSection={activeSection}
          sec={sec}
          index={index}
        />
      ))}
    </div>
  );
};

export default FadeScrollPage;

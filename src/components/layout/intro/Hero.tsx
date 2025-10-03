"use client";

import React from "react";
import Image from "next/image";
import IncluKiosk from "../../../assets/images/IncluKiosk.webp";
import { useLoginModalStore } from "@/lib/store/loginStore";
import { useRouter } from "next/navigation";
const Hero = () => {
  const { isLoggedIn, openLoginModal } = useLoginModalStore();
  const router = useRouter();
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center relative z-10  overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%)",
      }}
    >
      {/* 배경 원 아티클 */}
      <div className="bg-circle w-[600px] h-[600px] -top-[300px] -right-[200px]"></div>
      <div className="bg-circle w-[400px] h-[400px] -bottom-[150px] -left-[100px]"></div>
      <div className="bg-circle w-[250px] h-[250px] top-1/2 left-[10%] opacity-50"></div>

      {/* 로고 */}
      <Image
        src={IncluKiosk}
        alt="IncluKiosk Logo"
        priority
        className="max-h-[40vh] max-w-[40vw] object-contain scale-150 pointer-events-none"
      />

      {/* 핵심 메시지 */}
      <h1 className="text-3xl md:text-5xl font-bold text-white">모두를 위한</h1>
      <h1 className="mt-2 text-3xl md:text-5xl font-bold text-white">
        적응형 스마트 키오스크
      </h1>
      <p className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl">
        AI와 IoT로 사용자를 인식하고, 누구나 편리하게 주문할 수 있도록
        설계했습니다.
      </p>
      {/* CTA 버튼 */}
      <div className="mt-10 flex gap-5">
        {isLoggedIn ? (
          <button
            className="px-11 py-4 bg-white text-blue-500 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            시작하기
          </button>
        ) : (
          <button
            className="px-11 py-4 bg-white text-blue-500 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            onClick={() => {
              openLoginModal();
            }}
          >
            시작하기
          </button>
        )}

        <button
          className="px-11 py-4 bg-white/15 backdrop-blur-md text-white font-semibold rounded-full border-2 border-white hover:bg-white/25 transition-all"
          onClick={() => {
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
          }}
        >
          더 알아보기
        </button>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-4 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-2 text-white/80 animate-bounce">
        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;

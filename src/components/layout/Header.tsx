"use client";

import Link from "next/link";
import { useLoginModalStore } from "@/lib/store/loginStore";

export default function Header() {
  const { isLoginModalOpen, openLoginModal } = useLoginModalStore();
  const handleLoginClick = () => {
    console.log("로그인 버튼 클릭됨");
    console.log("클릭 전 모달 상태:", isLoginModalOpen);
    openLoginModal();
    console.log(
      "클릭 후 모달 상태:",
      useLoginModalStore.getState().isLoginModalOpen
    );
  };
  return (
    <>
      <header className="w-full h-16 flex justify-between items-center px-4">
        <div className="">IncluKiosk</div>
        <div className="flex gap-8">
          <Link href={"/dashboard"}>
            <div className="">대시보드</div>
          </Link>
          <div className="" onClick={handleLoginClick}>
            로그인
          </div>
        </div>
      </header>
    </>
  );
}

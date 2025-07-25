"use client";

import Link from "next/link";
import { useLoginModalStore } from "@/lib/store/loginStore";
import { authAPI } from "@/lib/api/auth";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn, openLoginModal } = useLoginModalStore();
  const handleLoginClick = () => {
    openLoginModal();
  };
  const handleLogoutClick = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn();
      alert("로그아웃 성공");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <>
      <header className="w-full h-16 flex justify-between items-center px-4">
        <div className="">IncluKiosk</div>
        <div className="flex gap-8">
          <Link href={"/dashboard"}>
            <div className="">대시보드</div>
          </Link>
          {isLoggedIn ? (
            <div className="" onClick={handleLogoutClick}>
              로그아웃
            </div>
          ) : (
            <div className="" onClick={handleLoginClick}>
              로그인
            </div>
          )}
        </div>
      </header>
    </>
  );
}

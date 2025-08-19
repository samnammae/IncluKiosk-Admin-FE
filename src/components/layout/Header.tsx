"use client";

import Link from "next/link";
import { useLoginModalStore } from "@/lib/store/loginStore";
import { authAPI } from "@/lib/api/auth";
import { useEffect } from "react";
import LoginModal from "./modal/LoginModal";
import { useNotification } from "@/hooks/useNotification";

export default function Header() {
  const showNotification = useNotification((state) => state.showNotification);
  const { isLoggedIn, setIsLoggedIn, openLoginModal } = useLoginModalStore();
  const handleLoginClick = () => {
    openLoginModal();
  };
  const handleLogoutClick = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      showNotification("로그아웃 성공", { severity: "success" });
    } catch (error) {
      console.error("Login failed:", error);
      showNotification("로그아웃 실패", { severity: "error" });
    }
  };
  useEffect(() => {
    if (window.localStorage.getItem("accessToken")) setIsLoggedIn(true);
    else setIsLoggedIn(false);
    console.log("isLoggedInisLoggedInisLoggedIn", isLoggedIn);
  }, []);
  return (
    <>
      <LoginModal />

      <header className="w-full h-16 flex justify-between items-center px-4">
        <div className="">IncluKiosk</div>
        <div className="flex gap-8">
          {isLoggedIn ? (
            <Link href={"/dashboard"}>
              <div className="">대시보드</div>
            </Link>
          ) : (
            <button className="" onClick={handleLoginClick}>
              대시보드
            </button>
          )}

          {isLoggedIn ? (
            <button className="" onClick={handleLogoutClick}>
              로그아웃
            </button>
          ) : (
            <button className="" onClick={handleLoginClick}>
              로그인
            </button>
          )}
        </div>
      </header>
    </>
  );
}

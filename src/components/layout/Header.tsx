"use client";

import Link from "next/link";
import { useLoginModalStore } from "@/lib/store/loginStore";
import { authAPI } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import LoginModal from "./modal/LoginModal";
import { useNotification } from "@/hooks/useNotification";
import DownloadModal from "./modal/DownloadModal";
import DownloadIcon from "@mui/icons-material/DownloadRounded";
import HeaderNavButton from "../ui/button/HeaderNavButton";
export default function Header() {
  const showNotification = useNotification((state) => state.showNotification);
  const { isLoggedIn, setIsLoggedIn, openLoginModal } = useLoginModalStore();
  const [isDownOpen, setIsDownOpen] = useState(false);
  const handleClose = () => {
    setIsDownOpen(false);
  };
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
      <DownloadModal isOpen={isDownOpen} handleClose={handleClose} />
      <header className="w-full h-20 flex justify-between items-center px-8 bg-white/95 backdrop-blur-md border-b border-gray-200 fixed top-0 z-40">
        <Link href={"/"}>
          <div className="text-2xl font-bold text-gray-900">IncluKiosk</div>
        </Link>
        <div className="flex gap-8 items-center">
          <HeaderNavButton
            text="다운로드"
            onClick={() => setIsDownOpen(true)}
          />

          {isLoggedIn ? (
            <Link href={"/dashboard"}>
              <HeaderNavButton text="대시보드" />
            </Link>
          ) : (
            <HeaderNavButton text="대시보드" onClick={handleLoginClick} />
          )}

          {isLoggedIn ? (
            <HeaderNavButton text="로그아웃" onClick={handleLogoutClick} />
          ) : (
            <HeaderNavButton text="로그인" onClick={handleLoginClick} />
          )}
        </div>
      </header>
    </>
  );
}

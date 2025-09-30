"use client";

import Link from "next/link";
import { useLoginModalStore } from "@/lib/store/loginStore";
import { authAPI } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import LoginModal from "./modal/LoginModal";
import { useNotification } from "@/hooks/useNotification";
import DownloadModal from "./modal/DownloadModal";
import DownloadIcon from "@mui/icons-material/DownloadRounded";

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
      <header className="w-full h-16 flex justify-between items-center px-4">
        <div className="">IncluKiosk</div>
        <div className="flex gap-12">
          <button
            className="flex gap-1 items-center"
            onClick={() => setIsDownOpen(true)}
          >
            <span>다운로드</span> <DownloadIcon sx={{ fontSize: 20 }} />
          </button>
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

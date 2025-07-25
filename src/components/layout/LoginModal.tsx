"use client";
import { useLoginModalStore } from "@/lib/store/loginStore";
import Login from "./Login";
import Signup from "./Signup";
import ClosedIcon from "../ui/icon/ClosedIcon";

const LoginModal = () => {
  const { isLoginModalOpen, isSignupMode, closeLoginModal, changeMode } =
    useLoginModalStore();

  if (!isLoginModalOpen) return null;

  // 배경 클릭시 모달 닫기
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeLoginModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      <div className="p-5 relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* <button className=" bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200">
          ✕
        </button> */}
        <div className="absolute top-4 right-6 z-10 w-8 h-8">
          <ClosedIcon onClick={closeLoginModal} />
        </div>

        {isSignupMode ? <Signup /> : <Login />}
      </div>
    </div>
  );
};

export default LoginModal;

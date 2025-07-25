"use client";
import { authAPI } from "@/lib/api/auth";
import { useLoginModalStore } from "@/lib/store/loginStore";
import { ChangeEvent, useState } from "react";

const Login = () => {
  const { setIsLoggedIn, changeMode, closeLoginModal } = useLoginModalStore();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginForm({
      ...loginForm,
      [id]: value,
    });
  };

  const handleSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login form submitted:", loginForm);
      await authAPI.login(loginForm);
      setIsLoggedIn();
      closeLoginModal();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 w-full relative">
      <div className="w-full">
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            value={loginForm.email}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-200 rounded-md text-sm transition-all duration-200 bg-white focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)] placeholder:text-gray-400"
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              비밀번호
            </label>
            <a
              href="#"
              className="text-blue-600 text-xs no-underline inline-block transition-colors duration-200 mb-2 hover:underline"
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={loginForm.password}
            onChange={handleChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") handleSubmit(e);
            }}
            className="w-full p-3 border-2 border-gray-200 rounded-md text-sm transition-all duration-200 bg-white focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)] placeholder:text-gray-400"
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full p-3 bg-blue-600 text-white border-none rounded-md text-sm font-bold cursor-pointer transition-all duration-200 mt-2  hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </div>

      <div className="flex items-center text-center my-6">
        <div className="flex-1 border-b border-gray-200"></div>
        <span className="px-4 text-gray-500 text-xs">Or continue with</span>
        <div className="flex-1 border-b border-gray-200"></div>
      </div>

      <div className="flex flex-col gap-3">
        <button className="relative w-full p-3 bg-[#fee500] text-[#191600] border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 active:scale-[1.02]">
          <div className="w-6 h-6 absolute left-4 bg-yellow-600 rounded flex items-center justify-center text-white font-bold text-xs">
            K
          </div>
          카카오톡으로 시작하기
        </button>

        <button className="relative w-full p-3 bg-white text-gray-700 border-2 border-gray-200 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 active:scale-[1.02]">
          <div className="w-6 h-6 absolute left-4 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">
            G
          </div>
          구글로 시작하기
        </button>
      </div>

      <div className="text-center mt-6 text-gray-600 text-xs">
        계정이 필요하신가요?
        <button
          onClick={changeMode}
          className="text-blue-600 font-bold no-underline ml-2 bg-none border-none cursor-pointer hover:underline"
        >
          가입하기
        </button>
      </div>
    </div>
  );
};

export default Login;

"use client";
import { useLoginModalStore } from "@/lib/store/loginStore";
import { ChangeEvent, useState, FormEvent } from "react";

const Signup = () => {
  const { changeMode } = useLoginModalStore();

  // 유효성 검사 상태
  const [validations, setValidations] = useState({
    email: true,
    name: true,
    phone: true,
    password: true,
    passwordCheck: true,
  });

  const [joinForm, setJoinForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const [passwordCheck, setPasswordCheck] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 폼 제출
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // 모든 필드 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // 모든 필드 검사 (비어있는 필드도 포함)
    const newValidations = {
      email: joinForm.email.trim() !== "" && emailRegex.test(joinForm.email),
      name: joinForm.name.trim() !== "",
      phone: joinForm.phone.trim() !== "" && phoneRegex.test(joinForm.phone),
      password:
        joinForm.password !== "" && passwordRegex.test(joinForm.password),
      passwordCheck:
        passwordCheck !== "" && joinForm.password === passwordCheck,
    };

    // 모든 검사 결과 적용
    setValidations(newValidations);
    const isAllValid = Object.values(newValidations).every((value) => value);

    if (isAllValid) {
      console.log("Registration form submitted:", joinForm);
      // API 호출 로직 여기에 추가
      // await authAPI.join(joinForm)
      changeMode(); // 성공시 로그인 모드로 변경
    }

    setIsLoading(false);
  };

  // 입력값 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // 비밀번호 확인 필드 처리
    if (id === "passwordCheck") {
      setPasswordCheck(value);
      setValidations({
        ...validations,
        passwordCheck: value === joinForm.password || value === "",
      });
      return;
    }

    // 폼 데이터 업데이트
    setJoinForm({
      ...joinForm,
      [id]: value,
    });

    // 사용자가 입력하는 동안은 유효성 검사 메시지 숨김
    setValidations({
      ...validations,
      [id]: true,
    });
  };

  // onBlur 처리 - 필드를 벗어날 때 유효성 검사
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // 값이 비어있으면 유효성 검사 스킵
    if (!value.trim()) return;

    // 필드별 유효성 검사
    switch (id) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setValidations({
          ...validations,
          email: emailRegex.test(value),
        });
        break;
      }

      case "name": {
        setValidations({
          ...validations,
          name: value.trim().length > 0,
        });
        break;
      }

      case "phone": {
        const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        setValidations({
          ...validations,
          phone: phoneRegex.test(value),
        });
        break;
      }

      case "password": {
        const passwordRegex =
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        setValidations({
          ...validations,
          password: passwordRegex.test(value),
          // 비밀번호 변경시 비밀번호 확인 필드 유효성도 업데이트
          passwordCheck: passwordCheck === value || passwordCheck === "",
        });
        break;
      }

      case "passwordCheck": {
        setValidations({
          ...validations,
          passwordCheck: value === joinForm.password,
        });
        break;
      }
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numbers = value.replace(/[^0-9]/g, ""); // 숫자만 추출
    const trimmed = numbers.slice(0, 11); // 최대 11자리로 제한

    // 하이픈 추가 포맷팅
    let formattedNumber = "";
    if (trimmed.length <= 3) {
      formattedNumber = trimmed;
    } else if (trimmed.length <= 7) {
      formattedNumber = `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    } else {
      formattedNumber = `${trimmed.slice(0, 3)}-${trimmed.slice(
        3,
        7
      )}-${trimmed.slice(7)}`;
    }

    setJoinForm({
      ...joinForm,
      phone: formattedNumber,
    });

    // 유효성 검사 (전화번호가 완성되었을 때만)
    if (trimmed.length === 11) {
      const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
      setValidations({
        ...validations,
        phone: phoneRegex.test(formattedNumber),
      });
    } else {
      // 입력 중일 때는 유효성 에러 표시 안 함
      setValidations({
        ...validations,
        phone: true,
      });
    }
  };

  return (
    <div className="p-8 w-full relative">
      {/* 뒤로가기 버튼 */}
      <div className="flex flex-col mb-4">
        <button
          onClick={changeMode}
          className="flex items-center bg-none border-none cursor-pointer text-gray-600 text-sm p-2 transition-colors duration-200 hover:text-blue-600 self-start"
        >
          <span className="mr-1">←</span>
          <span className="font-medium">로그인으로 돌아가기</span>
        </button>
      </div>

      <div className="w-full">
        {/* 이메일 */}
        <div className="mb-3">
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
            value={joinForm.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border-2 rounded-md text-sm transition-all duration-200 bg-white focus:outline-none placeholder:text-gray-400 ${
              !validations.email
                ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-gray-200 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)]"
            }`}
            required
          />
          <div className="h-1 mt-1">
            {!validations.email && (
              <p className="text-red-500 text-xs mt-1 font-medium transition-all duration-200">
                {joinForm.email.trim() === ""
                  ? "이메일을 입력해주세요."
                  : "유효한 이메일 주소를 입력해주세요."}
              </p>
            )}
          </div>
        </div>

        {/* 이름 */}
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            placeholder="홍길동"
            autoComplete="name"
            value={joinForm.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border-2 rounded-md text-sm transition-all duration-200 bg-white focus:outline-none placeholder:text-gray-400 ${
              !validations.name
                ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-gray-200 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)]"
            }`}
            required
          />
          <div className="h-1 mt-1">
            {!validations.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                이름을 입력해주세요.
              </p>
            )}
          </div>
        </div>

        {/* 전화번호 */}
        <div className="mb-3">
          <label
            htmlFor="phone"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            전화번호
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="010-1234-5678"
            autoComplete="tel"
            value={joinForm.phone}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            className={`w-full p-3 border-2 rounded-md text-sm transition-all duration-200 bg-white focus:outline-none placeholder:text-gray-400 ${
              !validations.phone
                ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-gray-200 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)]"
            }`}
            required
          />
          <div className="h-1 mt-1">
            {!validations.phone && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {joinForm.phone.trim() === ""
                  ? "전화번호를 입력해주세요."
                  : "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)"}
              </p>
            )}
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={joinForm.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border-2 rounded-md text-sm transition-all duration-200 bg-white focus:outline-none placeholder:text-gray-400 ${
              !validations.password
                ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-gray-200 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)]"
            }`}
            required
          />
          <div className="h-1 mt-1">
            {!validations.password && (
              <p className="text-red-500 text-xs font-medium">
                {joinForm.password === ""
                  ? "비밀번호를 입력해주세요."
                  : "비밀번호는 8자 이상, 영문자, 숫자, 특수문자를 포함해야 합니다."}
              </p>
            )}
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-3">
          <label
            htmlFor="passwordCheck"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            비밀번호 확인
          </label>
          <input
            id="passwordCheck"
            type="password"
            autoComplete="new-password"
            value={passwordCheck}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-3 border-2 rounded-md text-sm transition-all duration-200 bg-white focus:outline-none placeholder:text-gray-400 ${
              !validations.passwordCheck
                ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-gray-200 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)]"
            }`}
            required
          />
          <div className="h-1 mt-1">
            {!validations.passwordCheck && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {passwordCheck === ""
                  ? "비밀번호 확인을 입력해주세요."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full p-3 bg-blue-600 text-white border-none rounded-md text-sm font-bold cursor-pointer transition-all duration-200 mt-4 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "가입 중..." : "회원가입"}
        </button>
      </div>
    </div>
  );
};

export default Signup;

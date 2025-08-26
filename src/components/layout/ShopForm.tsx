"use client";
import AcceptButton from "@/components/ui/button/AcceptButton";
import CancelButton from "@/components/ui/button/CancelButton";
import { ErrorMessage } from "@/components/ui/form/ErrorMessage";
import { FormContainer } from "@/components/ui/form/FormContainer";
import { FormGrid } from "@/components/ui/form/FormGrid";
import { FormGroup } from "@/components/ui/form/FormGroup";
import { FormLabel } from "@/components/ui/form/FormLabel";
import { FormSection } from "@/components/ui/form/FormSection";
import { TextArea } from "@/components/ui/form/TextArea";
import { TextInput } from "@/components/ui/form/TextInput";
import BackIcon from "@/components/ui/icon/BackIcon";
import { shopAPI } from "@/lib/api/shop";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import DeleteButton from "../ui/button/DeleteButton";
import { ShopDataType } from "@/app/dashboard/shop/[id]/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/hooks/useNotification";

interface ShopFormProps {
  mode: "create" | "edit";
  initialData?: ShopDataType | null;
  onDeleteClick?: () => void;
}
export default function ShopForm({
  mode,
  initialData,
  onDeleteClick = () => {},
}: ShopFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const queryClient = useQueryClient();
  const showNotification = useNotification((state) => state.showNotification);
  // 폼 데이터
  const [shopForm, setShopForm] = useState({
    name: "",
    phone: "",
    address: "",
    introduction: "",
    mainColor: "#002F6C",
    subColor: "#0051A3",
    textColor: "#F8F9FA",
  });

  // 파일 상태
  const [files, setFiles] = useState({
    mainImg: null as File | null,
    logoImg: null as File | null,
    startBackground: null as File | null,
  });

  // 파일 미리보기 URL
  const [previews, setPreviews] = useState({
    mainImg: "",
    logoImg: "",
    startBackground: "",
  });

  // 유효성 검사 상태
  const [validations, setValidations] = useState({
    name: true,
    phone: true,
    address: true,
  });

  // 매장 생성 mutation
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => shopAPI.addShop(formData),
    onSuccess: () => {
      showNotification("매장이 등록되었습니다", { severity: "success" });
      // 매장 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      router.push("/dashboard/shop");
    },
    onError: (error) => {
      console.error("매장 등록 실패:", error);
      showNotification("메장 등록 실패", { severity: "error" });
    },
  });

  // 매장 수정 mutation
  const updateMutation = useMutation({
    mutationFn: ({
      storeId,
      formData,
    }: {
      storeId: string;
      formData: FormData;
    }) => shopAPI.updateShop(storeId, formData),
    onSuccess: () => {
      showNotification("매장이 수정되었습니다", { severity: "success" });
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      queryClient.invalidateQueries({
        queryKey: ["shop", initialData?.storeId],
      });
      router.push(`/dashboard/shop/${initialData?.storeId}`);
    },
    onError: (error) => {
      console.error("매장 수정 실패:", error);
      showNotification("메장 수정 실패", { severity: "error" });
    },
  });
  useEffect(() => {
    console.log("initialDatainitialDatainitialDatainitialData", initialData);
    if (initialData) {
      setFormDataFromShop(initialData);
    }
  }, [initialData]);

  const setFormDataFromShop = (data: ShopDataType) => {
    setShopForm({
      name: data.name || "",
      phone: data.phone || "",
      address: data.address || "",
      introduction: data.startPage?.introduction || "", // 중첩된 구조
      mainColor: data.theme?.mainColor || "#002F6C",
      subColor: data.theme?.subColor || "#0051A3",
      textColor: data.theme?.textColor || "#F8F9FA",
    });
    console.log("datadatadata", data);
    // 기존 이미지 미리보기 설정
    setPreviews({
      mainImg: data.mainImg ? data.mainImg : "",
      logoImg: data.startPage?.logoImg ? data.startPage.logoImg : "",
      startBackground: data.startPage?.startBackground
        ? data.startPage.startBackground
        : "",
    });
  };

  // 입력값 변경 핸들러
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setShopForm({
      ...shopForm,
      [id]: value,
    });

    // 입력 중에는 유효성 검사 메시지 숨김
    if (validations.hasOwnProperty(id)) {
      setValidations({
        ...validations,
        [id]: true,
      });
    }
  };

  // 전화번호 포맷팅
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numbers = value.replace(/[^0-9]/g, "");
    const trimmed = numbers.slice(0, 11);

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

    setShopForm({
      ...shopForm,
      phone: formattedNumber,
    });
  };

  // 파일 변경 핸들러
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fileType: keyof typeof files
  ) => {
    const file = e.target.files?.[0] || null;

    setFiles({
      ...files,
      [fileType]: file,
    });

    // 미리보기 생성
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews({
        ...previews,
        [fileType]: url,
      });
    }
  };

  // 색상 변경 핸들러
  const handleColorChange = (colorType: string, value: string) => {
    setShopForm({
      ...shopForm,
      [colorType]: value,
    });
  };

  // 폼 제출
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 유효성 검사
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    const newValidations = {
      name: shopForm.name.trim() !== "",
      phone: shopForm.phone.trim() !== "" && phoneRegex.test(shopForm.phone),
      address: shopForm.address.trim() !== "",
    };

    setValidations(newValidations);
    const isAllValid = Object.values(newValidations).every((value) => value);

    if (!isAllValid) {
      return;
    }

    // FormData 생성
    const formData = new FormData();

    const requestData = {
      name: shopForm.name.trim(),
      phone: shopForm.phone.trim(),
      address: shopForm.address.trim(),
      introduction: shopForm.introduction.trim(),
      mainColor: shopForm.mainColor,
      subColor: shopForm.subColor,
      textColor: shopForm.textColor,
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      })
    );

    // 파일 추가 (새로 선택된 파일만)
    if (files.mainImg) formData.append("mainImg", files.mainImg);
    if (files.logoImg) formData.append("logoImg", files.logoImg);
    if (files.startBackground)
      formData.append("startBackground", files.startBackground);

    // Mutation 실행
    if (isEditMode && initialData?.storeId) {
      updateMutation.mutate({ storeId: initialData.storeId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-8xl mx-auto p-2">
      {/* 페이지 제목 */}
      <div className="mb-8">
        <div className="flex gap-1 items-center mb-2">
          <BackIcon />
          <h1 className="text-3xl font-semibold text-gray-800">
            {isEditMode ? "매장 정보 수정" : "새 매장 추가"}
          </h1>
        </div>
        <p className="text-gray-600 text-base ml-6">
          {isEditMode
            ? "매장 정보를 수정할 수 있습니다"
            : "키오스크에서 사용할 매장 정보를 등록해주세요"}
        </p>
      </div>

      {/* 폼 컨테이너 */}
      <FormContainer>
        <FormGrid>
          {/* 기본 정보 섹션 */}
          <FormSection title="기본 정보">
            {/* 매장 이름 */}
            <FormGroup>
              <FormLabel htmlFor="name" required>
                매장 이름
              </FormLabel>
              <TextInput
                id="name"
                value={shopForm.name}
                onChange={handleChange}
                placeholder="예: 강남 본점"
                hasError={!validations.name}
                required
              />
              <ErrorMessage
                message="매장 이름을 입력해주세요."
                show={!validations.name}
              />
            </FormGroup>

            {/* 매장 전화번호 */}
            <FormGroup>
              <FormLabel htmlFor="phone" required>
                매장 전화번호
              </FormLabel>
              <TextInput
                id="phone"
                type="tel"
                value={shopForm.phone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                hasError={!validations.phone}
                required
              />
              <ErrorMessage
                message="올바른 전화번호를 입력해주세요."
                show={!validations.phone}
              />
            </FormGroup>

            {/* 매장 주소 */}
            <FormGroup>
              <FormLabel htmlFor="address" required>
                매장 주소
              </FormLabel>
              <TextInput
                id="address"
                value={shopForm.address}
                onChange={handleChange}
                placeholder="서울시 강남구 테헤란로 123"
                hasError={!validations.address}
                required
              />
              <ErrorMessage
                message="매장 주소를 입력해주세요."
                show={!validations.address}
              />
            </FormGroup>

            {/* 매장 소개 */}
            <FormGroup>
              <FormLabel htmlFor="introduction">매장 소개</FormLabel>
              <TextArea
                id="introduction"
                value={shopForm.introduction}
                onChange={handleChange}
                placeholder="매장에 대한 간단한 소개를 입력해주세요."
                rows={4}
              />
            </FormGroup>
          </FormSection>

          {/* 디자인 설정 섹션 */}
          <FormSection title="디자인 설정">
            {/* 메인 이미지 업로드 */}
            <FormGroup>
              <FormLabel htmlFor="mainImg">메인 이미지</FormLabel>
              <label
                htmlFor="mainImg"
                className={`relative block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
                  files.mainImg || previews.mainImg
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-600 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  id="mainImg"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "mainImg")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previews.mainImg ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previews.mainImg}
                      alt="미리보기"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs text-center">
                      {files.mainImg?.name || "기존 이미지"}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="text-gray-600 text-sm font-medium">
                      클릭하여 이미지 선택
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      PNG, JPG (최대 5MB)
                    </div>
                  </div>
                )}
              </label>
            </FormGroup>

            {/* 로고 이미지 업로드 */}
            <FormGroup>
              <FormLabel htmlFor="logoImg">로고 이미지</FormLabel>
              <label
                htmlFor="logoImg"
                className={`relative block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
                  files.logoImg || previews.logoImg
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-600 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  id="logoImg"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logoImg")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previews.logoImg ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previews.logoImg}
                      alt="미리보기"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs text-center">
                      {files.logoImg?.name || "기존 이미지"}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="text-gray-600 text-sm font-medium">
                      클릭하여 로고 선택
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      PNG, JPG (최대 5MB)
                    </div>
                  </div>
                )}
              </label>
            </FormGroup>

            {/* 시작 배경 이미지 업로드 */}
            <FormGroup>
              <FormLabel htmlFor="startBackground">시작 배경 이미지</FormLabel>
              <label
                htmlFor="startBackground"
                className={`relative block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
                  files.startBackground || previews.startBackground
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-600 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  id="startBackground"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "startBackground")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previews.startBackground ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previews.startBackground}
                      alt="미리보기"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs text-center">
                      {files.startBackground?.name || "기존 이미지"}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="text-gray-600 text-sm font-medium">
                      클릭하여 배경 이미지 선택
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      PNG, JPG (최대 5MB)
                    </div>
                  </div>
                )}
              </label>
            </FormGroup>

            {/* 색상 설정 */}
            <div className="flex gap-5 justify-between">
              <FormGroup>
                <FormLabel htmlFor="mainColor">메인 컬러</FormLabel>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={shopForm.mainColor}
                    onChange={(e) =>
                      handleColorChange("mainColor", e.target.value)
                    }
                    className="w-12 h-10 border-2 border-gray-200 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-sm text-gray-600">
                    {shopForm.mainColor}
                  </span>
                </div>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="subColor">서브 컬러</FormLabel>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={shopForm.subColor}
                    onChange={(e) =>
                      handleColorChange("subColor", e.target.value)
                    }
                    className="w-12 h-10 border-2 border-gray-200 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-sm text-gray-600">
                    {shopForm.subColor}
                  </span>
                </div>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="textColor">텍스트 컬러</FormLabel>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={shopForm.textColor}
                    onChange={(e) =>
                      handleColorChange("textColor", e.target.value)
                    }
                    className="w-12 h-10 border-2 border-gray-200 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-sm text-gray-600">
                    {shopForm.textColor}
                  </span>
                </div>
              </FormGroup>
            </div>
          </FormSection>
        </FormGrid>

        {/* 버튼 그룹 */}
        <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">
          <div className="flex gap-4 ">
            <AcceptButton onClick={handleSubmit} disabled={isLoading}>
              {isLoading
                ? `${isEditMode ? "수정" : "등록"} 중...`
                : `매장 ${isEditMode ? "수정하기" : "등록하기"}`}
            </AcceptButton>
            <CancelButton onClick={() => router.back()}>취소</CancelButton>
          </div>
          <DeleteButton onClick={onDeleteClick}>매장 삭제하기</DeleteButton>
        </div>
      </FormContainer>
    </div>
  );
}

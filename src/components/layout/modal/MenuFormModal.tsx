// import ClosedIcon from "@/components/ui/icon/ClosedIcon";
// import AcceptButton from "@/components/ui/button/AcceptButton";
// import CancelButton from "@/components/ui/button/CancelButton";
// import React, { useState, useEffect } from "react";
// import { useMenuStore, MenuItem } from "@/lib/store/MenuStore";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { menuAPI } from "@/lib/api/menu";
// import { useShopStore } from "@/lib/store/shopStore";
// import { useNotification } from "@/hooks/useNotification";

// interface MenuFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   mode: "create" | "update";
//   editMenu?: MenuItem | null;
// }

// const MenuFormModal: React.FC<MenuFormModalProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   mode,
//   editMenu,
// }) => {
//   const queryClient = useQueryClient();
//   const [menuData, setMenuData] = useState({
//     name: "",
//     price: "",
//     description: "",
//     category: "",
//     optionCategories: [] as string[],
//     isSoldOut: false,
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isDragOver, setIsDragOver] = useState(false);

//   const { choosedShop } = useShopStore();
//   const { categories, optionCategories: optionData } = useMenuStore();

//   // 수정 모드일 때 기존 데이터로 폼 초기화
//   useEffect(() => {
//     if (mode === "update" && editMenu && isOpen) {
//       setMenuData({
//         name: editMenu.name,
//         price: editMenu.price.toString(),
//         description: editMenu.description,
//         category: editMenu.categoryId || "",
//         optionCategories: editMenu.optionCategories,
//         isSoldOut: editMenu.isSoldOut,
//       });

//       // 기존 이미지가 있으면 미리보기 설정
//       if (editMenu.imageUrl) {
//         setImagePreview(editMenu.imageUrl);
//       }
//     } else if (mode === "create") {
//       // 생성 모드일 때는 초기화
//       handleReset();
//     }
//   }, [mode, editMenu, isOpen]);
//   useEffect(() => {
//     console.log(menuData);
//     console.log(menuData);
//     console.log(menuData);
//     console.log(menuData);
//     console.log(menuData);
//   }, [menuData]);
//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target;
//     if (type === "checkbox") {
//       const checked = (e.target as HTMLInputElement).checked;
//       setMenuData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setMenuData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file && file.type.startsWith("image/")) {
//       setImageFile(file);
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     if (imagePreview && !imagePreview.startsWith("http")) {
//       // 새로 업로드한 이미지만 URL 해제 (기존 서버 이미지는 제외)
//       URL.revokeObjectURL(imagePreview);
//     }
//     setImagePreview(null);
//   };

//   const handleOptionToggle = (option: string) => {
//     setMenuData((prev) => ({
//       ...prev,
//       optionCategories: prev.optionCategories.includes(option)
//         ? prev.optionCategories.filter((opt) => opt !== option)
//         : [...prev.optionCategories, option],
//     }));
//   };
//   const showNotification = useNotification((state) => state.showNotification);

//   // 생성 mutation
//   const createMutation = useMutation({
//     mutationFn: (formData: FormData) => {
//       return menuAPI.addMenu(choosedShop!.storeId, formData);
//     },
//     onSuccess: () => {
//       console.log("메뉴 생성 성공:");
//       queryClient.invalidateQueries({ queryKey: ["menu"] });
//       onClose();

//       showNotification("메뉴가 등록되었습니다", { severity: "success" });
//     },
//     onError: (error) => {
//       console.error("❌ 메뉴 생성 실패:", error);
//       showNotification("메뉴 생성 실패", { severity: "error" });
//     },
//   });

//   // 수정 mutation
//   const updateMutation = useMutation({
//     mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
//       return menuAPI.updateMenu(choosedShop!.storeId, id, formData);
//     },
//     onSuccess: () => {
//       console.log("메뉴 수정 성공:");
//       queryClient.invalidateQueries({ queryKey: ["menu"] });
//       onClose();

//       showNotification("메뉴 수정에 성공했습니다", { severity: "success" });
//     },
//     onError: (error) => {
//       console.error("❌ 메뉴 수정 실패:", error);
//       showNotification("메뉴 수정 실패", { severity: "error" });
//     },
//   });

//   const handleSubmit = () => {
//     const formData = new FormData();

//     // JSON 데이터
//     const requestData = {
//       name: menuData.name,
//       price: Number(menuData.price),
//       description: menuData.description,
//       categoryId: menuData.category,
//       optionCategories: menuData.optionCategories,
//       isSoldOut: menuData.isSoldOut,
//     };

//     formData.append(
//       "request",
//       new Blob([JSON.stringify(requestData)], {
//         type: "application/json",
//       })
//     );

//     // 새로운 이미지 파일이 있으면 추가
//     if (imageFile) {
//       formData.append("image", imageFile);
//     }

//     console.log("Request Data:", requestData);

//     if (mode === "create") {
//       createMutation.mutate(formData);
//     } else if (mode === "update" && editMenu) {
//       updateMutation.mutate({ id: editMenu.id, formData });
//     }

//     onConfirm();
//   };

//   const handleReset = () => {
//     setMenuData({
//       name: "",
//       price: "",
//       description: "",
//       category: "",
//       optionCategories: [],
//       isSoldOut: false,
//     });
//     setImageFile(null);
//     if (imagePreview && !imagePreview.startsWith("http")) {
//       URL.revokeObjectURL(imagePreview);
//     }
//     setImagePreview(null);
//     setIsDragOver(false);
//   };

//   const handleClose = () => {
//     handleReset();
//     onClose();
//   };

//   if (!isOpen) return null;

//   const isLoading = createMutation.isPending || updateMutation.isPending;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
//         <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
//           <div className="p-6">
//             {/* 닫기 버튼 */}
//             <button
//               onClick={handleClose}
//               className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
//               disabled={isLoading}
//             >
//               <ClosedIcon />
//             </button>

//             {/* 제목 */}
//             <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
//               {mode === "create" ? "새 메뉴 추가" : "메뉴 수정"}
//             </h2>

//             {/* 폼 내용 */}
//             <div className="space-y-4">
//               {/* 메뉴 이름 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   메뉴 이름{" "}
//                   <span className=" text-sm font-bold text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={menuData.name}
//                   onChange={handleInputChange}
//                   placeholder="예: 아메리카노"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* 메뉴 가격 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   기본 가격 (원){" "}
//                   <span className=" text-sm font-bold text-red-600">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={menuData.price}
//                   onChange={handleInputChange}
//                   placeholder="예: 4500"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* 카테고리 선택 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   카테고리{" "}
//                   <span className=" text-sm font-bold text-red-600">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={menuData.category}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                   required
//                   disabled={isLoading}
//                 >
//                   <option value="">카테고리를 선택하세요</option>
//                   {categories.map((category) => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* 메뉴 설명 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   메뉴 설명
//                 </label>
//                 <textarea
//                   name="description"
//                   value={menuData.description}
//                   onChange={handleInputChange}
//                   placeholder="메뉴에 대한 간단한 설명을 입력하세요"
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* 메뉴 이미지 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   메뉴 이미지
//                 </label>

//                 {!imagePreview ? (
//                   <div
//                     onDrop={handleDrop}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     className={`relative w-full h-32 border-2 border-dashed rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
//                       isDragOver
//                         ? "border-blue-400 bg-blue-50"
//                         : "border-gray-300"
//                     } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
//                   >
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       disabled={isLoading}
//                     />
//                     <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                       <svg
//                         className="w-8 h-8 mb-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                         />
//                       </svg>
//                       <p className="text-sm">
//                         이미지를 드래그하거나 클릭해서 업로드
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         JPG, PNG 파일만 가능
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="relative inline-block">
//                     <img
//                       src={imagePreview}
//                       alt="미리보기"
//                       className="w-32 h-32 object-cover rounded-lg border border-gray-200"
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
//                       type="button"
//                       disabled={isLoading}
//                     >
//                       <svg
//                         className="w-3 h-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* 옵션 카테고리 */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   적용 가능한 옵션
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {optionData.map((option) => (
//                     <label
//                       key={option}
//                       className={`flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
//                         isLoading ? "pointer-events-none opacity-50" : ""
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={menuData?.optionCategories?.includes(option)}
//                         onChange={() => handleOptionToggle(option)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         disabled={isLoading}
//                       />
//                       <span className="text-sm text-gray-700">{option}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* 버튼 그룹 */}
//             <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
//               <AcceptButton
//                 onClick={handleSubmit}
//                 className="text-sm !p-3"
//                 disabled={
//                   !menuData.name ||
//                   !menuData.price ||
//                   !menuData.category ||
//                   isLoading
//                 }
//               >
//                 {isLoading
//                   ? mode === "create"
//                     ? "등록 중..."
//                     : "수정 중..."
//                   : mode === "create"
//                   ? "메뉴 추가"
//                   : "메뉴 수정"}
//               </AcceptButton>
//               <CancelButton
//                 onClick={handleClose}
//                 className="text-sm !p-3"
//                 disabled={isLoading}
//               >
//                 취소
//               </CancelButton>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuFormModal;
import ClosedIcon from "@/components/ui/icon/ClosedIcon";
import AcceptButton from "@/components/ui/button/AcceptButton";
import CancelButton from "@/components/ui/button/CancelButton";
import React, { useState, useEffect } from "react";
import { useMenuStore, MenuItem } from "@/lib/store/MenuStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuAPI } from "@/lib/api/menu";
import { useShopStore } from "@/lib/store/shopStore";
import { useNotification } from "@/hooks/useNotification";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode: "create" | "update";
  editMenu?: MenuItem | null;
}

const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  mode,
  editMenu,
}) => {
  const queryClient = useQueryClient();
  const [menuData, setMenuData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    optionCategories: [] as string[], // 이름 배열로 유지
    isSoldOut: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { choosedShop } = useShopStore();
  const { categories, optionCategories: optionData } = useMenuStore();

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (mode === "update" && editMenu && isOpen) {
      setMenuData({
        name: editMenu.name,
        price: editMenu.price.toString(),
        description: editMenu.description,
        category: editMenu.categoryId || "",
        optionCategories: editMenu.optionCategoryIds || [], // 기존 이름 배열 그대로 사용
        isSoldOut: editMenu.isSoldOut,
      });

      // 기존 이미지가 있으면 미리보기 설정
      if (editMenu.imageUrl) {
        setImagePreview(editMenu.imageUrl);
      }
    } else if (mode === "create") {
      // 생성 모드일 때는 초기화
      handleReset();
    }
  }, [mode, editMenu, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setMenuData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setMenuData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview && !imagePreview.startsWith("http")) {
      // 새로 업로드한 이미지만 URL 해제 (기존 서버 이미지는 제외)
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleOptionToggle = (optionName: string) => {
    setMenuData((prev) => ({
      ...prev,
      optionCategories: prev.optionCategories.includes(optionName)
        ? prev.optionCategories.filter((opt) => opt !== optionName)
        : [...prev.optionCategories, optionName],
    }));
  };

  const showNotification = useNotification((state) => state.showNotification);

  // 생성 mutation
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return menuAPI.addMenu(choosedShop!.storeId, formData);
    },
    onSuccess: () => {
      console.log("메뉴 생성 성공:");
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      onClose();

      showNotification("메뉴가 등록되었습니다", { severity: "success" });
    },
    onError: (error) => {
      console.error("❌ 메뉴 생성 실패:", error);
      showNotification("메뉴 생성 실패", { severity: "error" });
    },
  });

  // 수정 mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      return menuAPI.updateMenu(choosedShop!.storeId, id, formData);
    },
    onSuccess: () => {
      console.log("메뉴 수정 성공:");
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      onClose();

      showNotification("메뉴 수정에 성공했습니다", { severity: "success" });
    },
    onError: (error) => {
      console.error("❌ 메뉴 수정 실패:", error);
      showNotification("메뉴 수정 실패", { severity: "error" });
    },
  });

  const handleSubmit = () => {
    const formData = new FormData();

    // 이름 배열을 ID 배열로 변환
    const optionCategoryIds = menuData.optionCategories
      .map((optionName) => {
        const option = optionData.find((opt) => opt.name === optionName);
        return option?.id;
      })
      .filter((id) => id !== undefined);

    // JSON 데이터
    const requestData = {
      name: menuData.name,
      price: Number(menuData.price),
      description: menuData.description,
      categoryId: Number(menuData.category),
      optionCategoryIds: JSON.stringify(optionCategoryIds), // ID 배열을 JSON 문자열로
      isSoldOut: menuData.isSoldOut,
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      })
    );

    // 새로운 이미지 파일이 있으면 추가
    if (imageFile) {
      formData.append("image", imageFile);
    }

    console.log("Request Data:", requestData);

    if (mode === "create") {
      createMutation.mutate(formData);
    } else if (mode === "update" && editMenu) {
      updateMutation.mutate({ id: editMenu.id, formData });
    }

    onConfirm();
  };

  const handleReset = () => {
    setMenuData({
      name: "",
      price: "",
      description: "",
      category: "",
      optionCategories: [],
      isSoldOut: false,
    });
    setImageFile(null);
    if (imagePreview && !imagePreview.startsWith("http")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setIsDragOver(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
        <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="p-6">
            {/* 닫기 버튼 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <ClosedIcon />
            </button>

            {/* 제목 */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
              {mode === "create" ? "새 메뉴 추가" : "메뉴 수정"}
            </h2>

            {/* 폼 내용 */}
            <div className="space-y-4">
              {/* 메뉴 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메뉴 이름{" "}
                  <span className=" text-sm font-bold text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={menuData.name}
                  onChange={handleInputChange}
                  placeholder="예: 아메리카노"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 메뉴 가격 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 가격 (원){" "}
                  <span className=" text-sm font-bold text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={menuData.price}
                  onChange={handleInputChange}
                  placeholder="예: 4500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 카테고리 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리{" "}
                  <span className=" text-sm font-bold text-red-600">*</span>
                </label>
                <select
                  name="category"
                  value={menuData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                  disabled={isLoading}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 메뉴 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메뉴 설명
                </label>
                <textarea
                  name="description"
                  value={menuData.description}
                  onChange={handleInputChange}
                  placeholder="메뉴에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* 메뉴 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메뉴 이미지
                </label>

                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative w-full h-32 border-2 border-dashed rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300"
                    } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <svg
                        className="w-8 h-8 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="text-sm">
                        이미지를 드래그하거나 클릭해서 업로드
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG 파일만 가능
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      type="button"
                      disabled={isLoading}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* 옵션 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  적용 가능한 옵션
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {optionData.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                        isLoading ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={menuData?.optionCategories?.includes(
                          option.name
                        )}
                        onChange={() => handleOptionToggle(option.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">
                        {option.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
              <AcceptButton
                onClick={handleSubmit}
                className="text-sm !p-3"
                disabled={
                  !menuData.name ||
                  !menuData.price ||
                  !menuData.category ||
                  isLoading
                }
              >
                {isLoading
                  ? mode === "create"
                    ? "등록 중..."
                    : "수정 중..."
                  : mode === "create"
                  ? "메뉴 추가"
                  : "메뉴 수정"}
              </AcceptButton>
              <CancelButton
                onClick={handleClose}
                className="text-sm !p-3"
                disabled={isLoading}
              >
                취소
              </CancelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFormModal;

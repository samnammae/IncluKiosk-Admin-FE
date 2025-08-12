"use client";
import ShopForm from "@/components/layout/ShopForm";
import { shopAPI } from "@/lib/api/shop";
import { use, useEffect, useState } from "react";
import ConfirmModal from "@/components/layout/modal/ConfirmModal";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  params: Promise<{ id: string }>;
}
export interface ShopDataType {
  storeId: string;
  name: string;
  phone: string;
  address: string;
  mainImg: string;
  createdAt: string;
  updatedAt: string;
  startPage: {
    introduction: string;
    logoImg: string;
    startBackground: string;
  };
  theme: {
    mainColor: string;
    subColor: string;
    textColor: string;
  };
}
export default function ShopUpdatePage(props: Props) {
  const params = use(props.params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 개별 매장 데이터 조회
  const {
    data: shopResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shop", params.id],
    queryFn: () => shopAPI.getShopById(params.id),
    select: (response) => (response.success ? response.data : null),
  });

  // 매장 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (shopId: string) => shopAPI.deleteShop(shopId),
    onSuccess: (response) => {
      if (response.success) {
        alert("매장이 삭제되었습니다.");
        // 매장 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ["shops"] });
        router.push("/dashboard/shop");
      } else {
        alert("매장 삭제에 실패했습니다.");
      }
    },
    onError: (error) => {
      console.error("매장 삭제 실패:", error);
      alert("매장 삭제 중 오류가 발생했습니다.");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(params.id);
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-8xl mx-auto p-2">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-200 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="max-w-8xl mx-auto p-2">
        <div className="bg-white rounded-xl p-10 shadow-sm">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">
              매장 정보를 불러오는데 실패했습니다.
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
            >
              뒤로가기
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }
  console.log(shopResponse);
  return (
    <>
      <ShopForm
        mode="edit"
        initialData={shopResponse}
        onDeleteClick={() => {
          setIsDeleteModalOpen(true);
        }}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        purpose={"매장"}
        targetName={shopResponse.name}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}

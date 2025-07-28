"use client";
import ShopForm from "@/components/layout/ShopForm";
import { shopAPI } from "@/lib/api/shop";
import { use, useEffect, useState } from "react";
import ConfirmModal from "@/components/layout/modal/ConfirmModal";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}
interface ShopDataType {
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
  const [shopData, setShopData] = useState<ShopDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //매장 조회 관련
  useEffect(() => {
    const loadShopData = async () => {
      try {
        const response = await shopAPI.getShopById(params.id);
        if (response.success) {
          setShopData(response.data);
        }
      } catch (error) {
        console.error("매장 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShopData();
  }, [params.id]);

  //삭제 관련
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDelte = async () => {
    setIsDeleteLoading(true);
    try {
      const response = await shopAPI.deleteShop(params.id);
      if (response.success) {
        alert("매장이 삭제되었습니다.");
        router.push("/dashboard/shop");
      } else alert("매장 삭제에 실패했습니다.");
    } catch (error) {
      console.error("매장 삭제 실패:", error);
    } finally {
      setIsDeleteLoading(false);
    }
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
  console.log(shopData);
  return (
    <>
      <ShopForm
        mode="edit"
        initialData={shopData}
        onDeleteClick={() => {
          setIsDeleteModalOpen(true);
        }}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelte}
        purpose={"매장"}
        targetName={shopData ? shopData.name : ""}
        isLoading={isDeleteLoading}
      />
    </>
  );
}

import { useRouter } from "next/navigation";
import React from "react";
interface StoreCardProps {
  storeId: number;
  image?: string | null;
  name: string;
  address: string;
  phone: string;
}
const ShopCard: React.FC<StoreCardProps> = ({
  storeId,
  image,
  name,
  address,
  phone,
}) => {
  const router = useRouter();
  return (
    <div
      className="w-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-80"
      onClick={() => {
        router.push(`/dashboard/shop/${storeId}`);
      }}
    >
      {/* 이미지 영역 */}
      <div className="w-full flex-[2] bg-gray-200 flex items-center justify-center">
        {image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${image}`}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">이미지 없음</span>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-3 flex-1 flex flex-col ">
        {/* 매장명 */}
        <h3 className="font-medium text-gray-900 text-lg mb-2 line-clamp-1">
          {name}
        </h3>

        {/* 주소 */}
        <p className="text-gray-700 text-sm mb-1 line-clamp-1">{address}</p>
        {/* 매장번호 */}
        <p className="text-gray-500 text-sm line-clamp-1 flex-1">{phone}</p>
      </div>
    </div>
  );
};

export default ShopCard;

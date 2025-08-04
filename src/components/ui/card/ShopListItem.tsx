import { ShopType } from "@/lib/store/shopStore";

interface ShopListItemProps {
  shop: ShopType;
}

const ShopListItem: React.FC<ShopListItemProps> = ({ shop }) => (
  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
      {shop.mainImg ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${shop.mainImg}`}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-gray-900 truncate">
        {shop.name}
      </h3>
      <p className="text-sm text-gray-600 truncate mt-1">{shop.address}</p>
      <p className="text-sm text-gray-500 mt-1">{shop.phone}</p>
    </div>
    <div className="flex gap-2 ml-4">
      <button
        onClick={() =>
          (window.location.href = `/dashboard/shop/${shop.storeId}`)
        }
        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        상세보기
      </button>
    </div>
  </div>
);

export default ShopListItem;

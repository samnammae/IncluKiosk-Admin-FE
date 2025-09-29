import { Row } from "@tanstack/react-table";
import { Order } from "./RecentTable";

export const OrderSubRow = ({ row }: { row: Row<Order> }) => {
  const order = row.original;
  return (
    <div className="bg-gray-50 border-l-4 border-blue-200 w-full">
      <div className="p-4 pl-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">주문 상품</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={`${order.orderId}-${item.menuId}-${index}`}
              className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {item.menuName}
                  </span>
                  <span className="text-sm text-gray-500">
                    × {item.quantity}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  금액: {new Intl.NumberFormat("ko-KR").format(item.basePrice)}
                  원
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {new Intl.NumberFormat("ko-KR").format(item.totalPrice)}원
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { createColumnHelper } from "@tanstack/react-table";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { Order } from "./RecentTable";

const columnHelper = createColumnHelper<Order>();
export const orderColumns = [
  columnHelper.display({
    id: "rowNumber",
    header: "#",
    meta: { flex: 0.5 },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.getIsExpanded() ? (
          <ExpandMoreOutlinedIcon className="w-4 h-4 text-gray-600" />
        ) : (
          <KeyboardArrowUpOutlinedIcon className="w-4 h-4 text-gray-600" />
        )}
        <span>{row.index + 1}</span>
      </div>
    ),
  }),
  columnHelper.accessor("orderNumber", {
    header: "주문번호",
    meta: { flex: 2 },
    cell: (info) => (
      <span className="font-medium text-gray-900">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "주문일시",
    meta: { flex: 1.5 },
  }),
  columnHelper.accessor("orderType", {
    header: "주문유형",
    meta: { flex: 1 },
    cell: (info) => {
      const value = info.getValue();
      const typeStyles = {
        STORE: "bg-purple-100 text-purple-800",
        TAKEOUT: "bg-orange-100 text-orange-800",
      };
      const typeText = { STORE: "매장", TAKEOUT: "포장" };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            typeStyles[value as keyof typeof typeStyles]
          }`}
        >
          {typeText[value as keyof typeof typeText]}
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "상태",
    meta: { flex: 1 },
    cell: (info) => {
      const value = info.getValue();
      const statusStyles = {
        READY: "bg-yellow-100 text-yellow-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        PROCESSING: "bg-blue-100 text-blue-800",
      };
      const statusText = {
        READY: "준비중",
        COMPLETED: "완료",
        CANCELLED: "취소",
        PROCESSING: "처리중",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusStyles[value as keyof typeof statusStyles]
          }`}
        >
          {statusText[value as keyof typeof statusText]}
        </span>
      );
    },
  }),
  columnHelper.accessor("items", {
    header: "주문 상품",
    meta: { flex: 4 },
    cell: (info) => {
      const items = info.getValue();
      return (
        <span className="text-sm w-full truncate">
          {items.map((item) => `${item.menuName}x${item.quantity}`).join(", ")}
        </span>
      );
    },
  }),
  columnHelper.accessor("totalItems", {
    header: "총 수량",
    meta: { flex: 1 },
    cell: (info) => `${info.getValue()}개`,
  }),
  columnHelper.accessor("totalAmount", {
    header: "총 금액",
    meta: { flex: 1.5 },
    cell: (info) => (
      <span className="font-medium text-gray-900 flex justify-end">
        {new Intl.NumberFormat("ko-KR").format(info.getValue())}원
      </span>
    ),
  }),
];

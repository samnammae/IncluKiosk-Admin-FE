import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/lib/api/dashboard";
import { useShopStore } from "@/lib/store/shopStore";
import { MenuItem } from "@/lib/store/MenuStore";
interface Order {
  orderId: string;
  orderNumber: string;
  storeId: number;
  storeName: string;
  orderType: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
}
type ChipColor = "default" | "error" | "success" | "warning";

// 주문 상태 색상 매핑
const getStatusColor = (status: string) => {
  switch (status) {
    case "READY":
      return "warning";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

// 주문 상태 한글 변환
const getStatusText = (status: string) => {
  switch (status) {
    case "READY":
      return "준비중";
    case "COMPLETED":
      return "완료";
    case "CANCELLED":
      return "취소됨";
    default:
      return status;
  }
};

// 주문 타입 한글 변환
const getOrderTypeText = (orderType: string) => {
  switch (orderType) {
    case "TAKEOUT":
      return "포장";
    case "STORE":
      return "매장";
    case "DELIVERY":
      return "배달";
    default:
      return orderType;
  }
};

// 결제 방법 한글 변환
const getPaymentMethodText = (paymentMethod: string) => {
  switch (paymentMethod) {
    case "CARD":
      return "카드";
    case "CASH":
      return "현금";
    case "MOBILE":
      return "모바일";
    default:
      return paymentMethod;
  }
};

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 금액 포맷팅
const formatAmount = (amount: number) => {
  return amount.toLocaleString("ko-KR") + "원";
};

const RecentMinitable = () => {
  const { choosedShop } = useShopStore();

  //데이터 fetch
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent", choosedShop],
    queryFn: () => dashboardAPI.getRecent(choosedShop!.storeId, 1, 5),
    enabled: !!choosedShop,
  });

  //데이터 로딩 및 에러처리
  if (isLoading) {
    return <div className="h-72 bg-gray-100 animate-pulse rounded-xl" />;
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center h-80">
        <span className="text-red-500 font-semibold">
          최근 주문내역 조회에서 오류가 발생했습니다!
        </span>
      </div>
    );
  }

  //데이터가 없는 경우
  const orders = data?.data?.orders;

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <span className="text-gray-500">최근 주문 내역이 없습니다</span>
      </div>
    );
  }
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="recent orders table">
          <TableHead>
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell>주문번호</TableCell>
              <TableCell>주문시간</TableCell>
              <TableCell align="center">주문타입</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">상품수</TableCell>
              <TableCell align="right">총 금액</TableCell>
              <TableCell align="center">결제방법</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: Order, index: number) => (
              <TableRow
                key={order.orderId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {order.orderNumber}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={getOrderTypeText(order.orderType)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{order.totalItems}개</TableCell>
                <TableCell align="right">
                  {formatAmount(order.totalAmount)}
                </TableCell>
                <TableCell align="center">
                  {getPaymentMethodText(order.paymentMethod)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RecentMinitable;

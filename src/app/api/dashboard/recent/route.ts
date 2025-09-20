import { NextRequest, NextResponse } from "next/server";

type Order = {
  orderId: string;
  orderNumber: string;
  storeId: string;
  storeName: string;
  orderType: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const storeId = searchParams.get("storeId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "20", 10);

  if (!storeId) {
    return NextResponse.json(
      { success: false, code: 400, message: "storeId is required" },
      { status: 400 }
    );
  }

  const authHeader = req.headers.get("authorization");

  // Spring 서버 호출
  const springRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/order/orders/${storeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    }
  );

  if (!springRes.ok) {
    return NextResponse.json(
      { success: false, code: springRes.status, message: "Spring 요청 실패" },
      { status: springRes.status }
    );
  }

  const springData = await springRes.json();
  const orders: Order[] = springData.data;

  // 최신순 정렬 (Spring에서 이미 최신순일 수도 있지만 안전하게 정렬)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = sortedOrders.length;
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const pagedOrders = sortedOrders.slice(startIndex, endIndex);

  const result = {
    success: true,
    code: 200,
    message: "최근 주문 내역 조회 성공",
    data: {
      page,
      size,
      total,
      orders: pagedOrders,
    },
  };

  return NextResponse.json(result);
}

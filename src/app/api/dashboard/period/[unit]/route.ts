import { NextRequest, NextResponse } from "next/server";

type Order = {
  orderId: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ unit: string }> }
) {
  const { unit } = await context.params; // daily | weekly | monthly
  const { searchParams } = req.nextUrl;

  const storeId = searchParams.get("storeId");
  const limit = parseInt(searchParams.get("limit") || "7", 10); // 기본 7개

  if (!storeId) {
    return NextResponse.json(
      { success: false, message: "storeId is required" },
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

  const springData = await springRes.json();
  const orders: Order[] = springData.data;

  // 그룹핑 키 생성 함수
  const groupKey = (date: Date) => {
    if (unit === "daily") {
      return date.toISOString().slice(0, 10); // YYYY-MM-DD
    }
    if (unit === "weekly") {
      const firstDayOfWeek = new Date(date);
      firstDayOfWeek.setDate(date.getDate() - date.getDay()); // 주 시작(일요일)
      return firstDayOfWeek.toISOString().slice(0, 10);
    }
    if (unit === "monthly") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`; // YYYY-MM
    }
    return date.toISOString().slice(0, 10);
  };

  // 그룹핑
  const grouped: Record<
    string,
    { totalAmount: number; totalItems: number; orderCount: number }
  > = {};

  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = groupKey(d);

    if (!grouped[key]) {
      grouped[key] = { totalAmount: 0, totalItems: 0, orderCount: 0 };
    }
    grouped[key].totalAmount += o.totalAmount;
    grouped[key].totalItems += o.totalItems;
    grouped[key].orderCount += 1;
  });

  // 최신순 정렬
  const labels = Object.keys(grouped).sort().slice(-limit);

  const result = {
    success: true,
    code: 200,
    message: "조회 성공",
    data: {
      labels,
      amounts: labels.map((l) => grouped[l].totalAmount),
      counts: labels.map((l) => grouped[l].orderCount),
      items: labels.map((l) => grouped[l].totalItems),
    },
  };

  return NextResponse.json(result);
}

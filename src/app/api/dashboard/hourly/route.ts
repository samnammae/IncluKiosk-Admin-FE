import { NextRequest, NextResponse } from "next/server";

type Order = {
  totalAmount: number;
  totalItems: number;
  createdAt: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const storeId = searchParams.get("storeId");

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

  // 24시간 배열 준비
  const makeEmptyArr = () => Array.from({ length: 24 }, () => 0);

  const dayData = makeEmptyArr();
  const weekData = makeEmptyArr();
  const monthData = makeEmptyArr();

  const now = new Date();
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setMonth(now.getMonth() - 1);

  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const hour = d.getHours();

    if (d.toISOString().slice(0, 10) === today) {
      dayData[hour] += o.totalAmount; // 오늘
    }
    if (d >= weekAgo) {
      weekData[hour] += o.totalAmount; // 최근 7일 합
    }
    if (d >= monthAgo) {
      monthData[hour] += o.totalAmount; // 최근 30일 합
    }
  });

  // 주간, 월간은 평균으로 환산
  const result = {
    success: true,
    code: 200,
    message: "시간대별 통계 조회 성공",
    data: {
      labels: Array.from(
        { length: 24 },
        (_, i) => `${i.toString().padStart(2, "0")}시`
      ),
      datasets: {
        day: dayData,
        week: weekData.map((v) => Math.round(v / 7)),
        month: monthData.map((v) => Math.round(v / 30)),
      },
    },
  };

  return NextResponse.json(result);
}

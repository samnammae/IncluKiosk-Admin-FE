import { NextRequest, NextResponse } from "next/server";

type Order = {
  orderId: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const unit = searchParams.get("unit") || "daily";
  const storeId = searchParams.get("storeId");
  const limit = parseInt(searchParams.get("limit") || "7", 10);

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

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
  let orders: Order[] = springData.data;

  // 기간 필터링
  if (startDate && endDate) {
    const start = new Date(startDate + "T00:00:00+09:00"); // 한국시간 0시
    const end = new Date(endDate + "T23:59:59+09:00"); // 한국시간 23:59
    orders = orders.filter((o) => {
      const d = toKST(new Date(o.createdAt + "Z"));
      return d >= start && d <= end;
    });
  }

  const toKST = (date: Date) => {
    return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  };

  // 그룹핑 키 생성 함수
  const groupKey = (date: Date) => {
    const kstDate = toKST(date);

    if (unit === "daily") {
      return kstDate.toISOString().slice(0, 10); // YYYY-MM-DD
    }
    if (unit === "weekly") {
      const firstDayOfWeek = new Date(kstDate);
      firstDayOfWeek.setDate(kstDate.getDate() - kstDate.getDay()); // 주 시작(일요일)
      return firstDayOfWeek.toISOString().slice(0, 10);
    }
    if (unit === "monthly") {
      return `${kstDate.getFullYear()}-${String(
        kstDate.getMonth() + 1
      ).padStart(2, "0")}`;
    }
    return kstDate.toISOString().slice(0, 10);
  };

  // 그룹핑
  const grouped: Record<
    string,
    { totalAmount: number; totalItems: number; orderCount: number }
  > = {};

  orders.forEach((o) => {
    const d = toKST(new Date(o.createdAt + "Z"));
    const key = groupKey(d);

    if (!grouped[key]) {
      grouped[key] = { totalAmount: 0, totalItems: 0, orderCount: 0 };
    }
    grouped[key].totalAmount += o.totalAmount;
    grouped[key].totalItems += o.totalItems;
    grouped[key].orderCount += 1;
  });

  // 정렬된 labels
  let labels = Object.keys(grouped).sort();

  // 기간 조회가 없을 때만 limit 적용
  if (!(startDate && endDate)) {
    labels = labels.slice(-limit);
  }

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

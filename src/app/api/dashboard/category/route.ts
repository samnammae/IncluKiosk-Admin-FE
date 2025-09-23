import { NextRequest, NextResponse } from "next/server";

type OrderItem = {
  menuId: string;
  menuName: string;
  quantity: number;
  totalPrice: number;
};

type Order = {
  createdAt: string;
  items: OrderItem[];
};
interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  optionCategoryIds: number[];
  isSoldOut: boolean;
}
type MenusByCategory = Record<string, Menu[]>;
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const storeId = searchParams.get("storeId");
  const type = searchParams.get("type") || "amount"; // amount | count

  if (!storeId) {
    return NextResponse.json(
      { success: false, code: 400, message: "storeId is required" },
      { status: 400 }
    );
  }

  const authHeader = req.headers.get("authorization");

  // 주문 데이터 조회
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
      {
        success: false,
        code: springRes.status,
        message: "Spring 전체 주문 조회 요청 실패",
      },
      { status: springRes.status }
    );
  }

  // 카테고리/메뉴 데이터 조회
  const categoryRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/menu/${storeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    }
  );

  if (!categoryRes.ok) {
    return NextResponse.json(
      {
        success: false,
        code: categoryRes.status,
        message: "Spring 메뉴 조회 요청 실패",
      },
      { status: categoryRes.status }
    );
  }

  const springData = await springRes.json();
  const categoryData = await categoryRes.json();

  console.log(categoryData);
  console.log(categoryData.data.menusByCategory);
  const orders: Order[] = springData.data;
  const categories: string[] = categoryData.data.categories;
  const menusByCategory: MenusByCategory = categoryData.data.menusByCategory;

  //g한글로 변환
  const toKST = (date: Date) =>
    new Date(date.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

  const now = toKST(new Date());
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD (한국 기준)

  const startOfWeek = toKST(new Date());
  startOfWeek.setDate(now.getDate() - now.getDay());

  const startOfMonth = toKST(new Date(now.getFullYear(), now.getMonth(), 1));

  // 📊 카테고리별 그룹핑 함수
  const groupByCategory = (orders: Order[]) => {
    const grouped: Record<string, number> = {};

    // 카테고리 초기화
    categories.forEach((cat) => {
      grouped[cat] = 0;
    });

    orders.forEach((o) => {
      o.items.forEach((item) => {
        let foundCategory: string | null = null;

        for (const [cat, menus] of Object.entries(menusByCategory)) {
          if (menus.some((m) => m.id === Number(item.menuId))) {
            foundCategory = cat;
            break;
          }
        }

        if (!foundCategory) {
          foundCategory = "기타";
          if (!grouped[foundCategory]) grouped[foundCategory] = 0;
        }

        if (type === "amount") {
          grouped[foundCategory] += item.totalPrice;
        } else {
          grouped[foundCategory] += item.quantity;
        }
      });
    });

    return {
      labels: Object.keys(grouped),
      values: Object.values(grouped),
    };
  };

  // 🔎 기간별 필터링
  const todayOrders = orders.filter(
    (o) => o.createdAt.slice(0, 10) === todayStr
  );
  const weekOrders = orders.filter((o) => new Date(o.createdAt) >= startOfWeek);
  const monthOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfMonth
  );

  const result = {
    success: true,
    code: 200,
    message: "카테고리별 통계 조회 성공",
    data: {
      today: groupByCategory(todayOrders),
      week: groupByCategory(weekOrders),
      month: groupByCategory(monthOrders),
      all: groupByCategory(orders),
    },
  };

  return NextResponse.json(result);
}

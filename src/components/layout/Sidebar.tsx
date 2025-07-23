"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "대시보드" },
    { href: "/dashboard/menu", label: "메뉴 관리" },
    { href: "/dashboard/shop", label: "매장 관리" },
    { href: "/dashboard/orders", label: "주문 관리" },
    { href: "/dashboard/statistics", label: "매출 통계" },
    { href: "/dashboard/settings", label: "설정" },
  ];

  return (
    <div className="w-60 bg-blue-900 min-h-screen">
      <div className="p-6 ">
        <h1 className="text-xl font-bold text-white">키오스크 관리자</h1>
      </div>

      <nav className="mt-8 px-3 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-6 py-4 text-white hover:bg-blue-800 transition-colors rounded-lg ${
              pathname === item.href ? "bg-blue-800 " : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

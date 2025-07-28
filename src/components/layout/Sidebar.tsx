"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SidebarShopList from "./SidebarShopList";

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
    <div className="fixed top-0 left-0 w-60 bg-gradient-to-b from-brand-main to-brand-dark text-white h-screen z-10">
      {/* 로고 */}
      <div className="p-5 pb-8 border-b border-white/10 mb-5">
        <h1 className="text-xl font-bold">키오스크 관리자</h1>
      </div>

      <SidebarShopList />

      {/* 네비게이션 메뉴 */}
      <nav className="px-5">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    block px-5 py-4 text-sm rounded-lg transition-all duration-200
                    border-l-3 relative
                    ${
                      isActive
                        ? "bg-white/10 text-white border-l-white"
                        : "text-white/80 border-l-transparent hover:bg-white/5 hover:text-white hover:border-l-white"
                    }
                  `}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="w-full h-16 flex justify-between items-center px-4">
        <div className="">IncluKiosk</div>
        <div className="flex gap-8">
          <Link href={"/dashboard"}>
            <div className="">대시보드</div>
          </Link>
          <div className="">로그인</div>
        </div>
      </header>
    </>
  );
}

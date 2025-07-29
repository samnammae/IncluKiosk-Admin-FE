import Link from "next/link";
import AcceptButton from "../ui/button/AcceptButton";

// 매장 없음 안내 컴포넌트
const NoShopGuide = ({ subText }: { subText: string }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          매장을 먼저 선택해주세요
        </h3>
        <p className="text-gray-600 text-sm">{subText}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard/shop">
          <AcceptButton className="px-4 py-2 text-sm">
            매장 관리로 이동
          </AcceptButton>
        </Link>
      </div>
    </div>
  );
};

export default NoShopGuide;

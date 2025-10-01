import { StaticImageData } from "next/image";
import K10 from "@/assets/mockups/10.webp";
import K2 from "@/assets/mockups/2.webp";
import K1 from "@/assets/mockups/1.webp";
import K4 from "@/assets/mockups/4.webp";
import K5 from "@/assets/mockups/5.webp";
import K6 from "@/assets/mockups/6.webp";
import K7 from "@/assets/mockups/7.webp";
import K8 from "@/assets/mockups/8.webp";
import K9 from "@/assets/mockups/9.webp";

export interface SectionType {
  id: number;
  title: string;
  description: string[][]; // 이중 배열
  images: StaticImageData[];
  isKiosk: boolean;
}

export const sections: SectionType[] = [
  {
    id: 0,
    title: "기본 키오스크 & 아이트래킹 주문",
    description: [
      ["터치 방식은 물론, 시선만으로도 메뉴를 선택할 수 있습니다."],
      ["보다 직관적이고 접근성 높은 사용자 경험을 제공합니다."],
      [
        "여러 매장 중 원하는 지점을 선택해 주문할 수 있어",
        "프랜차이즈 환경에서도 편리하게 활용할 수 있습니다.",
      ],
    ],
    images: [K10, K2, K1],
    isKiosk: true,
  },
  {
    id: 1,
    title: "자동 높이 조절 키오스크",
    description: [
      [
        "사용자의 위치와 신체 조건을 인식하여 화면 높이가 자동으로 조정됩니다.",
        "어린이, 휠체어 사용자, 일반 성인 모두 동일한 경험을 누릴 수 있습니다.",
      ],
    ],
    images: [K2], // 임의 이미지
    isKiosk: true,
  },
  {
    id: 2,
    title: "음성 & 챗봇 주문 기능",
    description: [
      [
        "음성 인식을 통해 화면 조작 없이 메뉴를 빠르게 주문할 수 있습니다.",
        "챗봇이 대화를 이어가며 사이즈, 옵션, 결제까지 순서대로 안내합니다.",
      ],
    ],
    images: [K4],
    isKiosk: true,
  },
  {
    id: 3,
    title: "스마트 관리자 페이지",
    description: [
      [
        "대시보드를 통해 통계와 시각화를 확인하고",
        "매출 현황을 한눈에 파악할 수 있습니다.",
      ],
      [
        "여러 매장을 운영하더라도 매장별 주문 내역과 데이터를 쉽게 관리할 수 있으며",
        "매장 정보 수정과 삭제 같은 운영 관리도 간편하게 수행할 수 있습니다.",
      ],
      [
        "메뉴 등록·수정·삭제와 함께 카테고리까지 관리할 수 있어",
        "전체 메뉴를 체계적으로 운영할 수 있습니다.",
      ],
      ["메뉴에 포함되는 다양한 옵션들을 손쉽게 추가·편집할 수 있습니다."],
      ["최근 주문 내역을 실시간으로 확인하고 관리할 수 있습니다."],
    ],
    images: [K5, K6, K7, K8, K9],
    isKiosk: false,
  },
];

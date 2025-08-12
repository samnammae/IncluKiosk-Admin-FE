import { create } from "zustand";
interface MenuStore {
  categories: categorieType[];
  lastDisplayOrder: number; //카테고리 생성시 맨 뒤 숫자
}
interface menuType {
  id: string; // 메뉴 ID
  name: string; // 메뉴 이름
  price: number; // 메뉴 기본 가격
  description: string; // 메뉴 설명
  image: string; // 메뉴 이미지 URL
  optionCategories: string[]; // 적용 가능한 옵션명 종류
  isSoldOut: false; // 품절 여부
}
interface categorieType {
  id: string; // 카테고리 ID
  name: string; // 카테고리 이름
  displayOrder: number; // 카테고리 표시 순서
}
export const useMenuStore = create<MenuStore>(() => ({
  categories: [],
  lastDisplayOrder: 0,
}));

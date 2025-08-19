import { create } from "zustand";

export interface MenuItem {
  id: string; // 메뉴 ID
  name: string; // 메뉴 이름
  price: number; // 메뉴 기본 가격
  description: string; // 메뉴 설명
  imageUrl: string; // 메뉴 이미지 URL
  optionCategories: string[]; // 적용 가능한 옵션명 종류
  isSoldOut: boolean; // 품절 여부
  categoryId?: string;
}

interface CategoryType {
  id: string; // 카테고리 ID
  name: string; // 카테고리 이름
  displayOrder: number; // 카테고리 표시 순서
}

interface MenuStore {
  // 데이터
  categories: CategoryType[];
  menus: Record<string, MenuItem[]>; // 카테고리별 메뉴 객체로 변경
  lastDisplayOrder: number; // 카테고리 생성시 맨 뒤 숫자

  // 액션
  setCategories: (categories: CategoryType[]) => void;
  setMenus: (menus: Record<string, MenuItem[]>) => void; // 타입 변경
  clearMenuData: () => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  categories: [],
  menus: {}, // 빈 객체로 초기화
  lastDisplayOrder: 0,

  setCategories: (categories: CategoryType[]) => {
    const lastOrder =
      categories.length > 0
        ? Math.max(...categories.map((cat) => cat.displayOrder))
        : 0;

    set({ categories, lastDisplayOrder: lastOrder });
  },
  setMenus: (menus: Record<string, MenuItem[]>) => set({ menus }), // 타입 변경

  clearMenuData: () =>
    set({
      categories: [],
      menus: {},
      lastDisplayOrder: 0,
    }),
}));

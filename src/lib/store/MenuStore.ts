import { create } from "zustand";

interface MenuType {
  id: string; // 메뉴 ID
  name: string; // 메뉴 이름
  price: number; // 메뉴 기본 가격
  description: string; // 메뉴 설명
  image: string; // 메뉴 이미지 URL
  optionCategories: string[]; // 적용 가능한 옵션명 종류
  isSoldOut: boolean; // 품절 여부
}

interface CategoryType {
  id: string; // 카테고리 ID
  name: string; // 카테고리 이름
  displayOrder: number; // 카테고리 표시 순서
}

interface MenuStore {
  // 데이터
  categories: CategoryType[];
  menus: MenuType[];
  lastDisplayOrder: number; // 카테고리 생성시 맨 뒤 숫자

  // 액션
  setCategories: (categories: CategoryType[]) => void;
  setMenus: (menus: MenuType[]) => void;
  clearMenuData: () => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  categories: [],
  menus: [],
  lastDisplayOrder: 0,

  setCategories: (categories: CategoryType[]) => {
    const lastOrder =
      categories.length > 0
        ? Math.max(...categories.map((cat) => cat.displayOrder))
        : 0;

    set({ categories, lastDisplayOrder: lastOrder });
  },
  setMenus: (menus: MenuType[]) => set({ menus }),

  clearMenuData: () =>
    set({
      categories: [],
      menus: [],
      lastDisplayOrder: 0,
    }),
}));

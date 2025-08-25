import { create } from "zustand";

export interface MenuItem {
  id: string; // 메뉴 ID
  name: string; // 메뉴 이름
  price: number; // 메뉴 기본 가격
  description: string; // 메뉴 설명
  imageUrl: string; // 메뉴 이미지 URL
  optionCategoryIds: string[]; // 적용 가능한 옵션명 종류
  isSoldOut: boolean; // 품절 여부
  categoryId?: string;
}

interface CategoryType {
  id: string; // 카테고리 ID
  name: string; // 카테고리 이름
  displayOrder: number; // 카테고리 표시 순서
}

export interface optionCategoriesType {
  id: number;
  name: string;
  options: OptionItem[];
  required: boolean;
  type: "SINGLE" | "MULTIPLE";
}
export interface OptionItem {
  default: boolean;
  id: number;
  name: string;
  price: number;
}
interface MenuStore {
  // 데이터
  categories: CategoryType[];
  menus: Record<string, MenuItem[]>; // 카테고리별 메뉴 객체로 변경
  lastDisplayOrder: number; // 카테고리 생성시 맨 뒤 숫자
  optionCategories: optionCategoriesType[];

  // 액션
  setCategories: (categories: CategoryType[]) => void;
  setMenus: (menus: Record<string, MenuItem[]>) => void; // 타입 변경
  clearMenuData: () => void;
  setOptionCategories: (optionCategories: optionCategoriesType[]) => void;
  updateCategories: (updatedCategories: CategoryType[]) => void; //카테고리 드래그 드롭 순서 변경
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  categories: [],
  menus: {},
  lastDisplayOrder: 0,
  optionCategories: [],

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
      optionCategories: [],
      lastDisplayOrder: 0,
    }),
  setOptionCategories: (optionCategories: optionCategoriesType[]) =>
    set({ optionCategories }),
  updateCategories: (updatedCategories: CategoryType[]) => {
    const lastOrder =
      updatedCategories.length > 0
        ? Math.max(...updatedCategories.map((cat) => cat.displayOrder))
        : 0;

    set({
      categories: updatedCategories,
      lastDisplayOrder: lastOrder,
    });
  },
}));

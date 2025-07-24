import { create } from "zustand";

interface ShopType {
  storeId: string | number;
  name: string;
  phone: string;
  address: string;
  mainImg: string;
  createdAt: string;
  updatedAt: string;
}

interface ShopStore {
  totalCount: number;
  shops: ShopType[];
  chooseShop: ShopType | null;
  setShops: (shops: ShopType[], totalCount: number) => void;
  setChooseShop: (shop: ShopType | null) => void;
}

export const useShopStore = create<ShopStore>((set) => ({
  totalCount: 0,
  shops: [] as ShopType[],
  chooseShop: null as ShopType | null,

  setShops: (shops: ShopType[], totalCount: number) =>
    set({ shops, totalCount }),

  setChooseShop: (shop: ShopType | null) => set({ chooseShop: shop }),
}));
